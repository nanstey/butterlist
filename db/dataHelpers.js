"use strict";
const bcrypt  = require('bcrypt');

module.exports = function makeDataHelpers(knex) {

  let dh = {

    getUserById: function(id, cb) {
      knex.select('name', 'email').from('users')
        .where('id', '=', id)
        .then((row) => {
          cb( row );
        });
    },

    // Get user from a given email
    // Returns 'user' obj if email exists, returns null otherwise
    getUserByEmail: function(email, cb) {
      // console.log('[dataHelpers.js] getUserByEmail()');
      knex.select().from('users')
        .where('email', '=', email)
        .limit(1)
        .then((rows) => {
          // console.log('[dataHelpers.js] getUserByEmail() ROWS:', rows);
          const user = rows[0];
          if(!user) {
            cb(null)
            //return Promise.reject();
          }
          cb(user);
        })
        .catch((err) => {
        });
    },

    // Validates a given email and password
    // Returns user.id if valid, returns null otherwise
    validateEmailPassword: function(email, pswd, cb) {
      // console.log('[dataHelpers.js] validateEmailPassword()');
      dh.getUserByEmail(email, (user) => {
        if (user === null){
          console.log('[dataHelpers.js] validateEmailPassword() USER null');
          cb(null);
        }
        bcrypt.compare(pswd, user.password, (err, match) => {
          if (match){
            cb(user.id);
          } else {
            cb(null);
          }
        });
      });
    },

    // Inserts a new user into the database
    // Returns user.id if successfull, return null otherwise
    insertNewUser: function(name, email, password, cb) {
      dh.getUserByEmail(email, (user) => {
        if (user){
          cb(null);
        } else {
          bcrypt.hash(password, 10, (err, hash) => {
            if (err){
              cb(null);
            } else {
              let user = {
                'name': name,
                'email': email,
                'password': hash
              };
              knex('users')
                .insert(user, 'id')
                .then( (data) => {
                  let id = data[0];
                  cb(id);
                })
                .catch( (err) => {
                  cb(null);
                });
            }
          });
        }
      });
    },

    // Gets categories from database and returns in JSON format
    // Each category obj has extra 'list_item' obj for storing items of that category
    getCategoriesJSON: function(cb) {
      let obj = {};
      knex.select().from('categories')
        .then( (rows) => {

          for (let i = 0; i < rows.length; i++){
            let id = rows[i].id;
            obj[id] = {
              'id': rows[i].id,
              'htmlId': rows[i].htmlId,
              'icon':  rows[i].icon,
              'title': rows[i].title,
              'description': rows[i].description,
              'list_items': {}
            }
          }
          // console.log(obj);
          cb(obj);
        });
    },

    // Sorts given list items by category
    // Appends each item into 'list_items' field corresponding category obj
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
        // console.log( JSON.stringify(obj) );
        cb(obj);
      });
    },

    // Gets all list items owned by a user
    getListItemsByUser: function(user_id, cb) {
      knex.select().from('list_items')
        .where('user_id', '=', user_id)
        .then( (rows) => {
          // console.log(rows);
          dh.sortListItemsByCategoryJSON(rows, cb);
        });
    },

    // Inserts new item into db
    // Given user_id, cat_id, name, link returns item obj
    insertItem: function(user_id, cat_id, name, link, cb) {
      // console.log('[dataHelpers.js] insertQueryToTable()')
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
    },

    // Updates a list item
    // Given item_id and vals obj returns null if successfull
    updateItem: function(item_id, vals, cb) {
      knex('list_items')
        .where('id', '=', item_id)
        .update(vals)
        .then( () => {
          cb(null);
        })
        .catch( (err) => {
          cb(err);
        });
    },

    // Deletes a list item
    deleteItem: function(item_id, cb) {
      knex('list_items')
        .where('id', '=', item_id)
        .del()
        .then( () => {
          cb(null);
        })
        .catch( (err) => {
          cb(err);
        })
    }

  }; //end of dh
  return dh;
};