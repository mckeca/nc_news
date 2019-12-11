exports.up = function (knex) {
  return knex.schema.createTable('users', function (table) {
    table
      .string('username')
      .primary()
      .unique();
    table.string('avatar_url');
    table.string('name');
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable('users');
};
