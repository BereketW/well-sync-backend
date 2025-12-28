import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import type { Request, Response } from 'express';
import { AppModule } from '../src/app.module';
import { configureApp } from '../src/app.config';

type ExpressHandler = (req: Request, res: Response) => void;

let cachedExpressApp: ExpressHandler | null = null;

async function bootstrapExpressApp(): Promise<ExpressHandler> {
  if (cachedExpressApp) {
    return cachedExpressApp;
  }

  const nestApp = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  configureApp(nestApp);
  await nestApp.init();
  const expressInstance = nestApp
    .getHttpAdapter()
    .getInstance() as unknown as ExpressHandler;
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
