// AI utility functions with ModelFusion and Ollama
import crypto from 'crypto';
import { generateObject, jsonObjectPrompt, ollama, zodSchema } from 'modelfusion';
import OpenAI from 'openai';
import { getSupabase } from '../config/supabase';
import { ExerciseData, ExerciseSchema, FoodData, FoodSchema } from '../schemas/ai';
import { FitnessRecommendations, MealPlan, WorkoutPlan } from '../types';

// Initialize OpenAI (only if API key is available)
let openai: OpenAI | null = null;
if (process.env['OPENAI_API_KEY']) {
  openai = new OpenAI({
    apiKey: process.env['OPENAI_API_KEY'],
  });
}

// Helper function to generate AI responses
const generateAIResponse = async (prompt: string, systemPrompt?: string): Promise<string> => {
  if (!openai) {
    throw new Error('OpenAI API key not configured');
  }

  try {
    const messages: any[] = [];
    if (systemPrompt) {
      messages.push({ role: 'system', content: systemPrompt });
    }
    messages.push({ role: 'user', content: prompt });

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI error:', error);
    throw new Error('Error generating AI response');
  }
};

interface MealPlanRequest {
  user: any;
  date: Date;
  preferences: Record<string, any>;
  restrictions: string[];
  targetCalories: number;
}

interface WorkoutPlanRequest {
  user: any;
  date: Date;
  focus: string;
  duration: number;
  equipment: string[];
}

/**
 * Generates a personalized meal plan
 */
const generateMealPlan = async ({
  user,
  date,
  preferences,
  restrictions,
  targetCalories,
}: MealPlanRequest): Promise<MealPlan> => {
  try {
    if (openai) {
      // Use OpenAI to generate personalized plan
      const systemPrompt = `You are an expert nutritionist. Generate healthy and personalized meal plans.
      Respond ONLY with a valid JSON that contains:
      {
        "meals": {
          "breakfast": {"name": "Name", "foods": [{"name": "Food", "calories": X, "protein": X, "carbs": X, "fat": X}], "totalCalories": X},
          "lunch": {...},
          "dinner": {...},
          "snacks": [{"name": "Food", "calories": X, "protein": X, "carbs": X, "fat": X}]
        },
        "totalCalories": X,
        "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
      }`;

      const userPrompt = `Generate a meal plan for ${date.toDateString()} with these characteristics:
      - User: ${user.name}, ${user.age} years old, ${user.weight}kg, ${user.height}cm
      - Goal: ${user.goal}
      - Activity level: ${user.activityLevel}
      - Target calories: ${targetCalories}
      - Restrictions: ${restrictions.join(', ') || 'None'}
      - Preferences: ${
        Object.entries(preferences)
          .map(([k, v]) => `${k}: ${v}`)
          .join(', ') || 'None'
      }
      
      Make sure the total calories are close to ${targetCalories} and that it's healthy and varied.`;

      const response = await generateAIResponse(userPrompt, systemPrompt);
      const aiPlan = JSON.parse(response);

      return {
        meals: aiPlan.meals,
        totalCalories: aiPlan.totalCalories,
        recommendations: aiPlan.recommendations || [],
      };
    }
    // Fallback to basic implementation
    return generateBasicMealPlan({ user, date, preferences, restrictions, targetCalories });
  } catch (error) {
    console.error('Error generating meal plan:', error);
    // Fallback to basic implementation in case of error
    return generateBasicMealPlan({ user, date, preferences, restrictions, targetCalories });
  }
};

/**
 * Generates a personalized workout plan
 */
