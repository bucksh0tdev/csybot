const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
    const embed = {
      author: {
          name: client.user.username,
      },
      fields: [
        {
          name: `${csybot.lang(getlang, "bot_latency")}`,
          value: `${Math.round(client.ws.ping)} ms`,
        }
      ],
      footer: {
        text: csybot.footer
      },
      color: csybot.config.blue
    }
  
csybot.send({ embeds: [embed]});
  

};


exports.help = {
  name: "ping",
  description: "Ping Command",
  options: null,
  category: "utilty",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
};