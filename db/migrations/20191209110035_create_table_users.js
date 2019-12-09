exports.up = function(knex) {
  console.log('creating users table');
  return knex.schema.createTable('users', function(table) {
    table
      .string('username')
      .primary()
      .unique();
    table.string('avatar_url');
    table.string('name');
  });
};

exports.down = function(knex) {
  console.log('dropping users table');
  return knex.schema.dropTable('users');
};
