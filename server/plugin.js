import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import fastifyStatic from '@fastify/static';
import fastifyView from '@fastify/view';
import fastifyFormbody from '@fastify/formbody';
import fastifySecureSession from '@fastify/secure-session';
import { Authenticator } from '@fastify/passport';
import fastifySensible from '@fastify/sensible';
import fastifyMethodOverride from 'fastify-method-override';
import fastifyObjectionjs from 'fastify-objectionjs';
import qs from 'qs';
import Pug from 'pug';
import i18next from 'i18next';
import Rollbar from 'rollbar';

import ru from './locales/ru.js';
import addRoutes from './routes/index.js';
import getHelpers from './helpers/index.js';
import * as knexConfig from '../knexfile.js';
import models from './models/index.js';
import FormStrategy from './lib/passportStrategies/FormStrategy.js';

const __dirname = fileURLToPath(path.dirname(import.meta.url));

const mode = process.env.NODE_ENV || 'development';

const fastifyPassport = new Authenticator();

const setUpViews = (app) => {
  const helpers = getHelpers(app);
  app.register(fastifyView, {
    engine: {
      pug: Pug,
    },
    includeViewExtension: true,
    defaultContext: {
      ...helpers,
      assetPath: (filename) => `/assets/${filename}`,
    },
    templates: path.join(__dirname, '..', 'server', 'views'),
  });

  app.decorateReply('render', function render(viewPath, locals) {
    this.view(viewPath, { ...locals, reply: this });
  });
};

const setUpStaticAssets = (app) => {
  const pathPublic = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(pathPublic)) {
    fs.mkdirSync(pathPublic, { recursive: true });
  }
  app.register(fastifyStatic, {
    root: pathPublic,
    prefix: '/assets/',
  });
};

const setupLocalization = async () => {
  await i18next
    .init({
      lng: 'ru',
      fallbackLng: 'ru',
      resources: {
        ru,
      },
    });
};

const addHooks = (app) => {
  app.addHook('preHandler', async (req, reply) => {
    reply.locals = {
      isAuthenticated: () => req.isAuthenticated(),
    };
  });
};

const registerPlugins = async (app) => {
  await app.register(fastifySensible);
  await app.register(fastifyFormbody, { parser: qs.parse });
  await app.register(fastifySecureSession, {
    secret: process.env.SESSION_SECRET,
    cookie: {
      path: '/',
    },
  });

  const userDeserializer = (user) => app.objection.models.user.query().findById(user.id);
  fastifyPassport.registerUserDeserializer(userDeserializer);
  fastifyPassport.registerUserSerializer((user) => Promise.resolve(user));
  fastifyPassport.use(new FormStrategy('form', app));
  await app.register(fastifyPassport.initialize());
  await app.register(fastifyPassport.secureSession());
  await app.decorate('fp', fastifyPassport);

  const authenticateMiddleware = (...args) => fastifyPassport.authenticate(
    'form',
    {
      failureRedirect: '/',
      failureFlash: i18next.t('flash.authError'),
    },
  )(...args);
  app.decorate('authenticate', authenticateMiddleware);

  const requireCurrentUserMiddleware = (req, reply, done) => {
    if (req.user.id !== Number(req.params.id)) {
      req.flash('error', i18next.t('flash.notCurrentUser'));
      reply.redirect('/users');
      return reply;
    }
    return done();
  };
  await app.decorate('requireCurrentUser', requireCurrentUserMiddleware);

  await app.register(fastifyMethodOverride);
  await app.register(fastifyObjectionjs, {
    knexConfig: knexConfig[mode],
    models,
  });
};

export default async (app) => {
  if (process.env.NODE_ENV !== 'test' && process.env.ROLLBAR_ACCESS_TOKEN) {
    const rollbar = new Rollbar({
      accessToken: process.env.ROLLBAR_ACCESS_TOKEN,
      captureUncaught: true,
      captureUnhandledRejections: true,
      environment: mode,
    });
    rollbar.log('Hello world!');
  }

  await registerPlugins(app);
  await setupLocalization();
  setUpViews(app);
  setUpStaticAssets(app);
  addRoutes(app);
  addHooks(app);

  return app;
};
