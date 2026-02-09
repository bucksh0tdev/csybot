const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
let money = await csybot.getmoney(interaction.member.user.id);
let maxmoneylength = 10000;
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "steel_safe_bet_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

let enteredcasino = csybot.options("quantity");
  
if(!enteredcasino) return csybot.send({ embeds: [error] });
  
const nomoney = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "steel_safe_not_bet", String(money), String(enteredcasino)),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
const maxmoney = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "steel_safe_max_bet", String(maxmoneylength), String(enteredcasino)),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
if(enteredcasino <= 0) return csybot.send({ embeds: [error] });
if(money < enteredcasino) return csybot.send({ embeds: [nomoney] });
if(enteredcasino > maxmoneylength) return csybot.send({ embeds: [maxmoney]});
  
const waitprocess = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "did")}**`,
  description: csybot.lang(getlang, "steel_safe_waiting"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.blue
}


let sended = await csybot.send({ embeds: [waitprocess] });

var result = 0;

let voicestate = await csybot.data("fetch", "voice", `voice_${interaction.member.user.id}`, null);

if(money < 30000) { 
  
if(voicestate) {
  result = Math.floor(Math.random() * 2);
} else {
  result = Math.floor(Math.random() * 3);
}
} else {
  result = Math.floor(Math.random() * 4);
}
  

let resultreal = (result == 1) ? `+${enteredcasino}` : `-${enteredcasino}`;

await csybot.data("add", "coin", `coin_${interaction.member.user.id}`, `${resultreal}`);

await csybot.moneylogadd(interaction.member.user.id, "GAMBLING", resultreal)

const resultembed = {
  fields: [
      {
        name: `:cheese: \`\`${csybot.lang(getlang, "coin_format_crypto_name")}\`\``,
        value: `[${await csybot.getcheese(interaction.member.user.id)}](${csybot.config.supportinvite})`,
        inline: true,
      },
      {
        name: `:coin: \`\`${csybot.lang(getlang, "coin_format_money_name")}\`\``,
        value: `[${await csybot.getmoney(interaction.member.user.id)}](${csybot.config.supportinvite}) (${resultreal})`,
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
  

if(interaction.type == 2) {
  return sended.edit({ embeds: [resultembed], content: (result == 1) ? `${csybot.lang(getlang, "win")}!!` : `${csybot.lang(getlang, "sorry")}, :/` }).catch(err => err + "1");
} else {
  return csybot.edit({ embeds: [resultembed], content: (result == 1) ? `${csybot.lang(getlang, "win")}!!` : `${csybot.lang(getlang, "sorry")}, :/` });
  
}
  

};

exports.help = {
  name: "steel-safe",
  description: "Suitable for Gambling!",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  options: [{
	type: 10,
    name: "quantity",
    description: "How Much Will You Bet?",
    required: true
  }],
  category: "shopping"
};