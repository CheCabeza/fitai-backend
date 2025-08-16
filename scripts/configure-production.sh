#!/bin/bash

echo "🚀 Configurando Supabase para Producción"
echo "========================================"

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}📋 Paso 1: Obtener credenciales de Supabase${NC}"
echo ""
echo "1. Ve a: https://supabase.com/dashboard"
echo "2. Selecciona tu proyecto 'fitai-prod'"
echo "3. Ve a Settings > API"
echo "4. Copia las siguientes credenciales:"
echo ""

echo -e "${YELLOW}Project URL:${NC}"
read -p "Pega tu Project URL: " SUPABASE_URL

echo -e "${YELLOW}Anon Key:${NC}"
read -p "Pega tu anon public key: " SUPABASE_ANON_KEY

echo -e "${YELLOW}Service Role Key:${NC}"
read -p "Pega tu service role key: " SUPABASE_SERVICE_ROLE_KEY

echo ""
echo -e "${BLUE}📋 Paso 2: Obtener DATABASE_URL${NC}"
echo ""
echo "1. Ve a Settings > Database"
echo "2. Busca 'Connection string'"
echo "3. Selecciona 'URI'"
echo "4. Copia la URL completa"
echo ""

echo -e "${YELLOW}Database URL:${NC}"
read -p "Pega tu DATABASE_URL: " DATABASE_URL

echo ""
echo -e "${BLUE}📋 Paso 3: Configurar OpenAI (opcional)${NC}"
echo ""

echo -e "${YELLOW}OpenAI API Key (opcional):${NC}"
read -p "Pega tu OpenAI API key (o presiona Enter para saltar): " OPENAI_API_KEY

echo ""
echo -e "${BLUE}📋 Paso 4: Configurar dominio de frontend${NC}"
echo ""

echo -e "${YELLOW}Frontend URL:${NC}"
read -p "Pega tu URL de frontend (ej: https://tuapp.com): " FRONTEND_URL

# Generar JWT secret
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")

echo ""
echo -e "${BLUE}📋 Paso 5: Crear archivo .env.production${NC}"

# Crear archivo .env.production
cat > .env.production << EOF
### Production Environment Configuration
NODE_ENV="production"

### Database - Production (Supabase)
DATABASE_URL="${DATABASE_URL}"

### JWT Secret (Production)
JWT_SECRET="${JWT_SECRET}"

### URLs
FRONTEND_URL="${FRONTEND_URL}"

### OpenAI API (Production)
OPENAI_API_KEY="${OPENAI_API_KEY}"

### Port
PORT=3001

### Supabase Configuration (Production)
SUPABASE_URL="${SUPABASE_URL}"
SUPABASE_ANON_KEY="${SUPABASE_ANON_KEY}"
SUPABASE_SERVICE_ROLE_KEY="${SUPABASE_SERVICE_ROLE_KEY}"

### Logging
LOG_LEVEL="error"

### Security
CORS_ORIGIN="${FRONTEND_URL}"
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"
EOF

echo -e "${GREEN}✅ Archivo .env.production creado exitosamente${NC}"

echo ""
echo -e "${BLUE}📋 Paso 6: Configurar base de datos${NC}"
echo ""

echo -e "${YELLOW}¿Quieres configurar la base de datos ahora? (y/N)${NC}"
read -r setup_db

if [[ "$setup_db" =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}🔧 Configurando base de datos de producción...${NC}"
    
    # Generar cliente Prisma
    echo "Generando cliente Prisma..."
    NODE_ENV=production npx prisma generate
    
    # Aplicar esquema
    echo "Aplicando esquema a la base de datos..."
    NODE_ENV=production npx prisma db push
    
    # Ejecutar seed
    echo "Ejecutando seed de datos..."
    NODE_ENV=production npm run db:seed
    
    echo -e "${GREEN}✅ Base de datos configurada exitosamente${NC}"
else
    echo -e "${BLUE}📝 Puedes configurar la base de datos más tarde con:${NC}"
    echo "NODE_ENV=production npm run db:generate"
    echo "NODE_ENV=production npm run db:push"
    echo "NODE_ENV=production npm run db:seed"
fi

echo ""
echo -e "${GREEN}🎉 ¡Configuración de producción completada!${NC}"
echo ""
echo -e "${BLUE}📋 Comandos para probar:${NC}"
echo "NODE_ENV=production npm run dev:prod"
echo "curl http://localhost:3001/api/health"
echo ""
echo -e "${BLUE}📋 Recursos útiles:${NC}"
echo "- Supabase Dashboard: ${SUPABASE_URL}"
echo "- Prisma Studio: NODE_ENV=production npx prisma studio"
