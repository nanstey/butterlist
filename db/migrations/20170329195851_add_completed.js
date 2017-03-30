
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('list_items', function (table) {
      table.boolean('completed');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('list_items', function (table) {
      table.dropColumn('completed');
    })
  ]);
};
