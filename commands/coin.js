const Discord = require("discord.js");
exports.run = async (client, interaction, csybot, orginal) => {
let getlang = await csybot.getlang();
  
let usercontroler = csybot.options("user");
  
let guild = await csybot.guildget();
if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });
  
let user = (usercontroler && usercontroler.id) ? usercontroler : orginal.member;

if(!user) return csybot.send({ embeds: [csybot.errorcode(202)] });


const info = {
  fields: [
      {
        name: `:cheese: \`\`${csybot.lang(getlang, "coin_format_crypto_name")}\`\``,
        value: `[${await csybot.getcheese(user.user.id)}](${csybot.config.supportinvite})`,
        inline: true,
      },
      {
        name: `:coin: \`\`${csybot.lang(getlang, "coin_format_money_name")}\`\``,
        value: `[${await csybot.getmoney(user.user.id)}](${csybot.config.supportinvite})`,
        inline: true,
      },
      {
        name: `:flying_saucer: \`\`${csybot.lang(getlang, "coin_format_level_name")}\`\``,
        value: `[${await csybot.getlevel(user.user.id)}](${csybot.config.supportinvite})`,
        inline: true,
      },
      {
        name: `${csybot.lang(getlang, "logs")}:`,
        value: `${await csybot.moneylogs(user.user.id)}`,
        inline: true,
      }
    ],
  footer: {
    text: csybot.footer
  },
  color: csybot.config.yellow
}
  

return csybot.send({ embeds: [info] });


};

exports.help = {
  name: "coin",
  description: "Shows Your Coin Profile",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  options: [{
	type: 6,
    name: "user",
    description: "Select User",
    required: false
  }],
  category: "shopping"
};