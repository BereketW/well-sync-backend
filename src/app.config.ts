import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, { type Request, type Response } from 'express';

export function configureApp(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Well-Sync Backend API')
    .setDescription('Well-Sync backend API documentation')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'bearer',
    )
    .addSecurityRequirements('bearer')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.use('/docs-json', (_req: Request, res: Response) => res.json(document));
}
