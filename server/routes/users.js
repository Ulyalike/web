import i18next from 'i18next';

export default (app) => {
  const objectionModels = app.objection.models;

  app
    .get('/users', async (request, reply) => {
      const users = await objectionModels.user.query().modify('getPublicDate');
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', (request, reply) => {
      const user = new objectionModels.user();
      reply.render('users/new', { user });
    })
    .get('/users/:id/edit', { preValidation: app.authenticate, preHandler: app.requireCurrentUser }, async (request, reply) => {
      const { id } = request.params;
      const user = await objectionModels.user.query().findById(id);
      reply.render('users/edit', { user });
      return reply;
    })
    .post('/users', async (request, reply) => {
      try {
        await objectionModels.user.query().insert(request.body.data);
        request.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect('/');
      } catch ({ data }) {
        request.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: request.body.data, errors: data });
      }

      return reply;
    })
    .patch('/users/:id', async (request, reply) => {
      const { id } = request.params;
      const user = await objectionModels.user.query().findOne({ id });
      try {
        await user.$query().patch(request.body.data);
        request.flash('info', i18next.t('flash.users.update.success'));
        reply.redirect('/users');
      } catch ({ data }) {
        request.flash('error', i18next.t('flash.users.update.error'));
        reply.render('users/edit', { user, errors: data });
      }
      return reply;
    })
    .delete('/users/:id', { preValidation: app.authenticate, preHandler: app.requireCurrentUser }, async (request, reply) => {
      const { id } = request.params;
      const user = await objectionModels.user.query().findById(id);

      try {
        await user.$query().delete();
        request.logOut();
        request.flash('info', i18next.t('flash.users.delete.success'));
        reply.redirect('/users');
      } catch (error) {
        console.error(error);
        request.flash('error', i18next.t('flash.users.delete.error'));
        reply.redirect('/users');
      }
      return reply;
    });
};
