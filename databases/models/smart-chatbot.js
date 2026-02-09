const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  key: { type: String, required: true},
  owner: { type: String, required: true},
  banned: { type: Boolean, required: false},
  banreason: { type: String, required: false},
  ipchange: { type: Number, required: false},
  lastip: { type: String, required: false},
  ratelimit: { type: Number, required: false}
});

module.exports = mongoose.model('smart-chatbot', MessageSchema);