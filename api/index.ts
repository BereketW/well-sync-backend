import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import type { Express, Request, Response } from 'express';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

let cachedExpressApp: Express | null = null;

async function bootstrapExpressApp(): Promise<Express> {
  if (cachedExpressApp) {
    return cachedExpressApp;
  }

  const nestApp = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  configureApp(nestApp);
  await nestApp.init();
  const expressInstance = nestApp.getHttpAdapter().getInstance() as Express;
  cachedExpressApp = expressInstance;
  return cachedExpressApp;
}

export default async function handler(
  req: Request,
  res: Response,
): Promise<void> {
  const app = await bootstrapExpressApp();
  app(req, res);
}
