const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
var premiumhas = "";

var premiumif = await csybot.data("fetch", "premium", `premium_${interaction.guild_id}`, null);
if(premiumif) {
    premiumhas = csybot.lang(getlang, "premium_this_yes");
} else {
    premiumhas = csybot.lang(getlang, "premium_this_no");
}


const premium = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
  description: csybot.lang(getlang, "premium_buy", csybot.config.premiumbuy, premiumhas),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.blue
}


csybot.send({ embeds: [premium] });

};

exports.help = {
  name: "premium",
  description: "Buy Premium And Unlock A Lot!",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  category: "premium"
};