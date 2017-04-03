const search = require('./search');
const express = require('express');
const router  = express.Router();
// Required in server.js; Adds item to database using dataHelpers
module.exports = (DataHelpers) => {
// Takes input from app.js ajax request
  router.post('/search', (req, res) => {
    if (req.session.user_id){
      let user_id = req.session.user_id;
      let query = req.body.inputQuery;
      console.log(query);
      search.listQuery(query, (result) =>{
        console.log('[api.js] listQuery Result: ', result);
        DataHelpers.insertQueryToTable(user_id, result.cat_id, query, result.link, (item) => {
          console.log('[api.js] dataHelpers insertQueryToTable: ', item)
          res.status(201).send(item);
        });
      });
    } else {
      res.status(400).send('Bad Request');
    }
  });
// Passes user lists to app.js
  router.get('/lists', (req, res) => {
    if (req.session.user_id) {
      let id = req.session.user_id;
      DataHelpers.getListItemsByUser(id, (lists) => {
        res.status(201).send(lists);
      });
    } else {
      res.status(400).send('Bad Request');
    }
  });
// Deletes item in database from id passed by app.js
  router.delete('/delete/:item_id', (req, res) => {
    let item_id = req.params.item_id;
    DataHelpers.itemDelete(item_id, () => {
      res.status(204).send('Item deleted');
    });
  });
// Updates item category based on new id from app.js
  router.put('/update', (req, res) => {
    let item_id = req.body.item_id;
    let cat_id = req.body.cat_id;
    DataHelpers.updateCategory(item_id, cat_id, (err) => {
      if (err){
        res.status(500).send(err);
      } else {
        res.status(204).send('Item updated');
      }
    });
  });
  // Updates completed status based on id and status from app.js
  router.put('/complete', (req, res) => {
    let item_id = req.body.item_id;
    let complete = req.body.complete;
    DataHelpers.itemComplete(item_id, complete, (err) => {
      if (err){
        res.status(500).send(err);
      } else {
        res.status(204).send('Item updated');
      }
    });
  });
  return router;
}

