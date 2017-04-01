const search = require("./search");
const express = require('express');
const router  = express.Router();


module.exports = (DataHelpers) => {
  router.post("/search", (req, res) => {
    if (req.session.user_id){
      let user_id = req.session.user_id;
      let query = req.body.inputQuery;
      // console.log(query);
      search.dummyQuery(query, (result) =>{
        // console.log('[api.js] listQuery Result: ', result);
        DataHelpers.insertQueryToTable(user_id, result.cat_id, query, result.link, (item) => {
          // console.log('[api.js] dataHelpers insertQueryToTable: ', item)
          res.status(201).send(item);
        });
      });
    } else {
      res.status(400).send('Bad Request');
    }
  });

  router.get("/lists", (req, res) => {
    if (req.session.user_id) {
      // console.log('inside /api/lists')
      let id = req.session.user_id;
      DataHelpers.getListItemsByUser(id, (lists) => {
        // console.log('GET /api/lists:', lists);
        res.status(201).send(lists);
      });
    } else {
      res.status(400).send('Bad Request');
    }
  });

  return router;
}

