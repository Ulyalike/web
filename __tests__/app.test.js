import { fastify } from 'fastify';
import init from '../server/plugin';

describe('requests', () => {
  let app;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: false, // как вариант logger: { transport: { target: 'pino-pretty' } },
    });
    await init(app);
  });

  it('GET 200', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/',
    });
    expect(res.statusCode).toBe(200);
  });

  it('GET 404', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/path',
    });
    expect(res.statusCode).toBe(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