const generateWorkoutPlan = async ({
  user,
  date,
  focus,
  duration,
  equipment,
}: WorkoutPlanRequest): Promise<WorkoutPlan> => {
  try {
    if (openai) {
      // Use OpenAI to generate personalized plan
      const systemPrompt = `You are an expert personal trainer. Generate personalized workout plans.
      Respond ONLY with a valid JSON that contains:
      {
        "exercises": [
          {
            "name": "Exercise name",
            "sets": X,
            "reps": X,
            "duration": X,
            "rest": X,
            "instructions": ["Instruction 1", "Instruction 2"]
          }
        ],
        "duration": X,
        "focus": "workout_type",
        "difficulty": "beginner/intermediate/advanced",
        "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
      }`;

      const userPrompt = `Generate a workout plan for ${date.toDateString()} with these characteristics:
      - User: ${user.name}, ${user.age} years old, ${user.weight}kg, ${user.height}cm
      - Goal: ${user.goal}
      - Activity level: ${user.activityLevel}
      - Focus: ${focus}
      - Duration: ${duration} minutes
      - Available equipment: ${equipment.join(', ')}
      
      Make sure it's appropriate for the user's level and includes warm-up and cool-down.`;

      const response = await generateAIResponse(userPrompt, systemPrompt);
      const aiPlan = JSON.parse(response);

      return {
        exercises: aiPlan.exercises,
        duration: aiPlan.duration,
        focus: aiPlan.focus,
        difficulty: aiPlan.difficulty,
        recommendations: aiPlan.recommendations,
      };
    }
    // Fallback to basic implementation
    return generateBasicWorkoutPlan({ user, date, focus, duration, equipment });
  } catch (error) {
    console.error('Error generating workout plan:', error);
    // Fallback to basic implementation in case of error
    return generateBasicWorkoutPlan({ user, date, focus, duration, equipment });
  }
};

/**
 * Generates personalized fitness recommendations
 */
const getFitnessRecommendations = async (userData: any): Promise<FitnessRecommendations> => {
  try {
    if (openai) {
      // Use OpenAI to generate personalized recommendations
      const systemPrompt = `You are an expert in fitness and nutrition. Generate personalized recommendations.
      Respond ONLY with a valid JSON that contains:
      {
        "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3", "Recommendation 4", "Recommendation 5"],
        "goal": "user_goal",
        "activityLevel": "activity_level",
        "estimatedCalories": X
      }`;

      const userPrompt = `Generate fitness recommendations for a user with these characteristics:
      - Age: ${userData.age || 'Not specified'}
      - Weight: ${userData.weight || 'Not specified'} kg
      - Height: ${userData.height || 'Not specified'} cm
      - Goal: ${userData.goal || 'fitness'}
      - Activity level: ${userData.activityLevel || 'moderate'}
      
      Generate 5 specific and practical recommendations that are relevant for this profile.`;

      const response = await generateAIResponse(userPrompt, systemPrompt);
      const aiRecommendations = JSON.parse(response);

      return {
        general: aiRecommendations.recommendations || [],
        nutrition: [],
        exercise: [],
        lifestyle: [],
        recommendations: aiRecommendations.recommendations || [],
        goal: aiRecommendations.goal,
        activityLevel: aiRecommendations.activityLevel,
        estimatedCalories: aiRecommendations.estimatedCalories || 2000,
      };
    }
    // Fallback to basic implementation
    return getBasicRecommendations(userData);
  } catch (error) {
    console.error('Error generating recommendations:', error);
    // Fallback to basic recommendations in case of error
    return getBasicRecommendations(userData);
  }
};

// Helper function for basic recommendations
const getBasicRecommendations = (userData: any): FitnessRecommendations => {
  const { goal, activityLevel } = userData;

  const recommendations = [
    'Drink at least 8 glasses of water per day',
    'Eat 5-7 servings of fruits and vegetables daily',
    'Maintain a consistent sleep schedule',
    'Engage in regular physical activity',
    'Eat a balanced diet',
  ];

  return {
    general: recommendations,
    nutrition: [],
    exercise: [],
    lifestyle: [],
    recommendations,
    goal: goal || 'fitness',
    activityLevel: activityLevel || 'moderate',
    estimatedCalories: calculateEstimatedCalories(userData) || 2000,
  };
};

/**
 * Calculates estimated calories based on user profile
 */
const calculateEstimatedCalories = (userData: any): number | null => {
  const { age, weight, height, activityLevel, goal } = userData;

  if (!weight || !height || !age) {
    return null;
  }

  // Mifflin-St Jeor formula for BMR
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5; // For men
  // For women: 10 * weight + 6.25 * height - 5 * age - 161

  // Activity multipliers
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very: 1.725,
    extreme: 1.9,
  };

  const tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

  // Adjust based on goal
  const goalAdjustments: Record<string, number> = {
    lose_weight: -500,
    gain_muscle: 300,
    maintain: 0,
  };

  return Math.round(tdee + (goalAdjustments[goal] || 0));
};

