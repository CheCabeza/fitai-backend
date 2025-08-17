# Supabase Setup Guide

This guide will help you set up Supabase for the FitAI backend.

## 🚀 Quick Start

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `fitai-backend`
   - **Database Password**: Choose a strong password
   - **Region**: Choose closest to your users
6. Click "Create new project"

### 2. Get Your Credentials

Once your project is created:

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **Anon public key**
   - **Service role key** (keep this secret!)

### 3. Configure Environment

Add these to your `.env.development`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## 🗄️ Database Schema

### Create Tables

Run these SQL commands in your Supabase SQL Editor:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  date_of_birth DATE,
  height_cm INTEGER,
  weight_kg DECIMAL(5,2),
  goal VARCHAR(50),
  activity_level VARCHAR(50),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises table
CREATE TABLE exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  muscle_group VARCHAR(100),
  equipment VARCHAR(100),
  difficulty_level VARCHAR(50),
  category VARCHAR(50),
  instructions TEXT[],
  video_url VARCHAR(500),
  image_url VARCHAR(500),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Foods table
CREATE TABLE foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  calories_per_100g INTEGER,
  protein_g DECIMAL(5,2),
  carbs_g DECIMAL(5,2),
  fat_g DECIMAL(5,2),
  fiber_g DECIMAL(5,2),
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User logs table
CREATE TABLE user_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  log_type VARCHAR(50) NOT NULL,
  log_date DATE NOT NULL,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meal plans table
CREATE TABLE meal_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meals JSONB NOT NULL,
  total_calories INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout plans table
CREATE TABLE workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  exercises JSONB NOT NULL,
  duration_minutes INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workout exercises junction table
CREATE TABLE workout_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_plan_id UUID REFERENCES workout_plans(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES exercises(id) ON DELETE CASCADE,
  sets INTEGER,
  reps INTEGER,
  weight_kg DECIMAL(5,2),
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Meal foods junction table
CREATE TABLE meal_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  food_id UUID REFERENCES foods(id) ON DELETE CASCADE,
  quantity_g DECIMAL(8,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Create Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_logs_user_date ON user_logs(user_id, log_date);
CREATE INDEX idx_meal_plans_user_date ON meal_plans(user_id, date);
CREATE INDEX idx_workout_plans_user_date ON workout_plans(user_id, date);
CREATE INDEX idx_exercises_muscle_group ON exercises(muscle_group);
CREATE INDEX idx_foods_category ON foods(category);
```

## 🔐 Row Level Security (RLS)

Enable RLS and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_foods ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- User logs policies
CREATE POLICY "Users can view own logs" ON user_logs
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own logs" ON user_logs
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Meal plans policies
CREATE POLICY "Users can view own meal plans" ON meal_plans
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own meal plans" ON meal_plans
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Workout plans policies
CREATE POLICY "Users can view own workout plans" ON workout_plans
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert own workout plans" ON workout_plans
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

-- Public read access for exercises and foods
CREATE POLICY "Anyone can view exercises" ON exercises
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view foods" ON foods
  FOR SELECT USING (true);
```

## 📊 Sample Data

### Insert Sample Exercises

```sql
INSERT INTO exercises (name, description, muscle_group, equipment, difficulty_level, category, instructions) VALUES
('Push-ups', 'Classic bodyweight exercise for chest and triceps', 'chest', 'bodyweight', 'beginner', 'strength', ARRAY['Start in plank position', 'Lower body until chest nearly touches floor', 'Push back up to starting position']),
('Squats', 'Fundamental lower body exercise', 'legs', 'bodyweight', 'beginner', 'strength', ARRAY['Stand with feet shoulder-width apart', 'Lower body as if sitting back', 'Keep chest up and knees behind toes']),
('Pull-ups', 'Upper body pulling exercise', 'back', 'bodyweight', 'intermediate', 'strength', ARRAY['Hang from pull-up bar', 'Pull body up until chin clears bar', 'Lower with control']);
```

### Insert Sample Foods

```sql
INSERT INTO foods (name, description, calories_per_100g, protein_g, carbs_g, fat_g, fiber_g, category) VALUES
('Chicken Breast', 'Lean protein source', 165, 31, 0, 3.6, 0, 'protein'),
('Brown Rice', 'Whole grain carbohydrate', 110, 2.5, 23, 0.9, 1.8, 'grains'),
('Broccoli', 'Nutrient-rich vegetable', 34, 2.8, 7, 0.4, 2.6, 'vegetables'),
('Banana', 'Natural energy source', 89, 1.1, 23, 0.3, 2.6, 'fruits'),
('Greek Yogurt', 'High-protein dairy', 59, 10, 3.6, 0.4, 0, 'dairy');
```

## 🔧 Testing Your Setup

1. **Test connection:**

   ```bash
   npm run dev
   curl http://localhost:3001/api/health
   ```

2. **Test authentication:**

   ```bash
   curl -X POST http://localhost:3001/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'
   ```

3. **Test AI endpoints:**
   ```bash
   curl http://localhost:3001/api/ai/exercises
   curl http://localhost:3001/api/ai/foods
   ```

## 🚀 Production Setup

### Environment Variables

For production, ensure these are set:

```env
NODE_ENV=production
SUPABASE_URL=your-production-url
SUPABASE_ANON_KEY=your-production-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-production-service-role-key
JWT_SECRET=your-secure-jwt-secret
```

### Database Backups

1. Go to **Settings** → **Database**
2. Set up automated backups
3. Configure backup retention policy

### Monitoring

1. Go to **Settings** → **Usage**
2. Monitor database usage
3. Set up alerts for quota limits

## 🆘 Troubleshooting

### Common Issues

1. **Connection errors:**
   - Verify your Supabase URL and keys
   - Check if your project is active
   - Ensure RLS policies are correct

2. **Authentication issues:**
   - Verify JWT_SECRET is set
   - Check user table structure
   - Ensure password hashing is working

3. **Performance issues:**
   - Add database indexes
   - Monitor query performance
   - Consider connection pooling

### Getting Help

- Check Supabase documentation
- Review error logs
- Open an issue on GitHub
