exports.up = function(knex) {
  console.log('creating topics table');
  return knex.schema.createTable('topics', function(table) {
    table.string('slug').primary();
    table.text('description');
  });
};

exports.down = function(knex) {
  console.log('dropping topics table');
  return knex.schema.dropTable('topics');
};
