import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let token: string;

  beforeEach(async () => {
    process.env.AUTH_JWT_SECRET = 'test-secret';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    const config = new DocumentBuilder()
      .setTitle('Well-Sync Backend API')
      .setDescription('Well-Sync backend API documentation')
      .setVersion('1.0.0')
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
    app.use('/docs-json', (_req: Request, res: Response) => res.json(document));

    await app.init();

    const tokenResponse = await request(app.getHttpServer())
      .post('/auth/dev-token')
      .send({ sub: 'u-1000', email: 'alex.doe@example.com', role: 'user' });
    const tokenBody = tokenResponse.body as { accessToken: string };
    token = tokenBody.accessToken;
  });

  afterEach(async () => {
    await app.close();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  it('/docs-json (GET)', async () => {
    const response = await request(app.getHttpServer()).get('/docs-json');
    expect(response.status).toBe(200);
    const body = response.body as { openapi?: string };
    expect(body.openapi).toBeDefined();
  });

  it('/users/profile (GET, PUT)', async () => {
    const getResponse = await request(app.getHttpServer())
      .get('/users/profile')
      .set('Authorization', `Bearer ${token}`);
    expect(getResponse.status).toBe(200);
    const profile = getResponse.body as { id?: string; name?: string };
    expect(profile.id).toBeDefined();

    const updateResponse = await request(app.getHttpServer())
      .put('/users/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Updated User', focusAreas: ['sleep'] });
    expect(updateResponse.status).toBe(200);
    const updatedProfile = updateResponse.body as {
      name?: string;
      focusAreas?: string[];
    };
    expect(updatedProfile.name).toBe('Updated User');
    expect(updatedProfile.focusAreas).toEqual(['sleep']);
  });

  it('/users/goals (GET, POST)', async () => {
    const listResponse = await request(app.getHttpServer())
      .get('/users/goals')
      .set('Authorization', `Bearer ${token}`);
    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);

    const createResponse = await request(app.getHttpServer())
      .post('/users/goals')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Hydration Habit',
        category: 'nutrition',
        targetMetric: 'liters',
        targetValue: '2',
        cadence: 'daily',
      });
    expect(createResponse.status).toBe(201);
    const goal = createResponse.body as { id?: string };
    expect(goal.id).toBeDefined();
  });

  it('/wellness/inputs (GET, POST, GET by id)', async () => {
    const initialList = await request(app.getHttpServer())
      .get('/wellness/inputs')
      .set('Authorization', `Bearer ${token}`);
    expect(initialList.status).toBe(200);

    const createResponse = await request(app.getHttpServer())
      .post('/wellness/inputs')
      .set('Authorization', `Bearer ${token}`)
      .send({
        timestamp: new Date().toISOString(),
        category: 'sleep',
        summary: 'Slept well',
        metrics: { hours: 7 },
      });
    expect(createResponse.status).toBe(201);
    const createdInput = createResponse.body as { id?: string };
    expect(createdInput.id).toBeDefined();

    const getResponse = await request(app.getHttpServer())
      .get(`/wellness/inputs/${createdInput.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(getResponse.status).toBe(200);
    const storedInput = getResponse.body as { summary?: string };
    expect(storedInput.summary).toBe('Slept well');
  });

  it('/wellness/inputs/:id returns 404 for unknown id', async () => {
    const response = await request(app.getHttpServer())
      .get('/wellness/inputs/does-not-exist')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });

  it('/progress (GET), /progress/milestones (POST), /progress/tips (GET)', async () => {
    const insights = await request(app.getHttpServer())
      .get('/progress')
      .set('Authorization', `Bearer ${token}`);
    expect(insights.status).toBe(200);
    expect(Array.isArray(insights.body)).toBe(true);

    const milestone = await request(app.getHttpServer())
      .post('/progress/milestones')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Completed week 1',
        achievedOn: new Date().toISOString(),
      });
    expect(milestone.status).toBe(201);
    const createdMilestone = milestone.body as { id?: string };
    expect(createdMilestone.id).toBeDefined();

    const tips = await request(app.getHttpServer())
      .get('/progress/tips')
      .set('Authorization', `Bearer ${token}`);
    expect(tips.status).toBe(200);
    expect(Array.isArray(tips.body)).toBe(true);
  });

  it('/admin/users (GET), /admin/ai/sources (POST), /admin/logs (GET)', async () => {
    const users = await request(app.getHttpServer())
      .get('/admin/users')
      .set('Authorization', `Bearer ${token}`);
    expect(users.status).toBe(200);
    expect(Array.isArray(users.body)).toBe(true);

    const source = await request(app.getHttpServer())
      .post('/admin/ai/sources')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Source',
        type: 'blog',
        url: 'https://example.com',
        lastValidated: new Date().toISOString(),
      });
    expect(source.status).toBe(201);
    const createdSource = source.body as { id?: string };
    expect(createdSource.id).toBeDefined();

    const logs = await request(app.getHttpServer())
      .get('/admin/logs')
      .set('Authorization', `Bearer ${token}`);
    expect(logs.status).toBe(200);
    expect(Array.isArray(logs.body)).toBe(true);
  });

  it('/ai/resources (GET)', async () => {
    const response = await request(app.getHttpServer())
      .get('/ai/resources')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('/ai/explain (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/ai/explain')
      .set('Authorization', `Bearer ${token}`)
      .send({
        recommendationHeadline: 'Test plan',
        areaOfFocus: 'sleep',
      });
    expect(response.status).toBe(201);
    expect(typeof response.text).toBe('string');
  });

  it('/ai/recommend (POST)', async () => {
    const response = await request(app.getHttpServer())
      .post('/ai/recommend')
      .set('Authorization', `Bearer ${token}`)
      .send({
        userContext: { id: 'u-1000', focusAreas: ['sleep'], timezone: 'UTC' },
        latestInputs: [
          {
            category: 'sleep',
            summary: 'Sleep quality is improving',
            timestamp: new Date().toISOString(),
          },
        ],
      });

    expect([200, 201, 503]).toContain(response.status);
  });
});
