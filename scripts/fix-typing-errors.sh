#!/bin/bash

echo "🔧 Fixing typing errors in the project..."
echo "================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Fixing Prisma table names...${NC}"

# Function to replace in files
replace_in_file() {
    local file=$1
    local search=$2
    local replace=$3
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS
        sed -i '' "s/$search/$replace/g" "$file"
    else
        # Linux
        sed -i "s/$search/$replace/g" "$file"
    fi
}

# Fix src/controllers/auth.ts
echo "Fixing src/controllers/auth.ts..."
replace_in_file "src/controllers/auth.ts" "prisma\.user\." "prisma.users."
replace_in_file "src/controllers/auth.ts" "await prisma\.user\.create" "await prisma.users.create"
replace_in_file "src/controllers/auth.ts" "await prisma\.user\.update" "await prisma.users.update"
replace_in_file "src/controllers/auth.ts" "await prisma\.user\.delete" "await prisma.users.delete"

# Fix src/middleware/auth.ts
echo "Fixing src/middleware/auth.ts..."
replace_in_file "src/middleware/auth.ts" "prisma\.user\." "prisma.users."

# Fix src/routes/ai.ts
echo "Fixing src/routes/ai.ts..."
replace_in_file "src/routes/ai.ts" "prisma\.user\." "prisma.users."
replace_in_file "src/routes/ai.ts" "prisma\.mealPlan\." "prisma.meal_plans."
replace_in_file "src/routes/ai.ts" "prisma\.workoutPlan\." "prisma.workout_plans."
replace_in_file "src/routes/ai.ts" "prisma\.userLog\." "prisma.user_logs."
replace_in_file "src/routes/ai.ts" "prisma\.exercise\." "prisma.exercises."
replace_in_file "src/routes/ai.ts" "prisma\.foodItem\." "prisma.food_items."

# Fix src/routes/auth.ts
echo "Fixing src/routes/auth.ts..."
replace_in_file "src/routes/auth.ts" "prisma\.user\." "prisma.users."

# Fix src/routes/users.ts
echo "Fixing src/routes/users.ts..."
replace_in_file "src/routes/users.ts" "prisma\.userLog\." "prisma.user_logs."
replace_in_file "src/routes/users.ts" "prisma\.mealPlan\." "prisma.meal_plans."
replace_in_file "src/routes/users.ts" "prisma\.workoutPlan\." "prisma.workout_plans."

echo -e "${GREEN}✅ Typing errors fixed${NC}"

echo ""
echo -e "${BLUE}📋 Checking remaining errors...${NC}"
npx tsc --noEmit

echo ""
echo -e "${YELLOW}⚠️  Note: You may need to add IDs manually in some places${NC}"
echo "   - For creating records, add: id: crypto.randomUUID()"
echo "   - For optional fields, use: field || null"
