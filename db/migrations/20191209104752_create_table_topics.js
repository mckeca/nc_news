exports.up = function (knex) {
  return knex.schema.createTable('topics', function (table) {
    table.string('slug').primary();
    table.text('description');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('topics');
};
