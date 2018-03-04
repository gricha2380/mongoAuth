const express = require('express');
const router = express.Router();
const User = require('../models/user')

// logout
router.get('/logout', (req,res, next)=> {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        return next(err)
      } else {
        return res.redirect('/')
      }
    })
  }
})

// login page
router.get('/login',(req, res, next)=>{
  return res.render('login', {title: 'Log In'})
})

router.post('/login', (req, res, next)=> {
  if (req.body.email && req.body.password) {
    User.authenticate(req.body.email, req.body.password, (error, user) => {
      if (error || !user) {
        let err = new Error('Wrong username or password');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/profile');
      }
    });
  } else {
    let err = new Error('You need email and password')
    err.status = 401;
    return next(err);
  }
})

// registration page
router.get('/register', (req, res, next) => {
  return res.render('register', { title:'Sign Up!'});
});

router.post('/register', (req, res, next) => {
  if (req.body.email && req.body.name && req.body.password && req.body.confirmPassword && req.body.favoriteBook) {
    // confirm passwords match
    let userData = {
      email: req.body.email,
      name: req.body.name,
      favoriteBook: req.body.favoriteBook,
      password: req.body.password
    }

    User.create(userData, (error, user) => {
      if (error) {
        return next(error)
      } else {
        req.session.userId = user._id;
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

// GET /profile
router.get('/profile', (req, res, next)=>{
  if (!req.session.userId) {
    let err = new Error("You are not authorized to view this page")
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
    .exec((error, user)=>{
      if (error) {
        return next(error);
      } else {
        return res.render('profile', {title: 'Profile', name: user.name, favorite: user.favoriteBook})
      }
    })
})

// GET /
router.get('/', (req, res, next) => {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', (req, res, next) => {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', (req, res, next) => {
  return res.render('contact', { title: 'Contact' });
});

module.exports = router;
