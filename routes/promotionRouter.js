const express = require('express');
const promotionRouter = express.Router();

const Promotion = require('../models/promotion');

// Route 1: localhost:3000/promotions

promotionRouter
  .route('/')
  .get((req, res, next) => {
    Promotion.find()
      .then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions);
      })
      .catch((err) => next(err));
  })
  .post((req, res, next) => {
    Promotion.create(req.body)
      .then((promotion) => {
        console.log(`Partner Created: ${promotion}`);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
      })
      .catch((err) => next(err));
  })
  .put((req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end('PUT operation not supported on /promotions');
  })
  .delete((req, res, next) => {
    Promotion.deleteMany()
      .then((result) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
      })
      .catch((err) => next(err));
  });

// Route 1: localhost:3000/promotions/fds67f6ds79af9dsa

promotionRouter
  .route('/:promotionId')
  .get((req, res, next) => {
    Promotion.findById(req.params.promotionId)
      .then((promotion) => {
        if (promotion) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promotion);
        } else {
          err = new Error(`Promotion ${req.params.promotionId} not Found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .post((req, res) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end(
      `POST operation is not supported on /partners/${req.params.promotionId}`
    );
  })
  .put((req, res, next) => {
    Promotion.findByIdAndUpdate(
      req.params.promotionId,
      {
        $set: req.body
      },
      { new: true, runValidators: true }
    )
      .then((promotion) => {
        if (promotion) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(promotion);
        } else {
          err = new Error(`Promotion ${req.params.promotionId} not Found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  })
  .delete((req, res, next) => {
    Promotion.findByIdAndDelete(req.params.promotionId)
      .then((result) => {
        if (result) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(result);
        } else {
          err = new Error(`Promotion ${req.params.promotionId} not Found`);
          err.status = 404;
          return next(err);
        }
      })
      .catch((err) => next(err));
  });

module.exports = promotionRouter;
