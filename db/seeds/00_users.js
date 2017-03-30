
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({id: 1, name: 'Alice', email:'alice@example.com', password:'wurstPassEvar'}),
        knex('users').insert({id: 2, name: 'Bob', email:'bob@example.com', password:'wurstPassEvar'}),
        knex('users').insert({id: 3, name: 'Charlie', email:'charlie@example.com', password:'wurstPassEvar'}),
      ]);
    });
};
