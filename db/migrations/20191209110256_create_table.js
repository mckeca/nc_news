exports.up = function(knex) {
  return knex.schema.createTable('articles', function(table) {
    table.increments('article_id').primary();
    table.string('title');
    table.text('body').notNullable();
    table.integer('votes').defaultTo(0);
    table
      .string('topic')
      .references('topics.slug')
      .onDelete('CASCADE');
    table
      .string('author')
      .references('users.username')
      .onDelete('SET NULL');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('articles');
};
