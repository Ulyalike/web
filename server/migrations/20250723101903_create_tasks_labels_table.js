/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => (
  knex.schema.createTable('tasks_labels', (table) => {
    table.increments('id').primary();
    table.integer('task_id').unsigned().references('tasks.id').onDelete('CASCADE');
    table.integer('label_id').unsigned().references('labels.id').onDelete('RESTRICT');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => knex.schema.dropTable('tasks_labels');
