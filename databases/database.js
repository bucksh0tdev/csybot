const mongoose = require("mongoose");

module.exports = async function (client) {
//console.log("Attempting to Connect to Database")
const conn = await mongoose.connect(process.env.mongodb, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).catch(err => process.exit(1));
  client.login(process.env.token).catch(err => process.exit(1));
  //console.log("Connected to the database");
  return true;
}