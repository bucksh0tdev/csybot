const Discord = require("discord.js");
const globalfun = require("../functions/global.js");
const AntiSpam = require("../functions/spam.js");
exports.run = async (client, message) => {
const csybot = new globalfun(client, message);

  if (!message || !message.content || !message.guild || !message.author || message.author.bot) return;

var spamprotect = await csybot.data("fetch", "spam", `spamprotect_${message.guild.id}`, null);
if(!spamprotect) return;
let getlang = await csybot.getlang();
  try {     
    if (message.member.permissions.has(Discord.Permissions.FLAGS.BAN_MEMBERS)) return;
    AntiSpam(client, message, getlang)
  } catch (err) {
    err + "1";
  }
  
};

exports.help = {
  event: "messageCreate"
};