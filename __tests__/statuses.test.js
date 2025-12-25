import {
  createRandomName as createRandomStatus, signInUser, truncateTables, setupCRUDTestSuite,
} from './helpers/index.js';
import { createCRUDTestHelpers } from './helpers/crudTestHelpers.js';

describe('Status Routes CRUD operations', () => {
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

  const testHelpers = createCRUDTestHelpers('statuses', 'status', createRandomStatus);

  describe('POST /statuses - Create Status', () => {
    it('should create a new status', async () => {
      await testHelpers.createItem(app, models, signInUser);
    });

    it('should throw validation error for invalid data', async () => {
      await testHelpers.createWithValidationError(app, models, signInUser);
    });
  });

  describe('GET /statuses - List Statuses', () => {
    it('should return empty array when no statuses exist', async () => {
      await testHelpers.listEmpty(app, models, signInUser);
    });

    it('should return list of statuses', async () => {
      await testHelpers.listItems(app, models, signInUser);
    });
  });

  describe('PATCH /statuses/:id - Update Status', () => {
    it('should return status by ID', async () => {
      const status = await models.status.query().insert(createRandomStatus());
      const response = await testHelpers.getEditForm(app, models, signInUser, status.id);

      expect(response.statusCode).toBe(200);
    });

    it('should update status name', async () => {
      await testHelpers.updateItem(app, models, signInUser);
    });

    it('should throw validation error for invalid data', async () => {
      await testHelpers.updateWithValidationError(app, models, signInUser);
    });
  });

  describe('DELETE /statuses/:id - Delete Status', () => {
    it('should delete status', async () => {
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
