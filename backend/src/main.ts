import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { join } from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { fastifyMultipart } from '@fastify/multipart';
import fastifyStatic from '@fastify/static';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('Catálogo de Produtos')
    .setDescription('API para gestão de produtos')
    .setVersion('1.0')
    .addTag('produtos')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Uploads
  await app.register(fastifyMultipart);
  await app.register(fastifyStatic, {
    root: join(__dirname, '..', 'uploads'),
    prefix: '/uploads/',
  });

  app.enableCors(); // Para aceitar requisições do React web e mobile

  await app.listen(3000, '0.0.0.0');
}
bootstrap();
