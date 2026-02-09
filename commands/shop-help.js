const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
let commands = await csybot.category("shopping");
  
const helping = {
  title: csybot.lang(getlang, "shop_command_title"),
  description: `${commands}`,
  footer: {
    text: csybot.footer
  },
  color: csybot.config.blue
}

return csybot.send({ embeds: [helping] });


};

exports.help = {
  name: "shop-help",
  description: "Everything About Buying Is Here!",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  category: "legendary"
};