// Basic fallback implementations
const generateBasicMealPlan = (_: MealPlanRequest): MealPlan => {
  const meals = {
    breakfast: {
      name: 'Balanced Breakfast',
      foods: [
        { name: 'Oatmeal', calories: 150, protein: 6, carbs: 27, fat: 3 },
        { name: 'Banana', calories: 105, protein: 1, carbs: 27, fat: 0 },
        { name: 'Almonds', calories: 164, protein: 6, carbs: 6, fat: 14 },
      ],
      totalCalories: 419,
    },
    lunch: {
      name: 'Protein Lunch',
      foods: [
        {
          name: 'Chicken Breast',
          calories: 165,
          protein: 31,
          carbs: 0,
          fat: 3.6,
        },
        {
          name: 'Brown Rice',
          calories: 216,
          protein: 4.5,
          carbs: 45,
          fat: 1.8,
        },
        {
          name: 'Broccoli',
          calories: 55,
          protein: 3.7,
          carbs: 11,
          fat: 0.6,
        },
      ],
      totalCalories: 436,
    },
    dinner: {
      name: 'Light Dinner',
      foods: [
        {
          name: 'Salmon',
          calories: 208,
          protein: 25,
          carbs: 0,
          fat: 12,
        },
        {
          name: 'Quinoa',
          calories: 222,
          protein: 8,
          carbs: 39,
          fat: 3.6,
        },
        {
          name: 'Spinach',
          calories: 23,
          protein: 2.9,
          carbs: 3.6,
          fat: 0.4,
        },
      ],
      totalCalories: 453,
    },
    snacks: [
      {
        name: 'Greek Yogurt',
        calories: 130,
        protein: 20,
        carbs: 9,
        fat: 0.5,
      },
      {
        name: 'Apple',
        calories: 95,
        protein: 0.5,
        carbs: 25,
        fat: 0.3,
      },
    ],
  };

  const totalCalories =
    meals.breakfast.totalCalories +
    meals.lunch.totalCalories +
    meals.dinner.totalCalories +
    meals.snacks.reduce((sum, snack) => sum + snack.calories, 0);

  return {
    meals,
    totalCalories,
    recommendations: [
      'Drink at least 8 glasses of water per day',
      'Eat slowly and chew well',
      'Include protein in every meal',
      'Prioritize whole foods over processed ones',
    ],
  };
};

const generateBasicWorkoutPlan = (_: WorkoutPlanRequest): WorkoutPlan => {
  const exercises: Array<{
    name: string;
    sets: number;
    reps: number;
    duration: number;
    rest: number;
    instructions: string[];
  }> = [
    {
      name: 'Squats',
      sets: 3,
      reps: 12,
      duration: 0,
      rest: 60,
      instructions: [
        'Stand with feet shoulder-width apart',
        'Lower down as if sitting back',
        'Keep chest up and knees aligned',
        'Return to starting position',
      ],
    },
    {
      name: 'Push-ups',
      sets: 3,
      reps: 10,
      duration: 0,
      rest: 60,
      instructions: [
        'Get into plank position',
        'Lower body until chest touches the ground',
        'Push up to starting position',
        'Keep body straight throughout the movement',
      ],
    },
    {
      name: 'Plank',
      sets: 3,
      reps: 1,
      duration: 30,
      rest: 45,
      instructions: [
        'Get into plank position',
        'Keep body straight from head to toes',
        'Hold position for 30 seconds',
        'Breathe normally during the exercise',
      ],
    },
  ];

  return {
    exercises,
    duration: 45,
    focus: 'full_body',
    difficulty: 'intermediate',
    recommendations: [
      'Warm up for 5-10 minutes before workout',
      'Maintain proper form in all exercises',
      'Rest between sets as needed',
      'Stretch after the workout',
    ],
  };
};

