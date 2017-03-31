const search = require("/search");
const express = require('express');
const router  = express.Router();


module.exports = () => {
  router.post("/search", (req, res) => {
    let userSearch = search.listQuery(data);

  });

  return router;
}

//This
