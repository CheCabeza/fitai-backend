import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import path from 'path';

// Cargar variables de entorno según el NODE_ENV
const env = process.env.NODE_ENV || 'development';
const envFile = `.env.${env}`;
config({ path: path.resolve(process.cwd(), envFile) });

// Si no existe el archivo específico, cargar .env por defecto
if (!process.env.DATABASE_URL) {
  config({ path: path.resolve(process.cwd(), '.env') });
}

const prisma = new PrismaClient();

interface ExerciseData {
  name: string;
  category: string;
  muscleGroup: string;
  equipment: string;
  instructions: string[];
  difficulty: string;
  caloriesPerMin: number;
  description: string;
}

interface FoodData {
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

async function main(): Promise<void> {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.exercises.deleteMany();
  await prisma.food_items.deleteMany();

  // Sample exercises
  const exercises: ExerciseData[] = [
    // Strength exercises - Chest
    {
      name: 'Push-ups',
      category: 'strength',
      muscleGroup: 'chest',
      equipment: 'bodyweight',
      instructions: [
        'Get into a plank position with hands shoulder-width apart',
        'Lower your body until your chest almost touches the ground',
        'Push up to the starting position',
        'Keep your body in a straight line throughout the movement',
      ],
      difficulty: 'beginner',
      caloriesPerMin: 8,
      description: 'Chest push-ups to develop upper body strength',
    },
    {
      name: 'Bench Press',
      category: 'strength',
      muscleGroup: 'chest',
      equipment: 'barbell',
      instructions: [
        'Lie on the bench with feet firmly on the ground',
        'Grab the bar with hands shoulder-width apart',
        'Lower the bar controlled towards your chest',
        'Push the bar up until arms are extended',
      ],
      difficulty: 'intermediate',
      caloriesPerMin: 6,
      description: 'Barbell bench press to develop chest',
    },
    {
      name: 'Pull-ups',
      category: 'strength',
      muscleGroup: 'back',
      equipment: 'bodyweight',
      instructions: [
        'Hang from the bar with hands shoulder-width apart',
        'Pull your body up until your chin passes the bar',
        'Lower controlled to the starting position',
        'Keep your body straight throughout the movement',
      ],
      difficulty: 'intermediate',
      caloriesPerMin: 9,
      description: 'Pull-ups to develop back',
    },
    {
      name: 'Squats',
      category: 'strength',
      muscleGroup: 'legs',
      equipment: 'bodyweight',
      instructions: [
        'Stand with feet shoulder-width apart',
        'Lower your body as if sitting in a chair',
        'Keep knees aligned with toes',
        'Return to starting position',
      ],
      difficulty: 'beginner',
      caloriesPerMin: 8,
      description: 'Squats to develop legs',
    },
    {
      name: 'Running',
      category: 'cardio',
      muscleGroup: 'full_body',
      equipment: 'bodyweight',
      instructions: [
        'Maintain an upright posture with relaxed shoulders',
        'Land softly with the middle of your foot',
        'Keep a steady pace and controlled breathing',
        'Gradually increase speed',
      ],
      difficulty: 'beginner',
      caloriesPerMin: 12,
      description: 'Running to improve cardiovascular endurance',
    },
    {
      name: 'Plank',
      category: 'strength',
      muscleGroup: 'core',
      equipment: 'bodyweight',
      instructions: [
        'Get into a plank position with forearms on the ground',
        'Keep your body in a straight line from head to feet',
        'Engage your core muscles',
        'Hold the position for the specified time',
      ],
      difficulty: 'beginner',
      caloriesPerMin: 4,
      description: 'Plank to strengthen core',
    },
  ];

  // Sample foods
  const foods: FoodData[] = [
    // Proteins
    {
      name: 'Chicken breast',
      category: 'protein',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
    },
    {
      name: 'Salmon',
      category: 'protein',
      calories: 208,
      protein: 25,
      carbs: 0,
      fat: 12,
    },
    {
      name: 'Eggs',
      category: 'protein',
      calories: 155,
      protein: 13,
      carbs: 1.1,
      fat: 11,
    },
    {
      name: 'Tofu',
      category: 'protein',
      calories: 76,
      protein: 8,
      carbs: 1.9,
      fat: 4.8,
    },

    // Carbohydrates
    {
      name: 'Brown rice',
      category: 'carbs',
      calories: 110,
      protein: 2.5,
      carbs: 23,
      fat: 0.9,
    },
    {
      name: 'Quinoa',
      category: 'carbs',
      calories: 120,
      protein: 4.4,
      carbs: 22,
      fat: 1.9,
    },
    {
      name: 'Oatmeal',
      category: 'carbs',
      calories: 150,
      protein: 6,
      carbs: 27,
      fat: 3,
    },

    // Fruits
    {
      name: 'Banana',
      category: 'fruits',
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
    },
    {
      name: 'Apple',
      category: 'fruits',
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
    },

    // Vegetables
    {
      name: 'Broccoli',
      category: 'vegetables',
      calories: 55,
      protein: 3.7,
      carbs: 11,
      fat: 0.6,
    },
    {
      name: 'Spinach',
      category: 'vegetables',
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
    },

    // Healthy fats
    {
      name: 'Almonds',
      category: 'fats',
      calories: 164,
      protein: 6,
      carbs: 6,
      fat: 14,
    },
    {
      name: 'Avocado',
      category: 'fats',
      calories: 160,
      protein: 2,
      carbs: 9,
      fat: 15,
    },

    // Dairy
    {
      name: 'Greek yogurt',
      category: 'dairy',
      calories: 130,
      protein: 23,
      carbs: 9,
      fat: 0.5,
    },
  ];

  // Insert exercises
  console.log('💪 Inserting exercises...');
  for (const exercise of exercises) {
    await prisma.exercises.create({
      data: {
        id: crypto.randomUUID(),
        ...exercise,
      },
    });
  }

  // Insert foods
  console.log('🍎 Inserting foods...');
  for (const food of foods) {
    await prisma.food_items.create({
      data: {
        id: crypto.randomUUID(),
        ...food,
      },
    });
  }

  console.log('✅ Seed completed successfully!');
  console.log(`📊 ${exercises.length} exercises inserted`);
  console.log(`🍽️ ${foods.length} foods inserted`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
