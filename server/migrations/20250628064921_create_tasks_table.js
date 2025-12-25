/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = (knex) => (
  knex.schema.createTable('tasks', (table) => {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.string('description');
    table.integer('status_id').notNullable();
    table.integer('creator_id').notNullable();
    table.integer('executor_id').nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());

    table.foreign('status_id')
      .references('statuses.id')
      .onUpdate('CASCADE') // На будущее
      .onDelete('RESTRICT');

    table.foreign('creator_id')
      .references('users.id')
      .onUpdate('CASCADE') // На будущее
      .onDelete('RESTRICT'); // Запрещаем удаление создателя задач

    table.foreign('executor_id')
      .references('users.id')
      .onUpdate('CASCADE') // На будущее
      .onDelete('SET NULL'); // При удалении исполнителя устанавливаем NULL
  })
);

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = (knex) => knex.schema.dropTable('tasks');
