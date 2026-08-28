export interface FoodRow {
  name: string;
  description: string | null;
  calories_per_100g: number | null;
  protein_g: number | null;
  carbs_g: number | null;
  fat_g: number | null;
  fiber_g: number | null;
  category: string | null;
}

export interface ExerciseRow {
  name: string;
  description: string | null;
  muscle_group: string | null;
  equipment: string | null;
  difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null;
  instructions: string | null;
  video_url: string | null;
  image_url: string | null;
}
