'use strict';
require('dotenv').config;
const ENV     = process.env.ENV || 'development';

const bcrypt  = require('bcrypt');
const express = require('express');
const router  = express.Router();
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const knexConfig  = require('../knexfile');
const knex        = require('knex')(knexConfig[ENV]);
const flash       = require('connect-flash');

router.use(bodyParser.urlencoded({extended: true}));

//Cookie Business
router.use(cookieSession({
  name: 'session',
  secret: 'secret'
}));

router.use(flash());

module.exports = function(DataHelpers) {

  //Home page
  router.get('/', (req, res) => {
    console.log('[routes.js] GET / ');
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
    // console.log('REQ',req.body);
    // if(!req.body.email || !req.body.password) {
    //   res.redirect('/login');
    //   // res.status(400).redirect('https://http.cat/400');
    //   return;
    // }
    // const findRequestedEmail = knex('users')
    //   .select(1)
    //   .where({email: req.body.email});
    // findRequestedEmail.then((rows) => {
    //   if(rows.length) {
    //     return Promise.reject({
    //       type: 409,
    //       message: 'email has already been used.'
    //     });
    //   }
    //  return bcrypt.hash(req.body.password, 10);
    // }).then((passwordResponse) => {
    //   return knex('users').insert({
    //     name: req.body.name,
    //     email: req.body.email,
    //     password: passwordResponse
    //   }, 'id');
    // }).then((user_id) => {
    //   // req.flash('info', 'account successfully created');
    //   req.session.user_id = user_id[0];
    //   res.redirect('/');
    // }).catch((err) => {
    //   // req.flash('errors', err.message);
    //   res.redirect('/');
    // });
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

  //   console.log(req.body.password);
  //   const findUserByEmail = knex('users')
  //     .select('id', 'password')
  //     .where({email: req.body.email})
  //     .limit(1);
  //   findUserByEmail.then((rows) => {
  //     const user = rows[0];
  //     if(!user) {
  //       return Promise.reject({
  //         type: 409,
  //         message: 'Bad credentials.'
  //       });
  //     }
  //     const comparePasswords = bcrypt.compare(req.body.password, user.password);
  //     return comparePasswords.then((passwordsMatch) => {
  //       if(!passwordsMatch) {
  //         return Promise.reject({
  //           type: 409,
  //           message: 'no'
  //         });
  //       }
  //       return Promise.resolve(user);
  //     });
  //   }).then((user) => {
  //     req.session.user_id = user.id;
  //     res.redirect('/');
  //   }).catch((err) => {
  //     req.flash('errors', err.message);
  //     res.redirect('/');
  //   });
  // });

  // Login page
  router.get('/login', (req, res) => {
    (req.session.user_id) ? res.redirect('/') : res.render('login');
  });

  // Hardwired login
  router.get('/login/:uid', (req, res) => {
    req.session.user_id = req.params.uid;
    res.redirect('/');
  });

  // Logout and delete cookies
  router.post('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });

  return router;
}
