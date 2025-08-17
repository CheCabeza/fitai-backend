# FitAI Backend

A Node.js/Express backend for the FitAI fitness application, built with TypeScript and Supabase.

## 🚀 Features

- **Authentication**: JWT-based user authentication
- **AI Integration**: OpenAI-powered meal and workout plan generation
- **Database**: Supabase (PostgreSQL) with real-time capabilities
- **API**: RESTful API with comprehensive endpoints
- **Testing**: Jest-based test suite
- **CI/CD**: GitHub Actions for automated testing and deployment

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account and project
- OpenAI API key (optional, for AI features)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd fitai-backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.development.example .env.development
   cp env.test.example .env.test
   ```

4. **Configure your environment files:**
   - `.env.development` - Development environment
   - `.env.test` - Test environment

## 🔧 Configuration

### Environment Variables

Create your environment files with the following variables:

```env
# Server
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-jwt-secret

# Supabase
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# OpenAI (optional)
OPENAI_API_KEY=your-openai-api-key
```

### Supabase Setup

1. Create a new Supabase project
2. Get your project URL and API keys
3. Set up the database tables (see `SUPABASE_SETUP.md`)

## 🚀 Development

### Start development server:
```bash
npm run dev
```

### Run tests:
```bash
npm test
```

### Build for production:
```bash
npm run build
```

### Start production server:
```bash
npm start
```

## 📚 API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### AI Endpoints

- `GET /api/ai/recommendations` - Get fitness recommendations
- `POST /api/ai/meal-plan` - Generate meal plan
- `POST /api/ai/workout-plan` - Generate workout plan
- `GET /api/ai/exercises` - Search exercises
- `GET /api/ai/foods` - Search foods

### User Data Endpoints

- `GET /api/users/logs` - Get user logs
- `POST /api/users/logs` - Create user log
- `GET /api/users/meal-plans` - Get user meal plans
- `GET /api/users/workout-plans` - Get user workout plans
- `GET /api/users/stats` - Get user statistics

## 🧪 Testing

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

### Run tests with coverage:
```bash
npm run test:coverage
```

## 🏗️ Project Structure

```
src/
├── config/          # Configuration files
├── controllers/     # Route controllers
├── middleware/      # Express middleware
├── routes/          # API routes
├── tests/           # Test files
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── app.ts           # Express app setup
```

## 🚀 Deployment

### Docker

Build and run with Docker:

```bash
# Build image
docker build -t fitai-backend .

# Run container
docker run -p 3001:3001 fitai-backend
```

### Environment Setup

For production deployment:

1. Set `NODE_ENV=production`
2. Configure all required environment variables
3. Use a process manager like PM2 or Docker

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team
