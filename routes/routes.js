'use strict';
require('dotenv').config;
const ENV     = process.env.ENV || 'development';

const express = require('express');
const router  = express.Router();
const flash   = require('connect-flash');

router.use(flash());

module.exports = function(DataHelpers) {

  //Home page
  router.get('/', (req, res) => {
    if (req.session.user_id){
      DataHelpers.getUserById(req.session.user_id, (row) => {
        let templateVars = {
          'user': {
            'name': row[0].name,
            'email': row[0].email
          }
        };
        res.render('index', templateVars);
      });
    } else {
      res.redirect('/login')
    }
  });

  //Registering
  router.post('/register', (req, res) => {
    if (req.session.user_id){
      res.status(400).send('Already logged in');
    } else {
      if(!req.body.name || !req.body.email || !req.body.password) {
        res.redirect('/login');
        // res.status(400).redirect('https://http.cat/400');
        return;
      } else {
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        DataHelpers.insertNewUser(name, email, password, (id) => {
          if (!id){
            res.status(400).send('Field left blank');
          } else {
            req.session.user_id = id;
            res.redirect('/');
          }
        });
      }
    }
  });

  // Login handler POST
  router.post('/login', (req, res) => {
    if (req.session.user_id){
      res.redirect('/');
    } else {
      DataHelpers.validateEmailPassword(req.body.email, req.body.password, (id) => {
        console.log('POST /login || user_id =', id);
        id ? req.session.user_id = id : req.flash('errors', 'Bad credentials');
        res.redirect('/');
      });
    }
  });

  // Login page
  router.get('/login', (req, res) => {
    (req.session.user_id) ? res.redirect('/') : res.render('login');
  });

  // Hardwired login
  // router.get('/login/:uid', (req, res) => {
  //   req.session.user_id = req.params.uid;
  //   res.redirect('/');
  // });

  // Logout and delete cookies
  router.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });

  return router;
}
