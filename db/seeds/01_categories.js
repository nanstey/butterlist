
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('categories').del()
    .then(function () {
      return Promise.all([
        knex('categories').insert({id: 1, htmlId: 'movies', icon: 'fa-ticket', title: 'Movies/Tv', description:'Movies and Tv shows to watch'}),
        knex('categories').insert({id: 2, htmlId: 'music', icon: 'fa-music', title: 'Music', description:'Artists or Albums for listening'}),
        knex('categories').insert({id: 3, htmlId: 'books', icon: 'fa-book', title: 'Books', description:'Books to read'}),
        knex('categories').insert({id: 4, htmlId: 'restaurants', icon: 'fa-cutlery', title: 'Restaurants', description:'Places to eat'}),
        knex('categories').insert({id: 5, htmlId: 'products', icon: 'fa-shopping-bag', title: 'Products', description:'Things to buy'})
      ]);
    });
};
