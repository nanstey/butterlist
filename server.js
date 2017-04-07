"use strict";
require('dotenv').config({silent: true});
// Express server setup
const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const app         = express();
const bodyParser  = require("body-parser");
const cookieSession = require("cookie-session");
const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const knexLogger  = require('knex-logger');
const morgan      = require('morgan');
const pg = require('pg');
const sass        = require("node-sass-middleware");

// In-house routes
const DataHelpers = require("./db/dataHelpers.js")(knex);
const routes = require("./routes/routes")(DataHelpers);
const api = require("./routes/api")(DataHelpers);

// Loggers
app.use(morgan('dev'));
app.use(knexLogger(knex));

// Mount resources
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession( {
  name: 'session',
  secret: 'mission'
}));

// Styles
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount routes
app.use("/", routes);
app.use("/api", api);

// Puts ear to ground...
app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});