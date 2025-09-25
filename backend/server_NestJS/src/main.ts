import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for development
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:6000'],
    credentials: true,
  });

  const PORT = process.env.PORT ?? 6000;
  // Bind to all interfaces (0.0.0.0) to make it accessible from Windows host
  await app.listen(PORT, '0.0.0.0');
  console.log(`🚀 Server ready at http://localhost:${PORT}`);
  console.log(`🚀 GraphQL Playground: http://localhost:${PORT}/graphql`);
  console.log(`🚀 From Windows, try: http://172.23.127.124:${PORT}/graphql`);
}
bootstrap();
