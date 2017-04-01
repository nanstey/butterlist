
exports.up = function(knex, Promise) {
  return knex.schema.table('categories', function (table) {
    table.string('icon');
    table.string('htmlId');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.table('categories', function (table) {
    table.dropColumn('icon');
    table.dropColumn('htmlId');
  });
};
