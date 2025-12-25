import i18next from 'i18next';

// eslint-disable-next-line import/prefer-default-export
export const createCRUDRoutes = (app, modelName, routePrefix, flashKeys) => {
  const objectionModels = app.objection.models;
  const Model = objectionModels[modelName];
  const modelInstance = modelName.charAt(0).toLowerCase() + modelName.slice(1);

  app
    .get(`/${routePrefix}`, { preValidation: app.authenticate }, async (request, reply) => {
      const items = await Model.query();
      reply.render(`${routePrefix}/index`, { [routePrefix]: items });
      return reply;
    })
    .get(`/${routePrefix}/new`, { preValidation: app.authenticate }, (request, reply) => {
      const item = new Model();
      reply.render(`${routePrefix}/new`, { [modelInstance]: item });
      return reply;
    })
    .get(`/${routePrefix}/:id/edit`, { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const item = await Model.query().findById(id);
      reply.render(`${routePrefix}/edit`, { [modelInstance]: item });
      return reply;
    })
    .post(`/${routePrefix}`, { preValidation: app.authenticate }, async (request, reply) => {
      const item = new Model();
      item.$set(request.body.data);

      try {
        if (modelName === 'status') {
          const validItem = await Model.fromJson(request.body.data);
          await Model.query().insert(validItem);
        } else {
          await Model.query().insert(request.body.data);
        }
        request.flash('info', i18next.t(flashKeys.createSuccess));
        reply.redirect(`/${routePrefix}`);
      } catch ({ data }) {
        request.flash('error', i18next.t(flashKeys.createError));
        reply.render(`${routePrefix}/new`, { [modelInstance]: item, errors: data });
      }
      return reply;
    })
    .patch(`/${routePrefix}/:id`, { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const item = await Model.query().findById(id);
      const { data } = request.body;

      try {
        if (modelName === 'label') {
          item.$set(data);
        }
        await item.$query().patch(data);
        request.flash('info', i18next.t(flashKeys.updateSuccess));
        reply.redirect(`/${routePrefix}`);
      } catch (errors) {
        request.flash('error', i18next.t(flashKeys.updateError));
        const errorData = errors.data || errors;
        reply.render(`${routePrefix}/edit`, { [modelInstance]: item, errors: errorData });
      }
      return reply;
    })
    .delete(`/${routePrefix}/:id`, { preValidation: app.authenticate }, async (request, reply) => {
      const { id } = request.params;
      const item = await Model.query().findById(id);

      try {
        await item.$query().delete();
        request.flash('info', i18next.t(flashKeys.deleteSuccess));
        reply.redirect(`/${routePrefix}`);
      } catch (error) {
        console.error(error);
        request.flash('error', i18next.t(flashKeys.deleteError));
        reply.redirect(`/${routePrefix}`);
      }
      return reply;
    });
};
