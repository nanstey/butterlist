
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function (table) {
      table.string('email');
      table.string('password');
    }),
    knex.schema.createTable('categories', function (table) {
      table.increments();
      table.string('title');
      table.string('description');
    }),
    knex.schema.createTable('list_items', function (table) {
      table.increments();
      table.integer('user_id').unsigned();
      table.integer('cat_id').unsigned();
      table.string('name');
      table.string('link');
      table.foreign('user_id').references('users.id').onDelete('CASCADE');
      table.foreign('cat_id').references('categories.id').onDelete('CASCADE');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function (table) {
      table.dropColumn('email');
      table.dropColumn('password');
    }),
    knex.schema.dropTable('list_items'),
    knex.schema.dropTable('categories')
  ])
};
