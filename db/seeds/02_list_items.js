
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('list_items').del()
    .then(function () {
      return Promise.all([
        knex('list_items').insert({id: 1, user_id: 1, cat_id: 1, name: 'Rick and Morty', link:'http://www.imdb.com/title/tt2861424/?ref_=fn_al_tt_1' }),
        knex('list_items').insert({id: 2, user_id: 1, cat_id: 2, name: 'A Brief History of Time', link:'https://books.google.ca/books?id=A9nWaIpeXhkC&q=a+brief+history+of+time&dq=a+brief+history+of+time&hl=en&sa=X&redir_esc=y' }),
        knex('list_items').insert({id: 3, user_id: 1, cat_id: 3, name: 'Discovery Coffee', link:'https://www.yelp.ca/search?find_desc=discovery+coffee&find_loc=Victoria%2C+BC&ns=1' }),
        knex('list_items').insert({id: 4, user_id: 1, cat_id: 4, name: 'Salt Lamp', link:'https://www.amazon.com/s/ref=nb_sb_noss/157-0355677-5375407?url=search-alias%3Daps&field-keywords=salt+lamp' }),
        knex('list_items').insert({id: 5, user_id: 1, cat_id: 5, name: 'RX Bandits', link:'https://www.discogs.com/artist/295301-RX-Bandits' })
      ]);
    });
};
