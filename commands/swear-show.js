const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
let lastswear = await csybot.data("fetch", "swearshare", `swearshare_${interaction.guild_id}`, null);
  
    const error = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "swear_not_found"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }

if(!lastswear) return csybot.send({ embeds: [error] })

    const success = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
      description: "```" + csybot.filter(lastswear) + "```",
      footer: {
        text: csybot.footer
      },
      color: csybot.config.blue
    }

return csybot.send({ embeds: [success] })



};

exports.help = {
  name: "swear-show",
  description: "Shows the Last Swear",
  category: "moderation",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: ["MANAGE_MESSAGES"]
  }
};