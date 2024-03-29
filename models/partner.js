const mongoose = require('mongoose');

const partnerSchema = mongoose.Schema(
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
    description: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Partner', partnerSchema);
