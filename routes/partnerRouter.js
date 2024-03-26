const express = require('express');
const partnerRouter = express.Router();
const authenticate = require('../authenticate');

const Partner = require('../models/partner');

// Route 1: localhost:3000/partners

partnerRouter
  .route('/')
  .get((req, res, next) => {
    Partner.find()
      .then((partners) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partners);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partner.create(req.body)
      .then((partner) => {
        console.log(`Partner Created: ${partner}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(partner);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('PUT operation not supported on /partners');
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.deleteMany()
        .then((result) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(result);
        })
        .catch((err) => next(err));
    }
  );

// Route 2: localhost:3000/partners/h89fs9h43h8j89f4

partnerRouter
  .route('/:partnerId')
  .get((req, res, next) => {
    Partner.findById(req.params.partnerId)
      .then((partner) => {
        if (partner) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(partner);
        } else {
          err = new Error(`Partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end(
      `POST operation is not supported on /partners/${req.params.partnerId}`
    );
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Partner.findByIdAndUpdate(
      req.params.partnerId,
      {
        $set: req.body
      },
      { new: true }
    )
      .then((partner) => {
        if (partner) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(partner);
        } else {
          err = new Error(`Partner ${req.params.partnerId} not found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Partner.findByIdAndDelete(req.params.partnerId)
        .then((result) => {
          if (result) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(result);
          } else {
            err = new Error(`Partner ${req.params.partnerId} not found`);
            err.status = 404;
            return next(err);
          }
        })
        .catch((err) => next(err));
    }
  );

module.exports = partnerRouter;
