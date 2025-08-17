import cron from 'node-cron';
import OpenAI from 'openai';
import { getSupabase } from '../config/supabase';

// Initialize OpenAI client
const openai = process.env['OPENAI_API_KEY']
  ? new OpenAI({ apiKey: process.env['OPENAI_API_KEY'] })
  : null;

interface Exercise {
  name: string;
  description: string;
  muscle_group: string;
  equipment: string;
  difficulty_level: string;
  instructions: string[];
}

interface Food {
  name: string;
  description: string;
  calories_per_100g: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  category: string;
}

class CronService {
  private supabase = getSupabase();

  constructor() {
    this.initCronJobs();
  }

  private initCronJobs() {
    // Populate exercises every day at 2 AM (1 AI-generated exercise)
    cron.schedule('0 2 * * *', () => {
      console.log('🔄 Starting daily AI exercise generation...');
      this.generateAndInsertExercise();
    });

    // Populate foods every day at 3 AM (1 AI-generated food)
    cron.schedule('0 3 * * *', () => {
      console.log('🔄 Starting daily AI food generation...');
      this.generateAndInsertFood();
    });

    // Initial population on startup (only if tables are empty)
    this.checkAndPopulateInitialData();
  }

  private async checkAndPopulateInitialData() {
    try {
      console.log('🔍 Checking if initial data population is needed...');

      const { data: exercises } = await this.supabase!.from('exercises').select('id').limit(1);
      const { data: foods } = await this.supabase!.from('foods').select('id').limit(1);

      if (!exercises || exercises.length === 0) {
        console.log('📝 No exercises found, generating initial AI exercise...');
        await this.generateAndInsertExercise();
      }

      if (!foods || foods.length === 0) {
        console.log('📝 No foods found, generating initial AI food...');
        await this.generateAndInsertFood();
      }

      console.log('✅ Initial data check completed');
    } catch (error) {
      console.error('❌ Error checking initial data:', error);
    }
  }

  private async generateAndInsertExercise() {
    try {
      if (!openai) {
        console.log('⚠️ OpenAI not configured, skipping AI exercise generation');
        return;
      }

      const muscleGroups = ['chest', 'back', 'shoulders', 'arms', 'legs', 'core'];
      const equipment = ['bodyweight', 'dumbbells', 'barbell', 'resistance_bands', 'kettlebell'];
      const difficulties = ['beginner', 'intermediate', 'advanced'];

      const randomMuscleGroup = muscleGroups[Math.floor(Math.random() * muscleGroups.length)];
      const randomEquipment = equipment[Math.floor(Math.random() * equipment.length)];
      const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

      const systemPrompt = `Generate exercise info in JSON. Only respond with valid JSON:
{
  "name": "Exercise Name",
  "description": "Brief description",
  "instructions": ["Step 1", "Step 2", "Step 3"]
}`;

      const userPrompt = `Create a ${randomDifficulty} ${randomMuscleGroup} exercise using ${randomEquipment}. Make it practical and effective.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 200,
        temperature: 0.7,
      });

      const exerciseData: Exercise = JSON.parse(response.choices[0]?.message?.content || '{}');

      // Insert into database
      const { error } = await this.supabase!.from('exercises').insert({
        id: crypto.randomUUID(),
        name: exerciseData.name,
        description: exerciseData.description,
        muscle_group: randomMuscleGroup,
        equipment: randomEquipment,
        difficulty_level: randomDifficulty,
        category: 'strength',
        instructions: exerciseData.instructions,
        video_url: null,
        image_url: null,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error inserting AI exercise:', error);
      } else {
        console.log(`✅ Generated AI exercise: ${exerciseData.name}`);
      }
    } catch (error) {
      console.error('Error generating AI exercise:', error);
    }
  }

  private async generateAndInsertFood() {
    try {
      if (!openai) {
        console.log('⚠️ OpenAI not configured, skipping AI food generation');
        return;
      }

      const categories = ['protein', 'grains', 'vegetables', 'fruits', 'dairy', 'nuts_seeds'];
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];

      const systemPrompt = `Generate food info in JSON. Only respond with valid JSON:
{
  "name": "Food Name",
  "description": "Brief description",
  "calories_per_100g": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "fiber_g": number
}`;

      const userPrompt = `Create a ${randomCategory} food with realistic nutritional values per 100g.`;

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        max_tokens: 150,
        temperature: 0.7,
      });

      const foodData: Food = JSON.parse(response.choices[0]?.message?.content || '{}');

      // Insert into database
      const { error } = await this.supabase!.from('foods').insert({
        id: crypto.randomUUID(),
        name: foodData.name,
        description: foodData.description,
        calories_per_100g: foodData.calories_per_100g,
        protein_g: foodData.protein_g,
        carbs_g: foodData.carbs_g,
        fat_g: foodData.fat_g,
        fiber_g: foodData.fiber_g,
        category: randomCategory,
        created_at: new Date().toISOString(),
      });

      if (error) {
        console.error('Error inserting AI food:', error);
      } else {
        console.log(`✅ Generated AI food: ${foodData.name}`);
      }
    } catch (error) {
      console.error('Error generating AI food:', error);
    }
  }

  // Manual trigger methods for testing
  public async triggerExerciseGeneration() {
    console.log('🔄 Manually triggering AI exercise generation...');
    await this.generateAndInsertExercise();
  }

  public async triggerFoodGeneration() {
    console.log('🔄 Manually triggering AI food generation...');
    await this.generateAndInsertFood();
  }

  public async triggerFullGeneration() {
    console.log('🔄 Manually triggering full AI generation...');
    await this.generateAndInsertExercise();
    await this.generateAndInsertFood();
  }
}

export default CronService;
