const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();

const info = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "vote_title")}**`,
  description: csybot.lang(getlang, "vote_desc", csybot.config.topggrecive, csybot.config.vote),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.orange
}

return csybot.send({ embeds: [info] });

};

exports.help = {
  name: "vote",
  description: "Vote for us",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  category: "utilty",
};