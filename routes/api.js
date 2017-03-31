const search = require("/search");
const express = require('express');
const router  = express.Router();


module.exports = (DataHelpers) => {
  router.post("/search", (req, res) => {
    let userSearch = search.listQuery(data);

  });

  router.get("/lists", (req, res) => {
    if (req.session.user_id) {

    } else {

    }
  });

  return router;
}

//This
