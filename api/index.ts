import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { AppModule } from '../src/app.module';

let cachedExpressApp: ReturnType<typeof express> | null = null;

async function bootstrapExpressApp(): Promise<ReturnType<typeof express>> {
  if (cachedExpressApp) {
    return cachedExpressApp;
  }

  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    {
      logger: ['error', 'warn', 'log'],
    },
  );

  await nestApp.init();
  cachedExpressApp = expressApp;
  return expressApp;
}

export default async function handler(
  req: express.Request,
  res: express.Response,
): Promise<void> {
  const app = await bootstrapExpressApp();
  app(req, res);
}
