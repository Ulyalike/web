import {
  createRandomTask, signInUser, truncateTables, prepareData, setupCRUDTestSuite,
} from './helpers/index.js';

describe('Tasks Routes CRUD operations', () => {
  let app;
  let knex;
  let models;

  beforeAll(async () => {
    const context = await setupCRUDTestSuite();
    app = context.app;
    knex = context.knex;
    models = context.models;
  });

  beforeEach(async () => {
    await knex.migrate.latest();
  });

  describe('POST /tasks', () => {
    it('should return form for new task', async () => {
      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'GET',
        url: '/tasks/new',
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch('Создание задачи');
    });

    it('should create new task', async () => {
      const authCookie = await signInUser(app);
      const params = createRandomTask.new();

      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          data: params,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/tasks');

      const task = await models.task.query().first();
      expect(task).toMatchObject(params);
    });

    it('should throw validation error for invalid data', async () => {
      const authCookie = await signInUser(app);
      const params = createRandomTask.invalid();

      const response = await app.inject({
        method: 'POST',
        url: '/tasks',
        payload: {
          data: params,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch('Не удалось создать задачу');

      const task = await models.task.query();
      expect(task).toEqual([]);
    });
  });

  describe('GET /tasks', () => {
    it('should return empty array when no tasks exist', async () => {
      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'GET',
        url: '/tasks',
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);

      const task = await models.task.query();
      expect(task).toEqual([]);
    });

    it('should return tasks list', async () => {
      await prepareData(app);
      const { name } = await models.task.query().first();

      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'GET',
        url: '/tasks',
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch(name);
    });

    it('should return task details', async () => {
      await prepareData(app);
      const authCookie = await signInUser(app);
      const { id, name } = await models.task.query().first();
      const response = await app.inject({
        method: 'GET',
        url: `/tasks/${id}`,
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch(name);
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should return edit form for task', async () => {
      await prepareData(app);
      const authCookie = await signInUser(app);
      const { id } = await models.task.query().first();
      const response = await app.inject({
        method: 'GET',
        url: `/tasks/${id}/edit`,
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch('Изменение задачи');
    });

    it('should update task successfully', async () => {
      await prepareData(app);
      const authCookie = await signInUser(app);
      const task = await models.task.query().first();
      const params = createRandomTask.new();

      const response = await app.inject({
        method: 'PATCH',
        url: `/tasks/${task.id}`,
        payload: {
          data: params,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/tasks');

      const updatedTask = await models.task.query().findById(task.id);
      expect(updatedTask.name).toBe(params.name);
      expect(updatedTask.description).toBe(params.description);
    });

    it('should throw validation error for invalid data', async () => {
      await prepareData(app);
      const authCookie = await signInUser(app);
      const task = await models.task.query().first();
      const params = createRandomTask.invalid();

      const response = await app.inject({
        method: 'PATCH',
        url: `/tasks/${task.id}`,
        payload: {
          data: params,
        },
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch('Не удалось обновить задачу');

      const updatedTask = await models.task.query().findById(task.id);
      expect(updatedTask.name).not.toBe(params.name);
      expect(updatedTask.name).toBe(task.name);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete task successfully', async () => {
      await prepareData(app);
      const authCookie = await signInUser(app);
      const task = await models.task.query().first();

      const response = await app.inject({
        method: 'DELETE',
        url: `/tasks/${task.id}`,
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/tasks');

      const deletedTask = await models.task.query().findById(task.id);
      expect(deletedTask).toBeUndefined();
    });

    it('should not allow deletion if not owner', async () => {
      await prepareData(app);
      const authCookie = await signInUser(app);
      const task = await models.task.query().insert({
        ...createRandomTask.new(),
        creatorId: 1,
      });

      const response = await app.inject({
        method: 'DELETE',
        url: `/tasks/${task.id}`,
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(302);
      expect(response.headers.location).toBe('/tasks');

      const stillExists = await models.task.query().findById(task.id);
      expect(stillExists).toBeDefined();
    });
  });

  afterEach(async () => {
    await truncateTables(knex);
  });

  afterAll(async () => {
    await knex.migrate.rollback();
    await app.close();
  });
});
