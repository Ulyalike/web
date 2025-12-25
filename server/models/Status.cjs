const objectionUnique = require('objection-unique');

const BaseModel = require('./BaseModel.cjs');

const unique = objectionUnique({ fields: ['name'] });

module.exports = class Status extends unique(BaseModel) {
  static get tableName() {
    return 'statuses';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 50 },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }


  static relationMappings = {
    tasks: {
      relation: BaseModel.HasManyRelation,
      modelClass: 'Task.cjs',
      join: {
        from: 'statuses.id',
        to: 'tasks.statusId',
      },
    },
  };

  static modifiers = {
    getShortData(query) {
      query.select(
        'id',
        'name'
      );
    },
  };
};
