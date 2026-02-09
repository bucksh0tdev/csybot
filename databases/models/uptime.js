const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  link: { type: String, required: true },
  owner: { type: String, required: true}
});

module.exports = mongoose.model('uptime', MessageSchema);