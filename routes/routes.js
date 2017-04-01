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
    console.log('REQ',req.body);
    if(!req.body.email || !req.body.password) {
      req.flash('errors', 'email and password are required');
      res.redirect('/login');
      // res.status(400).redirect('https://http.cat/400');
      return;
    }
    const findRequestedEmail = knex('users')
      .select(1)
      .where({email: req.body.email});
    findRequestedEmail.then((rows) => {
      console.log("I GOT TO FIND findRequestedEmail");
      if(rows.length) {
        console.log("I AM NOW REJECTING YOU");
        return Promise.reject({
          type: 409,
          message: 'email has already been used.'
        });
      }
     return bcrypt.hash(req.body.password, 10);
    }).then((passwordResponse) => {
      console.log("FUCK YOU I WONT EVEN GET HERE");
      return knex('users').insert({
        name: req.body.name,
        email: req.body.email,
        password: passwordResponse
      }, 'id');
    }).then((user_id) => {
      console.log("NICE TRY");
      // req.flash('info', 'account successfully created');
      req.session.user_id = user_id[0];
      res.redirect('/');
    }).catch((err) => {
      // req.flash('errors', err.message);
      res.redirect('/');
    });
  });




  // Login page
  router.get('/login', (req, res) => {
    let templateVars = {
      user: req.session.user_id
    };
    // if (req.session.user_id) {
    //   res.redirect('/');
    // } else {
      res.render('login', templateVars);
  });

  // Login handler
  router.post('/login', (req, res) => {
    let password = req.body.password;
    let user = 'dave'; //req.body.username;
    let userHash = user ? user.password : '';
    if (!req.body.email || !req.body.password) {
      res.status(403).send('Butter use a valid email and password.');
    } else if (bcrypt.compareSync(password, userHash) == false) {
      res.status(403).send('Password or email unauthorized.');
    } else if (bcrypt.compareSync(password, userHash) == true) {
      req.session.user_id = loginReturn(req.body.email);
      req.session.user_email = req.body.email;
      res.redirect('/');
    }
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
