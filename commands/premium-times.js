const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
let days = await csybot.premiumdays(interaction.guild_id);
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "premium_valid"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

if(!days || days == "0") return csybot.send({ embeds: [error] })

const info = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
  description: csybot.lang(getlang, "premium_expire", days),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.blue
}

csybot.send({ embeds: [info] });

};

exports.help = {
  name: "premium-times",
  description: "Shows Remaining Premium Days!",
  category: "premium",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
};