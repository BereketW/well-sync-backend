import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { getAbsoluteFSPath } from 'swagger-ui-dist';

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

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const swaggerAssetsPath: string = getAbsoluteFSPath();
  const swaggerStatic = express.static(swaggerAssetsPath, { index: false });
  app.use('/docs', (req: Request, res: Response, next: NextFunction): void => {
    if (req.path === '' || req.path === '/') {
      next();
      return;
    }
    swaggerStatic(req, res, next);
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });
  app.use('/docs-json', (_req: Request, res: Response): void => {
    res.type('application/json').send(document);
  });
}
