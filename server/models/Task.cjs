const BaseModel = require('./BaseModel.cjs');

module.exports = class Task extends BaseModel {
  static get tableName() {
    return 'tasks';
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['name', 'statusId', 'creatorId'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1 },
        description: { type: 'string' },
        statusId: { type: 'integer', minimum: 1 },
        creatorId: { type: 'integer', minimum: 1 },
        executorId: { type: ['integer', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
      },
    };
  }


  $parseJson(json, opt) {
    json = super.$parseJson(json, opt);

    const converted = {
      ...json,
      ...(json.id !== undefined && { id: parseInt(json.id, 10) }),
      statusId: parseInt(json.statusId, 10),
      creatorId: parseInt(json.creatorId, 10),
      executorId: parseInt(json.executorId, 10) || null,
    };

    return converted;
  }

  static modifiers = {
    async filter(query, filterParams = {}) {
      const { status, executor, label, creator } = filterParams;

      query
        .skipUndefined()
        .where('statusId', status || undefined)
        .andWhere('executorId', executor || undefined)
        .andWhere('labels.id', label || undefined)
        .andWhere('creatorId', creator || undefined);
    },
  };

  static relationMappings = {
    creator: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'User.cjs',
      join: {
        from: 'tasks.creatorId',
        to: 'users.id',
      },
    },
    executor: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'User.cjs',
      join: {
        from: 'tasks.executorId',
        to: 'users.id',
      },
    },
    status: {
      relation: BaseModel.BelongsToOneRelation,
      modelClass: 'Status.cjs',
      join: {
        from: 'tasks.statusId',
        to: 'statuses.id',
      },
    },
    labels: {
      relation: BaseModel.ManyToManyRelation,
      modelClass: 'Label.cjs',
      join: {
        from: 'tasks.id',
        through: {
          from: 'tasks_labels.taskId',
          to: 'tasks_labels.labelId',
        },
        to: 'labels.id',
      },
    },
  };
};
