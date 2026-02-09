const Discord = require("discord.js");
const globalfun = require("../functions/global.js");
const AntiSpam = require("../functions/spam.js");
exports.run = async (client, reaction, user) => {
const csybot = new globalfun(client, null);

//if(reaction._emoji.name != "🎉") return;
let getcontrol = await csybot.data("fetch", "reactionrole", `react_${reaction.message.guildId}_${reaction.message.id}`, null);
if(!getcontrol) return;

let getcontrolparsed = JSON.parse(getcontrol);

let guild = await client.guilds.cache.get(reaction.message.guildId);
if(!guild) return;
let role = await guild.roles.cache.get(getcontrolparsed.role);
if(!role) return;
let member = await guild.members.cache.get(user.id);
if(!member || user.bot) return;
  
await member.roles.remove(role.id).catch(err => err + "1");
  
};

exports.help = {
  event: "messageReactionRemove"
};