"use strict";


module.exports = function makeDataHelpers(knex) {
  return {
    getUserById: function(id) {
      knex.select().from('users')
        .where('id', '=', id)
        .then((row) => {
          return row;
        });
    }

  };
};