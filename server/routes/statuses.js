import { createCRUDRoutes } from '../lib/crudRoutes.js';

export default (app) => {
  createCRUDRoutes(app, 'status', 'statuses', {
    createSuccess: 'flash.statuses.create.success',
    createError: 'flash.statuses.create.error',
    updateSuccess: 'flash.statuses.update.success',
    updateError: 'flash.statuses.update.error',
    deleteSuccess: 'flash.statuses.delete.success',
    deleteError: 'flash.statuses.delete.error',
  });
};
