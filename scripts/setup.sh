#!/bin/bash

echo "🚀 Setting up FitAI Backend"
echo "============================"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📋 Installing dependencies...${NC}"
npm install

echo -e "${BLUE}📋 Creating environment files...${NC}"
if [ ! -f .env.development ]; then
  cp .env.example .env.development
  echo -e "${GREEN}✅ Created .env.development${NC}"
else
  echo -e "${YELLOW}⚠️  .env.development already exists${NC}"
fi

if [ ! -f .env.test ]; then
  cp .env.example .env.test
  echo -e "${GREEN}✅ Created .env.test${NC}"
else
  echo -e "${YELLOW}⚠️  .env.test already exists${NC}"
fi

echo -e "${BLUE}📋 Building project...${NC}"
npm run build

echo -e "${BLUE}📋 Running tests...${NC}"
npm test

echo ""
echo -e "${GREEN}🎉 Setup completed!${NC}"
echo ""
echo -e "${BLUE}📋 Available commands:${NC}"
echo "  npm run dev          # Start development server"
echo "  npm run test         # Run tests"
echo "  npm run fix          # Format and fix linting"
echo "  npm run check        # Check formatting and linting"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo "1. Configure your Supabase credentials in .env.development"
echo "2. Start the server: npm run dev"
echo "3. Test the API: curl http://localhost:3001/api/health"
echo ""
echo -e "${YELLOW}⚠️  Remember:${NC}"
echo "- Never commit .env.* files to Git"
echo "- Use different credentials for each environment"
