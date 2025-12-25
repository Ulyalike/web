export const up = (knex) => knex.schema.createTable('task_labels', (table) => {
  table.increments('id').primary();
  table.integer('taskId').unsigned().notNullable();
  table.integer('labelId').unsigned().notNullable();
  table.timestamps(true, true);

  table.foreign('taskId').references('id').inTable('tasks').onDelete('CASCADE');
  table.foreign('labelId').references('id').inTable('labels').onDelete('CASCADE');
  table.unique(['taskId', 'labelId']);
});

export const down = (knex) => knex.schema.dropTableIfExists('task_labels');
