import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { ExerciseRow } from './types';

const WGER_BASE = 'https://wger.de/api/v2';

// wger exercise category IDs
const CategoryID = {
  STRENGTH: 8,
  STRETCHING: 9,
  PLYOMETRICS: 10,
  CARDIO: 15,
  OTHER: 13,
} as const;

// Maps wger muscle names (name_en) to the app's muscle_group values.
const MUSCLE_GROUP_MAP: Record<string, string> = {
  'Pectoralis major': 'chest',
  'Pectoralis minor': 'chest',
  'Serratus anterior': 'shoulders',
  'Anterior deltoid': 'shoulders',
  'Lateral deltoid': 'shoulders',
  'Posterior deltoid': 'shoulders',
  Trapezius: 'back',
  'Latissimus dorsi': 'back',
  'Teres major': 'back',
  'Teres minor': 'back',
  'Erector spinae': 'back',
  Rhomboids: 'back',
  'Biceps brachii': 'arms',
  'Triceps brachii': 'arms',
  Brachialis: 'arms',
  Brachioradialis: 'arms',
  Forearm: 'arms',
  'Quadriceps femoris': 'legs',
  'Biceps femoris': 'legs',
  Semitendinosus: 'legs',
  'Gluteus maximus': 'legs',
  'Gluteus medius': 'legs',
  Adductors: 'legs',
  Abductors: 'legs',
  Soleus: 'legs',
  Gastrocnemius: 'legs',
  'Tibialis anterior': 'legs',
  'Rectus abdominis': 'core',
  'Transverse abdominis': 'core',
  'Obliquus externus abdominis': 'core',
  'Internal obliques': 'core',
  Deltoid: 'shoulders',
  Hamstrings: 'legs',
};

const DEFAULT_MUSCLE = 'full_body';

// Maps wger equipment names to the app's equipment values.
const EQUIPMENT_MAP: Record<string, string> = {
  'none (bodyweight exercise)': 'bodyweight',
  'swiss ball': 'bodyweight',
  'gym mat': 'bodyweight',
  barbell: 'barbell',
  'ez barbell': 'barbell',
  dumbbell: 'dumbbell',
  kettlebell: 'kettlebell',
  bands: 'resistance_band',
  cable: 'resistance_band',
  bench: 'machine',
  suspension: 'bodyweight',
};

const DEFAULT_EQUIPMENT = 'bodyweight';

interface WgerEquipmentEntry {
  id: number;
  name: string;
}

interface WgerMuscleEntry {
  id: number;
  name: string;
  name_en?: string;
}

interface WgerTranslation {
  id: number;
  language?: number;
  name?: string;
  description?: string;
}

interface WgerExerciseInfo {
  id: number;
  category?: { id?: number; name?: string };
  muscles?: WgerMuscleEntry[];
  muscles_secondary?: WgerMuscleEntry[];
  equipment?: WgerEquipmentEntry[];
  images?: Array<{ image?: string }>;
  translations?: WgerTranslation[];
}

interface WgerListResponse {
  count?: number;
  next?: string | null;
  results?: WgerExerciseInfo[];
}

function stripHtml(html?: string): string {
  if (!html) return '';
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchAllExercises(): Promise<WgerExerciseInfo[]> {
  const all: WgerExerciseInfo[] = [];
  let url: string | null = `${WGER_BASE}/exerciseinfo/?language=2&limit=200`;

  while (url) {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) {
      throw new Error(`wger request failed (${res.status}): ${url}`);
    }
    const data = (await res.json()) as WgerListResponse;
    if (data.results) all.push(...data.results);
    url = data.next ? data.next : null;
  }

  return all;
}

function getEnglishTranslation(info: WgerExerciseInfo): WgerTranslation | undefined {
  if (!info.translations) return undefined;
  return info.translations.find(t => t.language === 2 || t.language === undefined);
}

function mapMuscleGroup(info: WgerExerciseInfo): string {
  if (!info.muscles) return DEFAULT_MUSCLE;
  for (const muscle of info.muscles) {
    const mapped = MUSCLE_GROUP_MAP[muscle.name_en || muscle.name];
    if (mapped) return mapped;
  }
  return DEFAULT_MUSCLE;
}

function mapEquipment(info: WgerExerciseInfo): string {
  if (!info.equipment || info.equipment.length === 0) return DEFAULT_EQUIPMENT;
  for (const equip of info.equipment) {
    const mapped = EQUIPMENT_MAP[equip.name];
    if (mapped) return mapped;
  }
  return DEFAULT_EQUIPMENT;
}

function mapDifficulty(info: WgerExerciseInfo): 'beginner' | 'intermediate' | 'advanced' {
  const categoryId = info.category?.id;
  if (categoryId === CategoryID.STRETCHING || categoryId === CategoryID.OTHER) {
    return 'beginner';
  }
  return 'intermediate';
}

function toExerciseRow(info: WgerExerciseInfo): ExerciseRow | null {
  const translation = getEnglishTranslation(info);
  const name = translation?.name?.trim();
  if (!name) return null;

  const payload: ExerciseRow = {
    name,
    description: stripHtml(translation?.description) || null,
    muscle_group: mapMuscleGroup(info),
    equipment: mapEquipment(info),
    difficulty_level: mapDifficulty(info),
    instructions: stripHtml(translation?.description) || null,
    video_url: null,
    image_url: info.images && info.images.length > 0 ? (info.images[0]?.image ?? null) : null,
  };
  return payload;
}

export async function seedExercises(): Promise<{ inserted: number; skipped: number }> {
  const supabaseUrl = process.env['SUPABASE_URL'];
  const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log('  Fetching exercises from wger...');
  const all = await fetchAllExercises();
  console.log(`  Fetched ${all.length} exercises`);

  let inserted = 0;
  let skipped = 0;

  for (const info of all) {
    const row = toExerciseRow(info);
    if (!row) {
      skipped += 1;
      continue;
    }
    const { error } = await supabase
      .from('exercises')
      .upsert(row, { onConflict: 'name', ignoreDuplicates: true });
    if (error) {
      console.error(`  ❌ DB error for "${row.name}":`, error.message);
      skipped += 1;
    } else {
      inserted += 1;
    }
  }

  return { inserted, skipped };
}
