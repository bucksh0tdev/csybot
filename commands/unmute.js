const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "user_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const error2 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "channel_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}


let user = csybot.options("user");
let channel = csybot.options("channel");
  
if(!user || !user.id) return csybot.send({ embeds: [error] });
if(!channel || !channel.id) return csybot.send({ embeds: [error2] });

let guild = await csybot.guildget();
if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });

await channel.permissionOverwrites.create(user, { SEND_MESSAGES: undefined }).catch(err => err + "1");

let unmuteuser = csybot.filter(`${user.user.username}#${user.user.discriminator}`);
  
const success = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
  description: csybot.lang(getlang, "unmute_success", unmuteuser),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.green
}

return csybot.send({ embeds: [success] });


};

exports.help = {
  name: "unmute",
  description: "Unlock Spam Mute Members!",
  permissions: {
    bot: ["MANAGE_CHANNELS", "EMBED_LINKS"],
    user: ["MUTE_MEMBERS"]
  },
  category: "moderation",
  options: [{
    type: 6,
    name: "user",
    description: "Select User",
    required: true
  },
  {
    type: 7,
    name: "channel",
    description: "Select Channel",
    required: true
  }], 
};