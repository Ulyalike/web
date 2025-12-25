export default (app) => {
  app
    .get('/', (req, reply) => {
      reply.render('welcome/index');
    });
};
