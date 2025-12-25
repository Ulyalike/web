export const up = (knex) => knex.schema.createTable('tasks', (table) => {
  table.increments('id').primary();
  table.string('name').notNullable();
  table.text('description');
  table.integer('statusId').unsigned().notNullable();
  table.integer('creatorId').unsigned().notNullable();
  table.integer('executorId').unsigned();
  table.timestamps(true, true);

  table.foreign('statusId').references('id').inTable('statuses').onDelete('RESTRICT');
  table.foreign('creatorId').references('id').inTable('users').onDelete('RESTRICT');
  table.foreign('executorId').references('id').inTable('users').onDelete('SET NULL');
});

export const down = (knex) => knex.schema.dropTableIfExists('tasks');
