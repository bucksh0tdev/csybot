const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  dataname: { type: String, required: true },
  data: { type: String, required: true}
});

module.exports = mongoose.model('bot', MessageSchema);