import {
  createRandomName as createRandomLabel, signInUser, truncateTables, setupCRUDTestSuite,
} from './helpers/index.js';
import { createCRUDTestHelpers } from './helpers/crudTestHelpers.js';

describe('Label Routes CRUD operations', () => {
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

  const testHelpers = createCRUDTestHelpers('labels', 'label', createRandomLabel);

  describe('POST /labels - Create Label', () => {
    it('should render new label form', async () => {
      const authCookie = await signInUser(app);
      const response = await app.inject({
        method: 'GET',
        url: '/labels/new',
        cookies: authCookie,
      });

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch('Создание метки');
    });

    it('should create a new label', async () => {
      await testHelpers.createItem(app, models, signInUser);
    });

    it('should throw validation error for invalid data', async () => {
      await testHelpers.createWithValidationError(app, models, signInUser);
    });
  });

  describe('GET /labels - List Labels', () => {
    it('should return empty array when no labels exist', async () => {
      await testHelpers.listEmpty(app, models, signInUser);
    });

    it('should return list of labels', async () => {
      await testHelpers.listItems(app, models, signInUser);
    });
  });

  describe('PATCH /labels/:id - Update Label', () => {
    it('should return label by ID', async () => {
      const label = await models.label.query().insert(createRandomLabel());
      const response = await testHelpers.getEditForm(app, models, signInUser, label.id);

      expect(response.statusCode).toBe(200);
      expect(response.payload).toMatch('Изменение метки');
      expect(response.payload).toMatch(label.name);
    });

    it('should update label name', async () => {
      await testHelpers.updateItem(app, models, signInUser);
    });

    it('should throw validation error for invalid data', async () => {
      await testHelpers.updateWithValidationError(app, models, signInUser, 'Не удалось обновить метку');
    });
  });

  describe('DELETE /labels/:id - Delete Label', () => {
    it('should delete label', async () => {
      await testHelpers.deleteItem(app, models, signInUser);
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
