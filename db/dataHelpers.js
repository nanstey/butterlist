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
    // Returns 'user' obj if email exists, returns undefined otherwise
    getUserByEmail: function(email, cb) {
      console.log('[dataHelpers.js] getUserByEmail()');
      knex.select().from('users')
        .where('email', '=', email)
        .limit(1)
        .then((rows) => {
          console.log('[dataHelpers.js] getUserByEmail() ROWS:', rows);
          const user = rows[0];
          if(!user) {
            cb(undefined)
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
      console.log('[dataHelpers.js] validateEmailPassword()');
      dh.getUserByEmail(email, (user) => {
        if (user === undefined){
          console.log('[dataHelpers.js] validateEmailPassword() USER UNDEFINED');
          cb(undefined);
        }
        bcrypt.compare(pswd, user.password, (err, success) => {
          if (success){
            cb(user.id);
          } else {
            cb(undefined);
          }
        });
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

    getListItemsByUser: function(user_id, cb) {
      knex.select().from('list_items')
        .where('user_id', '=', user_id)
        .then( (rows) => {
          // console.log(rows);
          dh.sortListItemsByCategoryJSON(rows, cb);
        });
    },

    insertQueryToTable: function(user_id, cat_id, name, link, cb) {
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

    itemDelete: function(item_id, cb) {
      knex('list_items')
        .where('id', '=', item_id)
        .del()
        .then( () => {
          cb(null);
        })
        .catch( (err) => {
          cb(err);
        })
    },

    updateCategory: function(item_id, cat_id, cb) {
      knex('list_items')
        .where('id', '=', item_id)
        .update({
          'cat_id': cat_id
        })
        .then( () => {
          cb(null);
        })
        .catch( (err) => {
          cb(err);
        })
    },

    itemComplete: function(item_id, complete, cb) {
      knex('list_items')
        .where('id', '=', item_id)
        .update({
          'completed': complete
        })
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