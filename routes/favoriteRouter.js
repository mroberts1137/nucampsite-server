const express = require('express');
const mongoose = require('mongoose');
const cors = require('./cors');
const authenticate = require('../authenticate');
const Favorite = require('../models/favorite');
const Campsite = require('../models/campsite');

const favoriteRouter = express.Router();

favoriteRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    // Find favorites document for user
    Favorite.find({ user: req.user._id })
      .populate('user')
      .populate('campsites')
      .then((favorite) => {
        res.statusCode = 200;
        res.json(favorite);
      });
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        // if user has favorites doc, add new campsites
        req.body.forEach((campsite) => {
          if (!favorite.campsites.includes(campsite._id)) {
            favorite.campsites.push(campsite._id);
          }
        });
        favorite.save((err) => {
          if (err) {
            res.statusCode = 500;
            res.json({ err: err });
            return;
          }
          res.statusCode = 200;
          res.json(favorite);
        });
      } else {
        // if user has no favorites doc, create one
        Favorite.create({ user: req.user._id }).then((favorite) => {
          req.body.forEach((campsite) => {
            favorite.campsites.push(campsite._id);
          });
          favorite.save((err) => {
            if (err) {
              res.statusCode = 500;
              res.json({ err: err });
              return;
            }
            res.statusCode = 200;
            res.json(favorite);
          });
        });
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`PUT operation is not supported on '/favorites'`);
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete({ user: req.user._id }).then((favorite) => {
      res.statusCode = 200;
      if (favorite) {
        res.json(favorite);
      } else {
        res.setHeader('Content-Type', 'text/plain');
        res.end(`User ${req.user._id} has no favorites to delete.`);
      }
    });
  });

favoriteRouter
  .route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end(
      `GET operation is not supported on '/favorites/${req.params.campsiteId}'`
    );
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    // check if url :campsiteId is a valid campsite id
    if (!mongoose.isValidObjectId(req.params.campsiteId)) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'text/plain');
      res.end(`There is no campsite ${req.params.campsiteId}!`);
      return;
    }
    Campsite.findOne({ _id: req.params.campsiteId }).then((campsite) => {
      if (!campsite) {
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`There is no campsite ${req.params.campsiteId}!`);
      } else {
        // the campsite was found in campsites collection
        Favorite.findOne({ user: req.user._id }).then((favorite) => {
          if (favorite) {
            // if user has favorites doc, add campsite if it's new
            if (!favorite.campsites.includes(req.params.campsiteId)) {
              favorite.campsites.push(req.params.campsiteId);
              favorite.save((err) => {
                if (err) {
                  res.statusCode = 500;
                  res.json({ err: err });
                  return;
                }
                res.statusCode = 200;
                res.json(favorite);
              });
            } else {
              res.setHeader('Content-Type', 'text/plain');
              res.end(
                `Campsite ${req.params.campsiteId} is already in the list of favorites!`
              );
            }
          } else {
            // if user has no favorites doc, create one
            Favorite.create({ user: req.user._id }).then((favorite) => {
              favorite.campsites.push(req.params.campsiteId);
              favorite.save((err) => {
                if (err) {
                  res.statusCode = 500;
                  res.json({ err: err });
                  return;
                }
                res.statusCode = 200;
                res.json(favorite);
              });
            });
          }
        });
      }
    });
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.setHeader('Content-Type', 'text/plain');
    res.end(
      `PUT operation is not supported on '/favorites/${req.params.campsiteId}'`
    );
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        // if user has favorites doc, delete specified campsite if it's in list
        if (favorite.campsites.includes(req.params.campsiteId)) {
          favorite.campsites = favorite.campsites.filter(
            (campsite) => !campsite.equals(req.params.campsiteId)
          );
          favorite.save((err) => {
            if (err) {
              res.statusCode = 500;
              res.json({ err: err });
              return;
            }
            res.statusCode = 200;
            res.json(favorite);
          });
        } else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'text/plain');
          res.end(
            `Campsite ${req.params.campsiteId} is not favorited by user ${req.user._id}.`
          );
        }
      } else {
        // if user has no favorites doc, end response
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`User ${req.user._id} has no favorites.`);
      }
    });
  });

module.exports = favoriteRouter;
