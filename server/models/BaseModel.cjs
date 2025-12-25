const { Model } = require('objection');

module.exports = class BaseModel extends Model {
  static get modelPaths() {
    return [__dirname];
  }

  async $beforeInsert(queryContext) {
    await super.$beforeInsert(queryContext);

    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }

  async $beforeUpdate(opt, queryContext) {
    await super.$beforeUpdate(opt, queryContext);

    const { old } = opt;

    const changedFields = Object.keys(this).filter((key) =>
      key !== 'updatedAt'
      && this[key] !== old[key]
      && key[0] !== '$'
    );

    if (changedFields.length > 0) {
      this.updatedAt = new Date().toISOString();
    }
  }
};
