"use strict";

const express = require('express');
const router  = express.Router();
const bcrypt  = require("bcrypt");

module.exports = function(DataHelpers) {
  //Home page
  router.get("/", (req, res) => {
    if (req.session.user_id){
      res.render("index");
    } else {
      res.redirect('/login')
    }
  });

  // Login page
  router.get("/login", (req, res) => {
    res.render("login");
  });

  // Login handler
  router.post("/login", (req, res) => {
    let password = req.body.password;
    let user = 'dave';
    let userHash = user ? user.password : '';
    if (!req.body.email || !req.body.password) {
      res.status(403).send("Butter use a valid email and password.");
    } else if (bcrypt.compareSync(password, userHash) == false) {
      res.status(403).send("Password or email unauthorized.");
    } else if (bcrypt.compareSync(password, userHash) == true) {
      req.session.user_id = loginReturn(req.body.email);
      req.session.user_email = req.body.email;
      res.redirect("/");
    }
  });

  // Hardwired login
  router.get("/login/:uid", (req, res) => {
    req.session.user_id = req.params.uid;
    res.redirect("/");
  });

  // Logout and delete cookies
  router.post("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
  });

  return router;
}
