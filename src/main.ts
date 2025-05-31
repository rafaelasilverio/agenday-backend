import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

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
