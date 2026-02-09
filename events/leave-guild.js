const Discord = require("discord.js");
const globalfun = require("../functions/global.js");
exports.run = async (client, guild) => {
const csybot = new globalfun(client, null);

await csybot.data("delete", "swearprotect", `swearprotect_${guild.id}`, null);
await csybot.data("delete", "swearshare", `swearshare_${guild.id}`, null);
  
await csybot.data("delete", "adprotect", `adprotect_${guild.id}`, null);
await csybot.data("delete", "adshare", `adshare_${guild.id}`, null);
  
await csybot.data("delete", "autorole", `autorole_${guild.id}`, null)
  
await csybot.data("delete", "brain", `brain_${guild.id}`, null)

await csybot.data("delete", "premium", `premium_${guild.id}`, null)
await csybot.data("delete", "webprotect", `webprotect_${guild.id}`, null)
  
let reactionmodel = require(`../databases/models/reactionrole.js`);
const cursor = reactionmodel.find().cursor();
for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  let guildid = doc.dataname.split("_")[1];
  if(guildid != guild.id) return;
  let messageid = doc.dataname.split("_")[2];
  await csybot.data("delete", "reactionrole", `react_${guild.id}_${messageid}`, null);
}
  
await csybot.data("delete", "security", `security_${guild.id}`, null);
await csybot.data("delete", "ultraprotect", `ultraprotect_${guild.id}`, null);
await csybot.data("delete", "spam", `spamprotect_${guild.id}`, null);

  
};

exports.help = {
  event: "guildDelete"
};