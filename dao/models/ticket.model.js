const { Schema, model } = require('mongoose')

const schema = new Schema({
  code: { type: String, unique: true, required: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: Number,
  purchaser: String,
});

const Ticket = model('ticket', schema);

module.exports = Ticket;
