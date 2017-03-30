"use strict";
// Set up requirements
// const PORT = 3000;
const cookieSession = require('cookie-session');
const express = require('express');
const app = express();
const router  = express.Router();
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'butter',
  secret: 'fingers'
}));

// Set basic endpoints
//Home route
// app.get("/", (req, res) => {

//   res.render("index");
// });



// Knex queries - should be in app or here?
module.exports = (knex) => {

  router.get("/", (req, res) => {
    knex
      .select("*")
      .from("users")
      .then((results) => {
        res.json(results);
    });
  });

  return router;
}
