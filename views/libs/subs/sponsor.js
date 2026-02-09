const global = require("../../../functions/global.js");
module.exports = function(client, realapp, app, panel) {
const csybot = new global(client, null);
  
app.all("/", (req, res) => {
  res.redirect(csybot.config.sponsored.url);
});
  
}