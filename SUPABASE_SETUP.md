# 🚀 Supabase Setup for FitAI Backend

## 📋 **Step 1: Create Supabase Project**

1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Click "New Project"
4. Complete the information:
   - **Name**: `fitai-backend`
   - **Database Password**: Generate a secure password
   - **Region**: Choose the closest to you
5. Click "Create new project"

## 🔑 **Step 2: Get Credentials**

Once the project is created, go to **Settings > Database** and copy:

### **Database URL**

```
postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres
```

### **API Keys**

Go to **Settings > API** and copy:

- **Project URL**: `https://[YOUR-PROJECT-REF].supabase.co`
- **anon public**: `[YOUR-ANON-KEY]`
- **service_role secret**: `[YOUR-SERVICE-ROLE-KEY]`

## ⚙️ **Step 3: Configure Environment Variables**

Update your `.env` file:

```env
### Supabase Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

### JWT Secret (generate a secure one for production)
JWT_SECRET="your_super_secure_jwt_secret_here_2024"

### URLs
FRONTEND_URL="http://localhost:3000"

### OpenAI API (optional for AI)
OPENAI_API_KEY=""

### Environment
NODE_ENV="development"

### Port
PORT=3001

### Supabase Configuration (optional)
SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```

## 🗄️ **Step 4: Configure Database**

### **Option A: Use Prisma (Recommended)**

1. **Generate Prisma client:**

```bash
npx prisma generate
```

2. **Apply schema to Supabase:**

```bash
npx prisma db push
```

3. **Run seed (optional):**

```bash
npm run db:seed
```

### **Option B: Use SQL directly**

Go to **SQL Editor** in Supabase and run:

```sql
-- Create tables
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  age INTEGER,
  weight REAL,
  height REAL,
  goal TEXT,
  activity_level TEXT,
  restrictions TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE exercises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  muscle_group TEXT NOT NULL,
  equipment TEXT NOT NULL,
  difficulty TEXT NOT NULL,
  calories_per_min INTEGER NOT NULL,
  description TEXT,
  instructions TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE food_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein REAL NOT NULL,
  carbs REAL NOT NULL,
  fat REAL NOT NULL,
  fiber REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE meal_plans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  meals JSONB NOT NULL,
  total_calories INTEGER NOT NULL,
  recommendations TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE workout_plans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  exercises JSONB NOT NULL,
  duration INTEGER NOT NULL,
  focus TEXT,
  difficulty TEXT,
  recommendations TEXT[],
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE user_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  type TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 🧪 **Step 5: Test Connection**

1. **Restart the server:**

```bash
npm run dev
```

2. **Test the health endpoint:**

```bash
curl http://localhost:3001/api/health
```

3. **Test database connection:**

```bash
npm run db:studio
```

## 🔒 **Step 6: Configure Row Level Security (RLS)**

In Supabase SQL Editor, run:

```sql
-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_logs ENABLE ROW LEVEL SECURITY;

-- Policy for users (users can only see their own data)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid()::text = id);

-- Policy for meal plans (users can only see their own plans)
CREATE POLICY "Users can view own meal plans" ON meal_plans
  FOR ALL USING (auth.uid()::text = user_id);

-- Policy for workout plans (users can only see their own plans)
CREATE POLICY "Users can view own workout plans" ON workout_plans
  FOR ALL USING (auth.uid()::text = user_id);

-- Policy for user logs (users can only see their own logs)
CREATE POLICY "Users can view own logs" ON user_logs
  FOR ALL USING (auth.uid()::text = user_id);

-- Policy for exercises (public read)
CREATE POLICY "Public read access for exercises" ON exercises
  FOR SELECT USING (true);

-- Policy for foods (public read)
CREATE POLICY "Public read access for foods" ON food_items
  FOR SELECT USING (true);
```

## 📊 **Step 7: Monitoring and Analytics**

Supabase provides:

- **Real-time subscriptions**
- **Database logs**
- **API usage metrics**
- **Storage**: Store files (optional)
- **Edge Functions**: Serverless functions

## 🚀 **Benefits of using Supabase:**

- **Free tier**: 500MB database, 2GB bandwidth
- **Complete PostgreSQL database**
- **Built-in authentication**
- **Real-time subscriptions**
- **API generation**
- **Storage for files**
- **Edge functions**

## 🔧 **Useful Commands:**

```bash
# Check database connection
npx prisma db pull

# Generate Prisma client
npx prisma generate

# View data in database
npx prisma studio

# Reset database (careful!)
npx prisma migrate reset
```

## 🚨 **Troubleshooting:**

### **Connection Error:**

- Verify DATABASE_URL format
- Check if project is active in Supabase
- Ensure IP is not blocked

### **Authentication Error:**

- Verify JWT_SECRET is set
- Check if user exists in database

### **Permission Error:**

- Verify RLS policies are correct
- Check if user has proper permissions

Would you like help with any specific step in the setup?
