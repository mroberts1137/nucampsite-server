const mongoose = require('mongoose');

const promotionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    image: {
      type: String,
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    },
    cost: {
      type: Number,
      required: true,
      min: 0
    },
    description: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Promotion', promotionSchema);
