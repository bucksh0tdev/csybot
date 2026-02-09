const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let lastad = await csybot.data("fetch", "adshare", `adshare_${interaction.guild_id}`, null);
let getlang = await csybot.getlang();

  const error = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "Error")}**`,
    description: csybot.lang(getlang, "advertise_not_found"),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.red
  }
  

if(!lastad) return csybot.send({ embeds: [error] })

    const success = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
      description: "```" + csybot.filter(lastad) + "```",
      footer: {
        text: csybot.footer
      },
      color: csybot.config.blue
    }
  

return csybot.send({ embeds: [success] })



};

exports.help = {
  name: "advertise-show",
  description: "Shows the Last Ad",
  category: "moderation",
  permissions: {
    bot: [],
    user: ["MANAGE_MESSAGES"]
  }
};