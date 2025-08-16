#!/bin/bash

echo "🚀 Setting up environments for FitAI Backend"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to create environment file
create_env_file() {
    local env_name=$1
    local example_file="env.${env_name}.example"
    local env_file=".env.${env_name}"
    
    if [ -f "$env_file" ]; then
        echo -e "${YELLOW}⚠️  File $env_file already exists. Overwrite? (y/N)${NC}"
        read -r response
        if [[ ! "$response" =~ ^[Yy]$ ]]; then
            echo -e "${BLUE}📝 Skipping $env_file${NC}"
            return
        fi
    fi
    
    if [ -f "$example_file" ]; then
        cp "$example_file" "$env_file"
        echo -e "${GREEN}✅ Created $env_file${NC}"
    else
        echo -e "${RED}❌ File $example_file not found${NC}"
    fi
}

# Create environment files
echo -e "${BLUE}📋 Creating configuration files...${NC}"

create_env_file "development"
create_env_file "production"
create_env_file "test"

echo ""
echo -e "${BLUE}📋 Setting up Supabase...${NC}"

# Ask if they want to configure Supabase
echo -e "${YELLOW}Do you want to configure Supabase now? (y/N)${NC}"
read -r setup_supabase

if [[ "$setup_supabase" =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🔧 Running Supabase configuration...${NC}"
    ./scripts/setup-supabase.sh
else
    echo -e "${BLUE}📝 You can configure Supabase later with: npm run supabase:setup${NC}"
fi

echo ""
echo -e "${GREEN}🎉 Environment setup completed!${NC}"
echo ""
echo -e "${BLUE}📋 Files created:${NC}"
echo "  - .env.development (development)"
echo "  - .env.production (production)"
echo "  - .env.test (tests)"
echo ""
echo -e "${BLUE}📋 Available commands:${NC}"
echo "  - npm run dev          # Development"
echo "  - npm run dev:test     # Development with test environment"
echo "  - npm run dev:prod     # Development with production environment"
echo "  - npm run start        # Production"
echo "  - npm run start:dev    # Production with development environment"
echo "  - npm run start:test   # Production with test environment"
echo "  - npm test             # Tests"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Edit the .env.* files with your credentials"
echo "2. Configure Supabase: npm run supabase:setup"
echo "3. Start the server: npm run dev"
echo ""
echo -e "${YELLOW}⚠️  Remember:${NC}"
echo "- Never commit .env.* files to Git"
echo "- Use different credentials for each environment"
echo "- Generate secure JWT secrets for production"
