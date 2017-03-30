
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        knex('categories').insert({id: 1, title: 'Movies/Tv', description:'Movies and Tv shows to watch'}),
        knex('categories').insert({id: 2, title: 'Books', description:'Books to read'}),
        knex('categories').insert({id: 3, title: 'Restaurants', description:'Places to eat'}),
        knex('categories').insert({id: 4, title: 'Products', description:'Things to buy'}),
        knex('categories').insert({id: 5, title: 'Music', description:'Artists or Albums for listening'})
      ]);
    });
};
