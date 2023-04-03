const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  img: {
    type: String
  },
  price: {
    type: Number,
    min: 0,
    required: true
  },
  qty: {
    type: Number,
    min: 0,
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);
