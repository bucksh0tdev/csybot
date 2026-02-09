const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  dataname: { type: String, required: true },
  timestramp: { type: String, required: true },
  count: { type: String, required: true }
});

module.exports = mongoose.model('votes', MessageSchema);