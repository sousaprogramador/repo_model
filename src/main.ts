import 'dd-trace/init';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ApplicationModule } from './modules';
import { IS_PROD, NODE_ENV, PORT } from './settings';

async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: IS_PROD, forbidUnknownValues: true }));

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Pinguim API')
    .setDescription('The Pinguim API - Tech Team')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, '0.0.0.0', () => {
    console.log('******************************');
    console.log(`SERVER STARTED as ${NODE_ENV} in port ${PORT}`);
    console.log('******************************');
  });
  console.log(`Application is running on: ${await app.getUrl()}`);

  process.on('unhandledRejection', (reason, promise) => {
    console.error(reason);
    console.log(promise);
  });

  process.on('uncaughtException', err => {
    console.error(err);
  });

  process.on('SIGTERM', async () => {
    await app.close();
    process.exit(0);
  });
}
bootstrap().catch(err => console.error(err));
