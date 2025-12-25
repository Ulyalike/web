import i18next from 'i18next';

export default (app) => {
  app.get('/session/new', (request, reply) => {
    const signInForm = {};
    reply.render('session/new', { signInForm });
  });

  app.post('/session', app.fp.authenticate('form', async (request, reply, err, user) => {
    if (err) {
      return app.httpErrors.internalServerError(err);
    }
    if (!user) {
      const signInForm = request.body.data;
      const errors = {
        email: [{
          message: 'Неверная почта или пароль',
        }],
      };
      reply.render('session/new', { signInForm, errors });
      return reply;
    }
    await request.logIn(user);
    request.flash('success', i18next.t('flash.session.create.success'));
    reply.redirect('/');
    return reply;
  }));

  app.delete('/session', (request, reply) => {
    request.logOut();
    request.flash('info', i18next.t('flash.session.delete.success'));
    reply.redirect('/');
  });
};
