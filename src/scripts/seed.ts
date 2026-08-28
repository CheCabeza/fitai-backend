import path from 'path';
import { config } from 'dotenv';
import { seedFoods } from './seedFoods';
import { seedExercises } from './seedExercises';

async function main() {
  const env = process.env['NODE_ENV'] || 'development';
  config({ path: path.resolve(process.cwd(), `.env.${env}`), override: true });
  config({ path: path.resolve(process.cwd(), '.env'), override: true });

  const args = process.argv.slice(2);
  const onlyFoods = args.includes('--foods');
  const onlyExercises = args.includes('--exercises');
  const runFoods = onlyExercises ? false : !onlyFoods || onlyFoods;
  const runExercises = onlyFoods ? false : !onlyExercises || onlyExercises;

  console.log('🌱 Starting seed...\n');

  if (runFoods) {
    const apiKey = process.env['USDA_API_KEY'];
    if (!apiKey) {
      console.error('❌ USDA_API_KEY environment variable is required to seed foods.');
      console.error('   Get a free key at https://api.data.gov/signup');
      process.exit(1);
    }
    console.log('🍗 Seeding foods from USDA FoodData Central...');
    const foodResult = await seedFoods(apiKey);
    console.log(`   ✅ Foods inserted: ${foodResult.inserted}`);
    if (foodResult.failed.length > 0) {
      console.log(`   ⚠️  Foods with no match (${foodResult.failed.length}):`);
      for (const f of foodResult.failed) console.log(`      - ${f}`);
    }
    console.log('');
  }

  if (runExercises) {
    console.log('🏋️  Seeding exercises from wger...');
    const exerciseResult = await seedExercises();
    console.log(`   ✅ Exercises inserted: ${exerciseResult.inserted}`);
    console.log(`   ⚠️  Exercises skipped: ${exerciseResult.skipped}`);
    console.log('');
  }

  console.log('✅ Seed complete.');
}

main().catch(error => {
  console.error('❌ Seed failed:', error);
  process.exit(1);
});
