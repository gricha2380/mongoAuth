const express = require('express');
const router = express.Router();
const User = require('../models/user')

// registration page
router.get('/register', function(req, res, next) {
  return res.render('register', { title:'Sign Up!'});
});

router.post('/register', function(req, res, next) {
  if (req.body.email && req.body.name && req.body.password && req.body.confirmPassword && req.body.favoriteBook) {
    // confirm passwords match
    let userData = {
      email: req.body.email,
      name: req.body.name,
      favoriteBook: req.body.favoriteBook,
      password: req.body.password
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error)
      } else {
        return res.redirect('/profile')
      }
    })

    if (req.body.password !== req.body.confirmPassword) {
      let err = new Error('Passwords do not match')
      err.status=400;
      return next(err)  
    }
    return 
  } else {
    let err = new Error('All fields are required')
    err.status=400;
    return next(err)
  }
});

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
