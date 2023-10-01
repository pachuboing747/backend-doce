const { Schema, model } = require('mongoose')

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'users' },
  code: String,
  total: Number,
  products: { 
    type: [{
      product: { type: Schema.Types.ObjectId, ref: 'products' },
      qty: { type: Number, default: 0 }
    }],
    default: []
  },
  purchaseDate: { type: Number, default: Date.now()}
})

const Purchase = model('orders', schema);

module.exports = Purchase ;
