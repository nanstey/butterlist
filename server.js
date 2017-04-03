"use strict";
require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const app         = express();
const bodyParser  = require("body-parser");
const cookieSession = require("cookie-session");
const knexConfig  = require("./knexfile");
const knex        = require("knex")({
   client: 'pg',
   connection: process.env.DATABASE_URL + '?ssl=true',
   searchPath: 'knex,public',
   });
const knexLogger  = require('knex-logger');
const morgan      = require('morgan');
const pg = require('pg');
const sass        = require("node-sass-middleware");

// pg.defaults.ssl = true;
// pg.connect(process.env.DATABASE_URL, function(err, client) {
//   if (err) throw err;
//   console.log('Connected to postgres! Getting schemas...');

//   client
//     .query('SELECT table_schema,table_name FROM information_schema.tables;')
//     .on('row', function(row) {
//       console.log(JSON.stringify(row));
//     });
// });


const DataHelpers = require("./db/dataHelpers.js")(knex);
const routes = require("./routes/routes")(DataHelpers);
const api = require("./routes/api")(DataHelpers);

app.use(morgan('dev'));
app.use(knexLogger(knex));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession( {
  name: 'session',
  secret: 'mission'
}));

app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

app.use("/", routes);
app.use("/api", api);

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
