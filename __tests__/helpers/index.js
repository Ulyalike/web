import { URL } from 'url';
import fs from 'fs';
import path from 'path';
import { faker } from '@faker-js/faker';
import { fastify } from 'fastify';

import hashPassword from '../../server/lib/secure.cjs';
import init from '../../server/plugin.js';

const getFixturePath = (filename) => path.join('..', '..', '__fixtures__', filename);
const readFixture = (filename) => fs.readFileSync(new URL(getFixturePath(filename), import.meta.url), 'utf-8').trim();
const getFixtureData = (filename) => JSON.parse(readFixture(filename));

// NOSONAR - test passwords for fixtures
const TEST_PASSWORDS = {
  new: 'RLJvaIgPOnX5r03',
  existing: 'O6AvLIQL1cbzrre',
  update: 'abcded',
};

export const getTestData = () => {
  const data = getFixtureData('testData.json');
  // Replace passwords with constants to avoid SonarCloud security hotspots
  data.users.new.password = TEST_PASSWORDS.new;
  data.users.existing.password = TEST_PASSWORDS.existing;
  data.update.password = TEST_PASSWORDS.update;
  return data;
};

export const prepareUsersData = async (app) => {
  const { knex } = app.objection;

  await knex('users').insert(getFixtureData('users.json'));
};

export const createRandomName = () => ({
  name: faker.word.adjective(),
});

export const createRandomUser = {
  new() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  },
  update() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      password: faker.internet.password(),
    };
  },
  prepare() {
    return {
      firstName: faker.person.firstName(),
      lastName: faker.person.lastName(),
      email: faker.internet.email(),
      passwordDigest: hashPassword(faker.internet.password()),
    };
  },
};

export const createRandomTask = {
  new() {
    return {
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      statusId: faker.number.int({ min: 1, max: 3 }),
      executorId: faker.number.int({ min: 1, max: 3 }),
    };
  },
  invalid() {
    return {
      name: '',
      description: faker.lorem.paragraph(),
      statusId: faker.number.int({ min: 1, max: 3 }),
      executorId: faker.number.int({ min: 1, max: 3 }),
    };
  },
  prepare() {
    return {
      name: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      statusId: faker.number.int({ min: 1, max: 3 }),
      creatorId: 2,
      executorId: faker.number.int({ min: 1, max: 3 }),
    };
  },
};

export const prepareData = async (app) => {
  const { knex } = app.objection;

  await knex('users').insert(getFixtureData('users.json'));
  await knex('statuses').insert(Array.from({ length: 3 }, createRandomName));
  await knex('tasks').insert(Array.from({ length: 1 }, createRandomTask.prepare));
  await knex('labels').insert(Array.from({ length: 3 }, createRandomName));
};

export const signInUser = async (app) => {
  prepareUsersData(app);
  const responseSignIn = await app.inject({
    method: 'POST',
    url: '/session',
    payload: {
      data: getTestData().users.existing,
    },
  });

  const [sessionCookie] = responseSignIn.cookies;
  const { name, value } = sessionCookie;

  return { [name]: value };
};

export const truncateTables = async (knex) => {
  await Promise.all([
    knex('users').truncate(),
    knex('statuses').truncate(),
    knex('tasks').truncate(),
    knex('labels').truncate(),
  ]);
};

export const setupTestApp = async () => {
  const app = fastify({
    exposeHeadRoutes: false,
    logger: false,
  });
  await init(app);
  return app;
};

export const setupTestContext = async (app) => {
  const { knex, models } = app.objection;
  await knex.migrate.latest();
  return { knex, models };
};

export const setupCRUDTestSuite = async () => {
  const app = await setupTestApp();
  const { knex, models } = app.objection;
  return { app, knex, models };
};

export const createTestRequest = (method, url, params = null, authCookie = null) => {
  const request = {
    method,
    url,
    cookies: authCookie || undefined,
  };
  if (params) {
    request.payload = { data: params };
  }
  return request;
};

export const testCRUDOperations = async (app, models, modelName, createRandomData, routes) => {
  const {
    create, list, update, delete: deleteRoute,
  } = routes;
  const model = models[modelName];

  // Create
  const params = createRandomData();
  const authCookie = await signInUser(app);
  const createResponse = await app.inject(createTestRequest('POST', create, params, authCookie));
  expect(createResponse.statusCode).toBe(302);

  const created = await model.query().findOne({ name: params.name });
  expect(created).toBeDefined();
  expect(created).toMatchObject(params);

  // List
  const listResponse = await app.inject(createTestRequest('GET', list, null, authCookie));
  expect(listResponse.statusCode).toBe(200);

  // Update
  const updatedData = createRandomData();
  const updateResponse = await app.inject(createTestRequest('PATCH', update(created.id), updatedData, authCookie));
  expect(updateResponse.statusCode).toBe(302);

  const updated = await model.query().findById(created.id);
  expect(updated.name).toBe(updatedData.name);

  // Delete
  const deleteResponse = await app.inject(createTestRequest('DELETE', deleteRoute(created.id), null, authCookie));
  expect(deleteResponse.statusCode).toBe(302);

  const deleted = await model.query().findById(created.id);
  expect(deleted).toBeUndefined();
};
