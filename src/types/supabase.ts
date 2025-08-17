export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password_hash: string;
          first_name: string;
          last_name: string;
          date_of_birth: string | null;
          gender: 'male' | 'female' | 'other' | null;
          height_cm: number | null;
          weight_kg: number | null;
          activity_level:
            | 'sedentary'
            | 'lightly_active'
            | 'moderately_active'
            | 'very_active'
            | 'extremely_active'
            | null;
          fitness_goals: string[] | null;
          dietary_restrictions: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password_hash: string;
          first_name: string;
          last_name: string;
          date_of_birth?: string | null;
          gender?: 'male' | 'female' | 'other' | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          activity_level?:
            | 'sedentary'
            | 'lightly_active'
            | 'moderately_active'
            | 'very_active'
            | 'extremely_active'
            | null;
          fitness_goals?: string[] | null;
          dietary_restrictions?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password_hash?: string;
          first_name?: string;
          last_name?: string;
          date_of_birth?: string | null;
          gender?: 'male' | 'female' | 'other' | null;
          height_cm?: number | null;
          weight_kg?: number | null;
          activity_level?:
            | 'sedentary'
            | 'lightly_active'
            | 'moderately_active'
            | 'very_active'
            | 'extremely_active'
            | null;
          fitness_goals?: string[] | null;
          dietary_restrictions?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          muscle_group: string | null;
          equipment: string | null;
          difficulty_level: 'beginner' | 'intermediate' | 'advanced' | null;
          instructions: string | null;
          video_url: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          muscle_group?: string | null;
          equipment?: string | null;
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null;
          instructions?: string | null;
          video_url?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          muscle_group?: string | null;
          equipment?: string | null;
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced' | null;
          instructions?: string | null;
          video_url?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      foods: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          calories_per_100g: number | null;
          protein_g: number | null;
          carbs_g: number | null;
          fat_g: number | null;
          fiber_g: number | null;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          calories_per_100g?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          fiber_g?: number | null;
          category?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          calories_per_100g?: number | null;
          protein_g?: number | null;
          carbs_g?: number | null;
          fat_g?: number | null;
          fiber_g?: number | null;
          category?: string | null;
          created_at?: string;
        };
      };
      workout_plans: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          duration_weeks: number | null;
          difficulty_level: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          duration_weeks?: number | null;
          difficulty_level?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          duration_weeks?: number | null;
          difficulty_level?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      meal_plans: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          daily_calories: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          daily_calories?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          daily_calories?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_logs: {
        Row: {
          id: string;
          user_id: string;
          log_type: 'weight' | 'workout' | 'meal' | 'progress';
          data: any;
          log_date: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          log_type: 'weight' | 'workout' | 'meal' | 'progress';
          data: any;
          log_date: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          log_type?: 'weight' | 'workout' | 'meal' | 'progress';
          data?: any;
          log_date?: string;
          created_at?: string;
        };
      };
      workout_exercises: {
        Row: {
          id: string;
          workout_plan_id: string;
          exercise_id: string;
          sets: number | null;
          reps: number | null;
          duration_seconds: number | null;
          rest_seconds: number | null;
          day_of_week: number | null;
          week_number: number | null;
          order_index: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workout_plan_id: string;
          exercise_id: string;
          sets?: number | null;
          reps?: number | null;
          duration_seconds?: number | null;
          rest_seconds?: number | null;
          day_of_week?: number | null;
          week_number?: number | null;
          order_index?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          workout_plan_id?: string;
          exercise_id?: string;
          sets?: number | null;
          reps?: number | null;
          duration_seconds?: number | null;
          rest_seconds?: number | null;
          day_of_week?: number | null;
          week_number?: number | null;
          order_index?: number | null;
          created_at?: string;
        };
      };
      meal_foods: {
        Row: {
          id: string;
          meal_plan_id: string;
          food_id: string;
          quantity_g: number | null;
          meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
          day_of_week: number | null;
          order_index: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          meal_plan_id: string;
          food_id: string;
          quantity_g?: number | null;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
          day_of_week?: number | null;
          order_index?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          meal_plan_id?: string;
          food_id?: string;
          quantity_g?: number | null;
          meal_type?: 'breakfast' | 'lunch' | 'dinner' | 'snack' | null;
          day_of_week?: number | null;
          order_index?: number | null;
          created_at?: string;
        };
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type Inserts<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type Updates<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];
