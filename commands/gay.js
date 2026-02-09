const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();

let gaymeter = Math.floor(Math.random() * 101);

let gaymessage = (gaymeter >= 49) ? `${csybot.lang(getlang, "gay_success_yep")}` : `${csybot.lang(getlang, "gay_success_nope")}`;
  
const funny = {
  title: csybot.lang(getlang, "gay_meter"),
  fields: [
      {
        name: `${csybot.lang(getlang, "gay_percentage")}`,
        value: `${gaymeter}%`
      },
      {
        name: `${csybot.lang(getlang, "gay_question")}`,
        value: `${gaymessage}`
      }
    ],
  footer: {
    text: csybot.footer
  },
  color: csybot.config.green
}
  

return csybot.send({ embeds: [funny] });

};

exports.help = {
  name: "gay",
  description: "Are you gay?",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  category: "fun",
};