const Discord = require("discord.js");
const globalfun = require("../functions/global.js");
exports.run = async (client, channel) => {
const csybot = new globalfun(client, null);

let alltickets = await csybot.data("starts", "ticket", `user_${channel.guild.id}`);
  
for (var i = 0; i < alltickets.length; i++) {
  var data = alltickets[i];
  var parsed = JSON.parse(data.data);
  if(parsed.channel == channel.id) {
    await csybot.data("delete", "ticket", `${csybot.filter(data.dataname)}`);    
  }  
}

};

exports.help = {
  event: "channelDelete"
};