import dotenv from 'dotenv';
import app from './app';

// Load environment variables
dotenv.config();

const PORT = process.env['PORT'] || 3001;

app.listen(PORT, () => {
  console.log(`🚀 FitAI Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env['NODE_ENV']}`);
  console.log(`🔗 URL: http://localhost:${PORT}`);
});
