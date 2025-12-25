import welcome from './welcome.js';
import users from './users.js';
import session from './session.js';
import statuses from './statuses.js';
import tasks from './tasks.js';
import labels from './labels.js';

const routes = [
  welcome,
  users,
  session,
  statuses,
  tasks,
  labels,
];

export default (app) => {
  routes.forEach((route) => route(app));
};
