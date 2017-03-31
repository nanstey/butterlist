"use strict";


module.exports = function makeDataHelpers(knex) {
  let dh = {
    getUserById: function(id, cb) {
      knex.select('name', 'email').from('users')
        .where('id', '=', id)
        .then((row) => {
          cb( row );
        });
    },

    getCategoriesJSON: function(cb) {
      let obj = {};
      knex.select().from('categories')
        .then( (rows) => {

          for (let i = 0; i < rows.length; i++){
            let id = rows[i].id;
            obj[id] = {
              'id': rows[i].id,
              'title': rows[i].title,
              'description': rows[i].description,
              'list_items': {}
            }
          }
          // console.log(obj);
          cb(obj);
        });
    },

    sortListItemsByCategoryJSON: function(rows, cb) {
      dh.getCategoriesJSON( (obj) => {
        // console.log(rows);
        for (let i = 0; i < rows.length; i++){
          let id = rows[i].id;
          let cat_id = rows[i].cat_id;
          obj[cat_id].list_items[id] = {
            'id': id,
            'user_id': rows[i].user_id,
            'cat_id': cat_id,
            'name': rows[i].name,
            'link': rows[i].link,
            'completed': rows[i].completed
          }
        }
        console.log( JSON.stringify(obj) );
        cb(obj);
      });
    },

    getListItemsByUser: function(user_id, cb) {
      knex.select().from('list_items')
        .where('user_id', '=', user_id)
        .then( (rows) => {
          // console.log(rows);
          dh.sortListItemsByCategoryJSON(rows, cb);
        });
    },

    insertQueryToTable: function(user_id, cat_id, name, link, cb) {
      console.log('[dataHelpers.js] insertQueryToTable()')
      let item = {
        'user_id': user_id,
        'cat_id': cat_id,
        'completed': 0,
        'name': name,
        'link': link
      };
      knex('list_items')
        .insert(item, 'id')
        .then( (data) => {
          // console.log('[dataHelpers.js] insertQueryToTable():', data)
          item['id'] = data[0]
          cb(item);
        })
        .catch( (err) =>{
          console.log(err);
        });
      }

  }; //end of dh
  return dh;
};