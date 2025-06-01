import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

   // Habilita o CORS para o Angular local
  app.enableCors({
    origin: 'http://localhost:4200', // Front-end Angular
    credentials: true               // Permite cookies ou headers com autenticação
  });

  // Configuração básica do Swagger
  const config = new DocumentBuilder()
    .setTitle('Agenday API')
    .setDescription('Documentação da API do sistema de agendamentos Agenday')
    .setVersion('1.0')
    .addBearerAuth() // Habilita autenticação JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Acessível em /api

  await app.listen(3000);
}
bootstrap();
