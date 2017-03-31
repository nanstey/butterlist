const search = require("./search");
const express = require('express');
const router  = express.Router();


module.exports = (DataHelpers) => {
  router.post("/search", (req, res) => {
    if (req.session.user_id){
      let id = req.session.user_id;
      let query = req.body.inputQuery;
      search.listQuery(query, (result) =>{
        DataHelpers(id, result.cat_id, query, result.link, (item) => {
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

