import app from './src/app';
import { getConfig, isDevelopment, isProduction, isTest } from './src/config/env';


// Load and validate configuration
const config = getConfig();

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`🚀 FitAI Server running on port ${PORT}`);
  console.log(`📊 Environment: ${config.NODE_ENV}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
  
  // Additional information based on environment
  if (isDevelopment()) {
    console.log(`🔧 Development mode activated`);
    console.log(`📚 Documentation: http://localhost:${PORT}/api-docs`);
    console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  }
  
  if (isProduction()) {
    console.log(`🚀 Production mode activated`);
    console.log(`🔒 Security: Enabled`);
  }
  
  if (isTest()) {
    console.log(`🧪 Test mode activated`);
  }
  
  // Database information
  if (config.SUPABASE_URL && config.SUPABASE_SERVICE_ROLE_KEY) {
    console.log(`🗄️  Database: Supabase`);
  } else if (config.DATABASE_URL && config.DATABASE_URL.includes('supabase')) {
    console.log(`🗄️  Database: Supabase`);
  } else {
    console.log(`🗄️  Database: Local PostgreSQL`);
  }
  
  // Cron service is now managed by GitHub Actions
  console.log('🤖 CronService available via API endpoints (managed by GitHub Actions)');
});
