const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();


let optionupgrade = csybot.options("upgrade", true);
let optioninfo = csybot.options("info", true);

let money = await csybot.getmoney(interaction.member.user.id);
let level = await csybot.getlevel(interaction.member.user.id);
let file = require("../../databases/levels.json");
  
if(optionupgrade) {
  
var getitem = file.find(el => el.level == (Number(level) + 1));
  
const error1 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "level_max", String(level)),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
if(!getitem) return csybot.send({ embeds: [error1] });

const noprice = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "shop_price_no", String(money), getitem.price, `Level ${getitem.level}`),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
if(money < getitem.price) return csybot.send({ embeds: [noprice] });
  
await csybot.data("add", "coin", `coin_${interaction.member.user.id}`, -getitem.price);
await csybot.data("set", "coin", `level_${interaction.member.user.id}`, (level + 1));
await csybot.moneylogadd(interaction.member.user.id, `LEVEL UPGRADE (Level ${level + 1})`, `-${getitem.price}`)
  
    const embed = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: csybot.lang(getlang, "shop_purchased", `Level ${getitem.level}`),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.green
    }

    
return csybot.send({ embeds: [embed] });
  
} else if(!optionupgrade && optioninfo) {
  
const info = {
  fields: [
      {
        name: `:cheese: \`\`${csybot.lang(getlang, "coin_format_crypto_name")}\`\``,
        value: `[${await csybot.getcheese(interaction.member.user.id)}](${csybot.config.supportinvite})`,
        inline: true,
      },
      {
        name: `:coin: \`\`${csybot.lang(getlang, "coin_format_money_name")}\`\``,
        value: `[${money}](${csybot.config.supportinvite})`,
        inline: true,
      },
      {
        name: `:flying_saucer: \`\`${csybot.lang(getlang, "coin_format_level_name")}\`\``,
        value: `[${(level)}](${csybot.config.supportinvite})`,
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

return csybot.send({ embeds: [info] });  
  
  
}

  
};

exports.help = {
  name: "level",
  description: "Level System",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  category: "shopping",
  options: [{
      type: 1,
      name: "info",
      description: "Level info"
    },
    {
      type: 1,
      name: "upgrade",
      description: "Level up"
    }]
};