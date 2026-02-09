const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "user_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
const error2 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "quantity_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

let userget = csybot.options("user");
let option2 = csybot.options("quantity");
  
if(!userget || !userget.user || !userget.user.id) return csybot.send({ embeds: [error] });
if(!option2) return csybot.send({ embeds: [error2] });

let guild = await csybot.guildget();
if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });
  
const doublemoneybug = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "double_money"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
const nouser = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "user_error"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

if(userget.user.id == interaction.member.user.id) return csybot.send({ embeds: [doublemoneybug] });
if(userget.user.bot) return csybot.send({ embeds: [nouser] });
  
var coin = await csybot.getmoney(interaction.member.user.id)
  
const minmoney = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "coin_min_give", option2, 10),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
const nomoney = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "coin_no_give", option2, coin),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

if(option2 < 10) return csybot.send({ embeds: [minmoney] });
if(coin < option2) return csybot.send({ embeds: [nomoney] });

await csybot.data("add", "coin", `coin_${interaction.member.user.id}`, `-${option2}`);
await csybot.data("add", "coin", `coin_${userget.user.id}`, `${option2}`);
await csybot.moneylogadd(interaction.member.user.id, `GIVE (${csybot.filter(`${userget.user.username}#${userget.user.discriminator}`)})`, `-${option2}`)
await csybot.moneylogadd(userget.user.id, `TAKE (${csybot.filter(`${interaction.member.user.username}#${interaction.member.user.discriminator}`)})`, `+${option2}`)
  
const resultembed = {
  fields: [
      {
        name: `:cheese: \`\`${csybot.lang(getlang, "coin_format_crypto_name")}\`\``,
        value: `[${await csybot.getcheese(interaction.member.user.id)}](${csybot.config.supportinvite})`,
        inline: true,
      },
      {
        name: `:coin: \`\`${csybot.lang(getlang, "coin_format_money_name")}\`\``,
        value: `[${await csybot.getmoney(interaction.member.user.id)}](${csybot.config.supportinvite}) (-${option2})`,
        inline: true,
      },
      {
        name: `:flying_saucer: \`\`${csybot.lang(getlang, "coin_format_level_name")}\`\``,
        value: `[${await csybot.getlevel(interaction.member.user.id)}](${csybot.config.supportinvite})`,
        inline: true,
      },
      {
        name: `${csybot.lang(getlang, "logs")}:`,
        value: `${await csybot.moneylogs(interaction.member.user.id)}`,
        inline: true,
      }
    ],
  footer: {
    text: csybot.footer
  },
  color: csybot.config.yellow
}
  

return csybot.send({ embeds: [resultembed] });


};

exports.help = {
  name: "give",
  description: "Want to Send Coins to Others?",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  category: "shopping",
  options: [{
    type: 6,
    name: "user",
    description: "Select User",
    required: true
  },
  {
	type: 10,
    name: "quantity",
    description: "How much will you send?",
    required: true
  }],
};