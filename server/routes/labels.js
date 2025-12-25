import { createCRUDRoutes } from '../lib/crudRoutes.js';

export default (app) => {
  createCRUDRoutes(app, 'label', 'labels', {
    createSuccess: 'flash.labels.create.success',
    createError: 'flash.labels.create.error',
    updateSuccess: 'flash.labels.update.success',
    updateError: 'flash.labels.update.error',
    deleteSuccess: 'flash.labels.delete.success',
    deleteError: 'flash.labels.delete.error',
  });
};
