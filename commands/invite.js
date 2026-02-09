const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
const invite = {
  title: csybot.lang(getlang, "invite_text_title", client.user.username),
  description: csybot.lang(getlang, "invite_text_description", csybot.config.invite),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.blue
}


csybot.send({ embeds: [invite] });

};

exports.help = {
  name: "invite",
  description: "Add CsYBot to Your Own Server!",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  category: "utilty"
};