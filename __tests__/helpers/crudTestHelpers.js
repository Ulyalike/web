// eslint-disable-next-line import/prefer-default-export
export const createCRUDTestHelpers = (
  routePrefix,
  modelName,
  createRandomData,
) => {
  const modelInstance = modelName.charAt(0).toLowerCase() + modelName.slice(1);

  const createItem = async (app, models, signInUser) => {
    const params = createRandomData();
    const authCookie = await signInUser(app);
    const response = await app.inject({
      method: 'POST',
      url: `/${routePrefix}`,
      payload: { data: params },
      cookies: authCookie,
    });

    expect(response.statusCode).toBe(302);
    const item = await models[modelInstance].query().findOne({ name: params.name });
    expect(item).toBeDefined();
    expect(item).toMatchObject(params);
  };

  const createWithValidationError = async (app, models, signInUser) => {
    const params = { name: '' };
    const authCookie = await signInUser(app);
    const response = await app.inject({
      method: 'POST',
      url: `/${routePrefix}`,
      payload: { data: params },
      cookies: authCookie,
    });

    expect(response.statusCode).toBe(200);
    const items = await models[modelInstance].query();
    expect(items).toEqual([]);
  };

  const listEmpty = async (app, models, signInUser) => {
    const wrongResponse = await app.inject({
      method: 'GET',
      url: `/${routePrefix}`,
    });
    expect(wrongResponse.statusCode).toBe(302);

    const authCookie = await signInUser(app);
    const responseWithAuth = await app.inject({
      method: 'GET',
      url: `/${routePrefix}`,
      cookies: authCookie,
    });

    expect(responseWithAuth.statusCode).toBe(200);
    const items = await models[modelInstance].query();
    expect(items).toEqual([]);
  };

  const listItems = async (app, models, signInUser) => {
    const [item1, item2] = await Promise.all([
      models[modelInstance].query().insert(createRandomData()),
      models[modelInstance].query().insert(createRandomData()),
    ]);

    const authCookie = await signInUser(app);
    const response = await app.inject({
      method: 'GET',
      url: `/${routePrefix}`,
      cookies: authCookie,
    });

    expect(response.statusCode).toBe(200);
    const items = await models[modelInstance].query();
    expect(items.length).toBe(2);
    expect(items[0].name).toBe(item1.name);
    expect(items[1].name).toBe(item2.name);
  };

  const updateItem = async (app, models, signInUser) => {
    const currentData = createRandomData();
    const updatedData = createRandomData();
    const { id } = await models[modelInstance].query().insert(currentData);

    const authCookie = await signInUser(app);
    const response = await app.inject({
      method: 'PATCH',
      url: `/${routePrefix}/${id}`,
      payload: { data: updatedData },
      cookies: authCookie,
    });

    expect(response.statusCode).toBe(302);
    const updated = await models[modelInstance].query().findById(id);
    expect(updated.name).toBe(updatedData.name);
  };

  const updateWithValidationError = async (app, models, signInUser, errorMessage) => {
    const currentData = createRandomData();
    const updatedData = { name: '' };
    const { id } = await models[modelInstance].query().insert(currentData);

    const authCookie = await signInUser(app);
    const response = await app.inject({
      method: 'PATCH',
      url: `/${routePrefix}/${id}`,
      payload: { data: updatedData },
      cookies: authCookie,
    });

    expect(response.statusCode).toBe(200);
    if (errorMessage) {
      expect(response.payload).toMatch(errorMessage);
    }
    const updated = await models[modelInstance].query().findById(id);
    expect(updated.name).toBe(currentData.name);
  };

  const deleteItem = async (app, models, signInUser) => {
    const item = await models[modelInstance].query().insert(createRandomData());
    const authCookie = await signInUser(app);
    const response = await app.inject({
      method: 'DELETE',
      url: `/${routePrefix}/${item.id}`,
      cookies: authCookie,
    });

    expect(response.statusCode).toBe(302);
    const deleted = await models[modelInstance].query().findById(item.id);
    expect(deleted).toBeUndefined();
  };

  const getEditForm = async (app, models, signInUser, itemId) => {
    const authCookie = await signInUser(app);
    const response = await app.inject({
      method: 'GET',
      url: `/${routePrefix}/${itemId}/edit`,
      cookies: authCookie,
    });
    return response;
  };

  return {
    createItem,
    createWithValidationError,
    listEmpty,
    listItems,
    updateItem,
    updateWithValidationError,
    deleteItem,
    getEditForm,
  };
};
