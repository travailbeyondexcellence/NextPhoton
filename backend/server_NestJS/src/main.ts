import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from root .env file FIRST
const rootDir = path.resolve(__dirname, '../../../');
const dotenvPath = path.join(rootDir, '.env');
dotenv.config({ path: dotenvPath });
console.log('📄 Loading .env from:', dotenvPath);
console.log('🔍 DATABASE_URL configured:', !!process.env.DATABASE_URL);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for development
  app.enableCors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:369',
    credentials: true,
  });

  const PORT = process.env.BACKEND_PORT || process.env.PORT || 963;
  // Bind to all interfaces (0.0.0.0) to make it accessible from Windows host
  await app.listen(PORT, '0.0.0.0');
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`🚀 GraphQL Playground: http://localhost:${PORT}/graphql`);
  console.log(`🚀 From Windows, try: http://172.23.127.124:${PORT}/graphql`);
}
bootstrap();
