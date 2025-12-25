import fastify from 'fastify';
import init from '../server/plugin.js';
import { prepareData } from './helpers/index.js';

describe('test session', () => {
  let app;
  let knex;

  beforeAll(async () => {
    app = fastify({
      exposeHeadRoutes: false,
      logger: false, // как вариант logger: { transport: { target: 'pino-pretty' } },
    });
    await init(app);
    knex = app.objection.knex;
    await knex.migrate.latest();
    await prepareData(app);
  });

  describe('GET /session/new', () => {
    it('should render new session form', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/session/new',
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch('Вход');
    });
  });

  describe('POST /session', () => {
    it('should handle authentication error', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/session',
        payload: {
          data: {
            email: 'nonexistent@mail.com',
            password: 'O6AvLIQL1cbzrre', // NOSONAR - test password
          },
        },
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch('Неверная почта или пароль');
    });

    it('should log in user and redirect on success', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/session',
        payload: {
          data: {
            email: 'lawrence.kulas87@outlook.com',
            password: 'O6AvLIQL1cbzrre', // NOSONAR - test password
          },
        },
      });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/');
    });
  });

  describe('DELETE /session', () => {
    it('should redirect to home', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/session',
      });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/');
    });
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});
