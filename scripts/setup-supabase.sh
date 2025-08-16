#!/bin/bash

echo "🚀 Setting up Supabase for FitAI Backend"
echo "=============================================="

# Check if Prisma is installed
if ! command -v npx &> /dev/null; then
    echo "❌ Error: npx is not installed"
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found"
    echo "Copy .env.example to .env and configure the variables"
    exit 1
fi

echo "📋 Step 1: Generating Prisma client..."
npx prisma generate

if [ $? -eq 0 ]; then
    echo "✅ Prisma client generated successfully"
else
    echo "❌ Error generating Prisma client"
    exit 1
fi

echo ""
echo "📋 Step 2: Applying schema to database..."
npx prisma db push

if [ $? -eq 0 ]; then
    echo "✅ Schema applied successfully"
else
    echo "❌ Error applying schema"
    echo "Verify that DATABASE_URL in .env is correct"
    exit 1
fi

echo ""
echo "📋 Step 3: Running data seed..."
npm run db:seed

if [ $? -eq 0 ]; then
    echo "✅ Seed executed successfully"
else
    echo "⚠️  Warning: Error running seed"
    echo "You can run it manually with: npm run db:seed"
fi

echo ""
echo "📋 Step 4: Verifying connection..."
npx prisma db pull --force

if [ $? -eq 0 ]; then
    echo "✅ Database connection verified"
else
    echo "❌ Error verifying connection"
    exit 1
fi

echo ""
echo "🎉 Setup completed!"
echo ""
echo "📋 Next steps:"
echo "1. Restart the server: npm run dev"
echo "2. Test the endpoints: curl http://localhost:3001/api/health"
echo "3. Verify in Supabase Dashboard that tables were created"
echo ""
echo "🔗 Useful resources:"
echo "- Supabase Dashboard: https://supabase.com/dashboard"
echo "- Documentation: https://supabase.com/docs"
echo "- Prisma Studio: npx prisma studio"
