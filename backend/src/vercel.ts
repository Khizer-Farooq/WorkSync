import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

let cachedApp: any;

async function bootstrapServer() {
  if (!cachedApp) {
    const expressApp = express();
    const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp));

    nestApp.use(helmet());
    nestApp.use(compression());
    nestApp.use(cookieParser());

    nestApp.enableCors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    });

    nestApp.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    nestApp.useGlobalInterceptors(new ResponseInterceptor());
    nestApp.useGlobalFilters(new HttpExceptionFilter());

    nestApp.setGlobalPrefix('api');

    const swaggerConfig = new DocumentBuilder()
      .setTitle('WorkSync API')
      .setDescription('Team Task & Shift Management System API Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const swaggerDocument = SwaggerModule.createDocument(nestApp, swaggerConfig);
    SwaggerModule.setup('api/docs', nestApp, swaggerDocument);

    await nestApp.init();
    cachedApp = expressApp;
  }

  return cachedApp;
}

export default async function handler(req: Request, res: Response) {
  const app = await bootstrapServer();
  return app(req, res);
}
