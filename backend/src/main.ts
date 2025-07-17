import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  prefix: '/uploads',
  });
  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Catálogo de Produtos')
    .setDescription('API para gestão de produtos')
    .setVersion('1.0')
    .addTag('produtos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

 
  app.enableCors(); // Para aceitar requisições do React web e mobile

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
