const express = require('express');
const userRouter = express.Router();
const passport = require('passport');
const authenticate = require('../authenticate');

const User = require('../models/user');

userRouter.get(
  '/',
  authenticate.verifyUser,
  authenticate.verifyAdmin,
  (req, res, next) => {
    if (req.user && req.user.admin) {
      User.find()
        .then((users) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(users);
        })
        .catch((err) => next(err));
    } else {
      const err = new Error('You are not authorized!');
      err.status = 401;
      return next(err);
    }
  }
);

userRouter.post('/signup', (req, res) => {
  User.register(
    new User({ username: req.body.username }),
    req.body.password,
    (err, user) => {
      if (err) {
        req.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      } else {
        if (req.body.firstname) {
          user.firstname = req.body.firstname;
        }
        if (req.body.lastname) {
          user.lastname = req.body.lastname;
        }
        user.save((err) => {
          if (err) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.json({ err: err });
            return;
          }
          passport.authenticate('local')(req, res, () => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json({ success: true, status: 'Registration Successful!' });
          });
        });
      }
    }
  );
});

userRouter.post('/login', passport.authenticate('local'), (req, res) => {
  const token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({
    success: true,
    token: token,
    status: 'You are successfully logged in!'
  });
});

// userRouter.get('/logout', (req, res, next) => {
//   if (req.session) {
//     req.session.destroy();
//     res.clearCookie('session-id');
//     res.redirect('/');
//   } else {
//     const err = new Error('You are not logged in!');
//     err.status = 401;
//     return next(err);
//   }
// });

module.exports = userRouter;
