const mongoose = require('mongoose');
const User = require('./user');
const Campsite = require('./campsite');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  campsites: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Campsite'
    }
  ]
});

module.exports = mongoose.model('Favorite', favoriteSchema);
