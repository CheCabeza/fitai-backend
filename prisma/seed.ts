import { PrismaClient } from '@prisma/client';

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
  console.log('🌱 Iniciando seed de la base de datos...');

  // Clear existing data
  await prisma.exercise.deleteMany();
  await prisma.foodItem.deleteMany();

  // Sample exercises
  const exercises: ExerciseData[] = [
    // Strength exercises - Chest
    {
      name: 'Push-ups',
      category: 'strength',
      muscleGroup: 'chest',
      equipment: 'bodyweight',
      instructions: [
        'Colócate en posición de plancha con las manos separadas al ancho de los hombros',
        'Baja el cuerpo hasta que el pecho casi toque el suelo',
        'Empuja hacia arriba hasta la posición inicial',
        'Mantén el cuerpo en línea recta durante todo el movimiento',
      ],
      difficulty: 'beginner',
      caloriesPerMin: 8,
      description: 'Flexiones de pecho para desarrollar fuerza en el tren superior',
    },
    {
      name: 'Bench Press',
      category: 'strength',
      muscleGroup: 'chest',
      equipment: 'barbell',
      instructions: [
        'Acuéstate en el banco con los pies firmes en el suelo',
        'Agarra la barra con las manos separadas al ancho de los hombros',
        'Baja la barra controladamente hacia el pecho',
        'Empuja la barra hacia arriba hasta extender los brazos',
      ],
      difficulty: 'intermediate',
      caloriesPerMin: 6,
      description: 'Press de banca con barra para desarrollar el pecho',
    },
    {
      name: 'Pull-ups',
      category: 'strength',
      muscleGroup: 'back',
      equipment: 'bodyweight',
      instructions: [
        'Cuelga de la barra con las manos separadas al ancho de los hombros',
        'Tira del cuerpo hacia arriba hasta que la barbilla pase la barra',
        'Baja controladamente a la posición inicial',
        'Mantén el cuerpo recto durante todo el movimiento',
      ],
      difficulty: 'intermediate',
      caloriesPerMin: 9,
      description: 'Dominadas para desarrollar la espalda',
    },
    {
      name: 'Squats',
      category: 'strength',
      muscleGroup: 'legs',
      equipment: 'bodyweight',
      instructions: [
        'Ponte de pie con los pies separados al ancho de los hombros',
        'Baja el cuerpo como si te sentaras en una silla',
        'Mantén las rodillas alineadas con los dedos de los pies',
        'Regresa a la posición inicial',
      ],
      difficulty: 'beginner',
      caloriesPerMin: 8,
      description: 'Sentadillas para desarrollar las piernas',
    },
    {
      name: 'Running',
      category: 'cardio',
      muscleGroup: 'full_body',
      equipment: 'bodyweight',
      instructions: [
        'Mantén una postura erguida con los hombros relajados',
        'Aterriza suavemente con el medio del pie',
        'Mantén un ritmo constante y respiración controlada',
        'Aumenta gradualmente la velocidad',
      ],
      difficulty: 'beginner',
      caloriesPerMin: 12,
      description: 'Correr para mejorar la resistencia cardiovascular',
    },
    {
      name: 'Plank',
      category: 'strength',
      muscleGroup: 'core',
      equipment: 'bodyweight',
      instructions: [
        'Colócate en posición de plancha con los antebrazos en el suelo',
        'Mantén el cuerpo en línea recta desde la cabeza hasta los pies',
        'Aprieta los músculos del core',
        'Mantén la posición durante el tiempo especificado',
      ],
      difficulty: 'beginner',
      caloriesPerMin: 4,
      description: 'Plancha para fortalecer el core',
    },
  ];

  // Sample foods
  const foods: FoodData[] = [
    // Proteins
    {
      name: 'Pechuga de pollo',
      category: 'protein',
      calories: 165,
      protein: 31,
      carbs: 0,
      fat: 3.6,
    },
    {
      name: 'Salmón',
      category: 'protein',
      calories: 208,
      protein: 25,
      carbs: 0,
      fat: 12,
    },
    {
      name: 'Huevos',
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
      name: 'Arroz integral',
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
      name: 'Avena',
      category: 'carbs',
      calories: 150,
      protein: 6,
      carbs: 27,
      fat: 3,
    },

    // Fruits
    {
      name: 'Plátano',
      category: 'fruits',
      calories: 105,
      protein: 1.3,
      carbs: 27,
      fat: 0.4,
    },
    {
      name: 'Manzana',
      category: 'fruits',
      calories: 52,
      protein: 0.3,
      carbs: 14,
      fat: 0.2,
    },

    // Vegetables
    {
      name: 'Brócoli',
      category: 'vegetables',
      calories: 55,
      protein: 3.7,
      carbs: 11,
      fat: 0.6,
    },
    {
      name: 'Espinacas',
      category: 'vegetables',
      calories: 23,
      protein: 2.9,
      carbs: 3.6,
      fat: 0.4,
    },

    // Healthy fats
    {
      name: 'Almendras',
      category: 'fats',
      calories: 164,
      protein: 6,
      carbs: 6,
      fat: 14,
    },
    {
      name: 'Aguacate',
      category: 'fats',
      calories: 160,
      protein: 2,
      carbs: 9,
      fat: 15,
    },

    // Dairy
    {
      name: 'Yogur griego',
      category: 'dairy',
      calories: 130,
      protein: 23,
      carbs: 9,
      fat: 0.5,
    },
  ];

  // Insert exercises
  console.log('💪 Insertando ejercicios...');
  for (const exercise of exercises) {
    await prisma.exercise.create({
      data: exercise,
    });
  }

  // Insert foods
  console.log('🍎 Insertando alimentos...');
  for (const food of foods) {
    await prisma.foodItem.create({
      data: food,
    });
  }

  console.log('✅ Seed completado exitosamente!');
  console.log(`📊 ${exercises.length} ejercicios insertados`);
  console.log(`🍽️ ${foods.length} alimentos insertados`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
