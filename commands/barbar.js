const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
var adprotect = await csybot.data("fetch", "adprotect", `adprotect_${interaction.guild_id}`, null);
let getlang = await csybot.getlang();
  
const barbar = {
  title: `**${client.user.username} | My Friend**`,
  description: "<@542255512591532032> :heart: <@811687410353307759> ∞ My Friend!",
  footer: {
    text: csybot.footer
  },
  color: csybot.config.green
}

csybot.send({ embeds: [barbar] })

};

exports.help = {
  name: "barbar",
  description: "barbar <3 bucksh0t",
  category: "utilty",
  permissions: {
    bot: ["MANAGE_MESSAGES"],
    user: ["MANAGE_MESSAGES"]
  }
};