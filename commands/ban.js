const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "user_valid"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
const noperm = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "perm_valid"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  

let user = csybot.options("user");
if(!user || !user.id) return csybot.send({ embeds: [error] });

let guild = await csybot.guildget();
if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });
if(!user || !user.id) return csybot.send({ embeds: [error] });
if(user.user.id == client.user.id || user.user.id == csybot.config.ownerid) return csybot.send({ embeds: [noperm] });
await guild.members.ban(user.user.id).catch(err => {
  return csybot.send({ embeds: [noperm] });
});

let banneduser = csybot.filter(`${user.user.username}#${user.user.discriminator}`);

const success = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
  description: csybot.lang(getlang, "ban_success", banneduser),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.green
}
  

return csybot.send({ embeds: [success] });


};

exports.help = {
  name: "ban",
  description: "You Can Ban User!",
  permissions: {
    bot: ["BAN_MEMBERS"],
    user: ["BAN_MEMBERS"]
  },
  options: [{
			type: 6,
      name: "user",
      description: "Select User",
      required: true
		}],
  category: "moderation"  
};