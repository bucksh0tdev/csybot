const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  

const info = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
  fields: [
      {
        name: `${csybot.lang(getlang, "links")}:`,
        value: `[Support Server](${csybot.config.supportinvite})\n[Youtube](${csybot.config.youtubeinvite})`,
        inline: true
      }
    ],
  footer: {
    text: csybot.footer
  },
  color: csybot.config.blue
}
  

csybot.send({ embeds: [info]});



};

exports.help = {
  name: "contact",
  description: "If You Want To Contact Us",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  category: "utilty"
};