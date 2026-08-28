import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { FoodRow } from './types';

const USDA_BASE = 'https://api.nal.usda.gov/fdc/v1';

// USDA nutrient numbers
const NutrientID = {
  ENERGY_KCAL: 1008,
  PROTEIN: 1003,
  CARBOHYDRATE: 1005,
  FAT: 1004,
  FIBER: 1079,
} as const;

interface UsdaFood {
  fdcId: number;
  description: string;
  dataType?: string;
  foodNutrients?: Array<{
    nutrientNumber: string;
    nutrient?: { number?: string; name?: string };
    value?: number;
  }>;
}

interface UsdaSearchResponse {
  foods: UsdaFood[];
}

// Curated list of base foods and their expected macro category.
// The category maps to the FOOD_CATEGORIES used by the app.
const BASE_FOODS: Array<{ query: string; category: string }> = [
  { query: 'chicken breast raw', category: 'protein' },
  { query: 'chicken thigh raw', category: 'protein' },
  { query: 'turkey breast raw', category: 'protein' },
  { query: 'ground beef 93% lean raw', category: 'protein' },
  { query: 'salmon raw', category: 'protein' },
  { query: 'tuna canned in water', category: 'protein' },
  { query: 'shrimp raw', category: 'protein' },
  { query: 'egg whole raw', category: 'protein' },
  { query: 'egg white raw', category: 'protein' },
  { query: 'tofu firm', category: 'protein' },
  { query: 'lentils cooked', category: 'protein' },
  { query: 'chickpeas cooked', category: 'protein' },
  { query: 'black beans cooked', category: 'protein' },
  { query: 'greek yogurt plain nonfat', category: 'dairy' },
  { query: 'milk whole', category: 'dairy' },
  { query: 'cottage cheese lowfat', category: 'dairy' },
  { query: 'cheddar cheese', category: 'dairy' },
  { query: 'mozzarella cheese', category: 'dairy' },
  { query: 'white rice cooked', category: 'carb' },
  { query: 'brown rice cooked', category: 'carb' },
  { query: 'oats dry', category: 'grain' },
  { query: 'whole wheat bread', category: 'grain' },
  { query: 'potato baked', category: 'carb' },
  { query: 'sweet potato baked', category: 'carb' },
  { query: 'quinoa cooked', category: 'carb' },
  { query: 'pasta whole wheat cooked', category: 'carb' },
  { query: 'banana', category: 'fruit' },
  { query: 'apple raw', category: 'fruit' },
  { query: 'orange raw', category: 'fruit' },
  { query: 'blueberries raw', category: 'fruit' },
  { query: 'strawberries raw', category: 'fruit' },
  { query: 'avocado raw', category: 'fat' },
  { query: 'olive oil', category: 'fat' },
  { query: 'almonds', category: 'fat' },
  { query: 'peanut butter', category: 'fat' },
  { query: 'walnuts', category: 'fat' },
  { query: 'broccoli raw', category: 'vegetable' },
  { query: 'spinach raw', category: 'vegetable' },
  { query: 'kale raw', category: 'vegetable' },
  { query: 'carrots raw', category: 'vegetable' },
  { query: 'tomato raw', category: 'vegetable' },
  { query: 'cucumber raw', category: 'vegetable' },
  { query: 'bell pepper raw', category: 'vegetable' },
  { query: 'zucchini raw', category: 'vegetable' },
  { query: 'green beans raw', category: 'vegetable' },
  { query: 'cauliflower raw', category: 'vegetable' },
  { query: 'onion raw', category: 'vegetable' },
  { query: 'garlic raw', category: 'vegetable' },
  { query: 'greek salad dressing', category: 'fat' },
];

function getNutrient(food: UsdaFood, nutrientId: number): number | null {
  if (!food.foodNutrients) return null;
  for (const n of food.foodNutrients) {
    const num = n.nutrientNumber || n.nutrient?.number;
    if (num && parseInt(num, 10) === nutrientId) {
      return typeof n.value === 'number' ? n.value : null;
    }
  }
  return null;
}

function capitalize(s: string | null | undefined): string | null {
  if (!s) return null;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

async function searchFood(apiKey: string, query: string): Promise<UsdaFood | null> {
  const url = new URL(`${USDA_BASE}/foods/search`);
  url.searchParams.set('api_key', apiKey);
  url.searchParams.set('query', query);
  url.searchParams.set('dataType', 'Foundation,SR Legacy');
  url.searchParams.set('pageSize', '1');
  url.searchParams.set('requireAllWords', 'true');

  const res = await fetch(url.toString(), { signal: AbortSignal.timeout(15000) });
  if (!res.ok) {
    console.error(`  ⚠️ USDA search failed (${res.status}) for "${query}"`);
    return null;
  }

  const data = (await res.json()) as UsdaSearchResponse;
  return data.foods && data.foods.length > 0 ? (data.foods[0] as UsdaFood) : null;
}

function toFoodRow(food: UsdaFood, category: string): FoodRow {
  const name = food.description.trim();
  return {
    name,
    description: capitalize(name),
    calories_per_100g: getNutrient(food, NutrientID.ENERGY_KCAL),
    protein_g: getNutrient(food, NutrientID.PROTEIN),
    carbs_g: getNutrient(food, NutrientID.CARBOHYDRATE),
    fat_g: getNutrient(food, NutrientID.FAT),
    fiber_g: getNutrient(food, NutrientID.FIBER),
    category,
  };
}

export async function seedFoods(apiKey: string): Promise<{ inserted: number; failed: string[] }> {
  const supabaseUrl = process.env['SUPABASE_URL'];
  const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY'];
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required');
  }

  const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  let inserted = 0;
  const failed: string[] = [];

  for (const base of BASE_FOODS) {
    const found = await searchFood(apiKey, base.query);
    if (!found) {
      failed.push(base.query);
      console.log(`  ❌ No match for "${base.query}"`);
      continue;
    }

    const row = toFoodRow(found, base.category);
    const { error } = await supabase
      .from('foods')
      .upsert(row, { onConflict: 'name', ignoreDuplicates: true });

    if (error) {
      failed.push(base.query);
      console.error(`  ❌ DB error for "${base.query}":`, error.message);
    } else {
      inserted += 1;
      console.log(`  ✅ ${row.name} [${base.category}]`);
    }
  }

  return { inserted, failed };
}
