const search = require("/search");
const express = require('express');
const router  = express.Router();


module.exports = (DataHelpers) => {
  router.post("/search", (req, res) => {
    if (req.session.user_id){
      let id = req.session.user_id;
      let query = req.body.inputQuery;
      let result = search.listQuery(query);
      DataHelpers(id, result.cat_id, query, result.link, (item) => {
        res.status(201).send(item);
      })
    } else {
      res.status(400).send('Bad Request');
    }
  });

  router.get("/lists", (req, res) => {
    if (req.session.user_id) {

    } else {

    }
  });

  return router;
}