export const generateAndInsertExercise = async () => {
  try {
    const url = process.env['OLLAMA_URL'] || 'http://localhost:11434';
    const healthCheck = await fetch(`${url}/api/tags`).catch(() => null);
    if (!healthCheck?.ok) {
      console.log('⚠️ Ollama not running, skipping exercise generation');
      return { success: false, error: 'Ollama not available' };
    }

    const supabase = getSupabase();

    const exercise = await generateObject({
      model: ollama
        .ChatTextGenerator({
          model: 'llama3:8b',
          maxGenerationTokens: 1024,
          temperature: 0,
        })
        .asObjectGenerationModel(jsonObjectPrompt.instruction()),

      schema: zodSchema(ExerciseSchema),

      prompt: {
        system: 'You are an expert personal trainer. Generate realistic and effective exercises.',
        instruction:
          'Create a random exercise with realistic details. Make it practical and effective for fitness training.',
      },
    });

    // ModelFusion already handles JSON parsing and validation
    const exerciseData = exercise as ExerciseData;

    const { error } = await supabase!.from('exercises').insert({
      id: crypto.randomUUID(),
      name: exerciseData.name,
      description: exerciseData.description,
      muscle_group: exerciseData.muscle_group,
      equipment: exerciseData.equipment,
      difficulty_level: exerciseData.difficulty_level,
      category: 'strength',
      instructions: exerciseData.instructions,
      video_url: null,
      image_url: null,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error inserting AI exercise:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Generated AI exercise: ${exerciseData.name}`);
    return { success: true, exercise: exerciseData.name };
  } catch (error) {
    console.error('Error generating AI exercise:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const generateAndInsertFood = async () => {
  try {
    const url = process.env['OLLAMA_URL'] || 'http://localhost:11434';
    const healthCheck = await fetch(`${url}/api/tags`).catch(() => null);
    if (!healthCheck?.ok) {
      console.log('⚠️ Ollama not running, skipping food generation');
      return { success: false, error: 'Ollama not available' };
    }

    const supabase = getSupabase();

    const prompt = `
Generate a healthy food item in strict JSON format only:
{
  "name": "Food Name",
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number,
  "description": "Short description"
}

Create a random healthy food with realistic nutritional values.
`;

    const response = await fetch(`${url}/api/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'llama3:8b',
        prompt,
      }),
    });

    if (!response.ok) throw new Error(`Ollama error: ${response.statusText}`);
    const result = (await response.json()) as { response?: string };
    const rawText = result.response?.trim() || '{}';

    // Extract JSON from the response (Ollama might add extra text)
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const jsonText = jsonMatch ? jsonMatch[0] : '{}';

    let foodData: FoodData;
    try {
      const parsedData = JSON.parse(jsonText);
      // Validate the data with Zod schema
      foodData = FoodSchema.parse(parsedData);
    } catch (parseError) {
      console.error('Failed to parse or validate Ollama JSON:', jsonText);
      console.error('Original response:', rawText);
      console.error('Validation error:', parseError);
      return { success: false, error: 'Invalid JSON structure returned by Ollama' };
    }

    const { error } = await supabase!.from('foods').insert({
      id: crypto.randomUUID(),
      name: foodData.name,
      calories: foodData.calories,
      protein: foodData.protein,
      carbs: foodData.carbs,
      fats: foodData.fats,
      description: foodData.description,
      created_at: new Date().toISOString(),
    });

    if (error) {
      console.error('Error inserting AI food:', error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Generated AI food: ${foodData.name}`);
    return { success: true, food: foodData.name };
  } catch (error) {
    console.error('Error generating AI food:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
};

export const generateAll = async () => {
  console.log('🔄 Generating both exercise and food...');

  const url = process.env['OLLAMA_URL'] || 'http://localhost:11434';
  const healthCheck = await fetch(`${url}/api/tags`).catch(() => null);
  if (!healthCheck?.ok) {
    console.log('⚠️ Ollama not running, skipping generation');
    return {
      exercise: { success: false, error: 'Ollama not available' },
      food: { success: false, error: 'Ollama not available' },
      timestamp: new Date().toISOString(),
    };
  }

  const exerciseResult = await generateAndInsertExercise();
  const foodResult = await generateAndInsertFood();

  return {
    exercise: exerciseResult,
    food: foodResult,
    timestamp: new Date().toISOString(),
  };
};

export {
  calculateEstimatedCalories,
  generateBasicMealPlan,
  generateBasicWorkoutPlan,
  generateMealPlan,
  generateWorkoutPlan,
  getBasicRecommendations,
  getFitnessRecommendations,
};
