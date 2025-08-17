# FitAI Backend 🏃‍♂️💪

Backend API for fitness and nutrition application with personalized artificial intelligence.

## 🚀 Features

- **Secure JWT Authentication**
- **Supabase database** with PostgreSQL
- **Personalized plan generation** with AI (OpenAI)
- **Logging system** for progress tracking
- **Intelligent recommendations** based on user profile
- **Complete RESTful API**
- **Automatic documentation** with Swagger
- **Robust data validation**
- **Automated tests** with Jest

## 📋 Requirements

- Node.js 18+
- Supabase account (free tier available)
- npm or yarn

## 🛠️ Installation

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd fitai-backend
```

2. **Install dependencies**

```bash
npm install
```

3. **Configure environment variables**

```bash
cp env.development.example .env.development
```

Edit `.env.development` with your configurations:

```env
# Supabase Configuration
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# JWT Secret (generate a secure one for production)
JWT_SECRET="your_super_secure_jwt_secret_here_2024"

# URLs
FRONTEND_URL="http://localhost:3000"

# OpenAI API (optional for AI)
OPENAI_API_KEY="your_openai_api_key"

# Environment
NODE_ENV="development"

# Port
PORT=3001
```

4. **Setup Supabase Database**

Follow the instructions in [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) to:
- Create a Supabase project
- Set up the database schema
- Insert sample data

5. **Start server**

```bash
# Development
npm run dev

# Production
npm start
```

1. **Clone and install**

```bash
git clone <repository-url>
cd fitai-backend
npm install
```

2. **Create Supabase project**

- Go to [supabase.com](https://supabase.com)
- Create a free account
- Create a new project
- Get your database credentials

3. **Configure environment**

```bash
cp .env.example .env
```

Update `.env` with your Supabase credentials:

```env
# Supabase Database
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# JWT Secret
JWT_SECRET="your_super_secure_jwt_secret_here_2024"

# URLs
FRONTEND_URL="http://localhost:3000"

# OpenAI API (optional for AI)
OPENAI_API_KEY="your_openai_api_key"

# Environment
NODE_ENV="development"

# Port
PORT=3001
```

4. **Setup database automatically**

```bash
# Run the setup script
npm run supabase:setup
```

Or manually:

```bash
# Generate Prisma Client
npm run db:generate

# Apply schema to Supabase
npm run db:push

# Seed the database
npm run db:seed
```

5. **Start server**

```bash
npm run dev
```

## 🗄️ Database Options

### **Supabase (Recommended) ⭐**

- **Free tier**: 500MB database, 50MB bandwidth
- **Features**: PostgreSQL, real-time subscriptions, auth, storage
- **Setup**: 5 minutes
- **Perfect for**: Production apps, rapid development

### **Local PostgreSQL**

- **Setup**: Requires local PostgreSQL installation
- **Features**: Full control, offline development
- **Perfect for**: Development, learning

### **Other Cloud Options**

- **Neon**: Serverless PostgreSQL
- **Railway**: Easy deployment with database
- **PlanetScale**: MySQL alternative

## 📚 API Endpoints

### Authentication

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/change-password` - Change password

### Users

- `GET /api/users/logs` - Get user logs
- `POST /api/users/logs` - Create new log
- `GET /api/users/meal-plans` - Get meal plans
- `GET /api/users/workout-plans` - Get workout plans
- `GET /api/users/statistics` - Get user statistics

### AI Features

- `POST /api/ai/generate-meal-plan` - Generate personalized meal plan
- `POST /api/ai/generate-workout-plan` - Generate personalized workout plan
- `GET /api/ai/recommendations` - Get fitness recommendations
- `GET /api/ai/progress-analysis` - Analyze user progress
- `GET /api/ai/exercises` - Search exercises
- `GET /api/ai/foods` - Search foods

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📖 Documentation

API documentation is available at `/api-docs` when the server is running.

## 🚀 Deployment

### Docker

```bash
# Build image
docker build -t fitai-backend .

# Run container
docker run -p 3001:3001 fitai-backend
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:seed` - Seed database with sample data

### Code Structure

```
src/
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── routes/         # API routes
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── app.ts          # Express app configuration
└── server.ts       # Server entry point
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you have any questions or need help, please open an issue in the repository.

## 🔄 Changelog

### v1.0.0

- Initial release
- JWT authentication
- User management
- AI-powered meal and workout plan generation
- Progress tracking
- RESTful API with Swagger documentation
