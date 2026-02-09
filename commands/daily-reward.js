const Discord = require("discord.js");
exports.run = async (client, interaction, csybot, orginal) => {
let getlang = await csybot.getlang();
let file = require("../../databases/levels.json");
  

let dailycontrol = await csybot.data("fetch", "daily", `crypto_${interaction.member.user.id}`, null);

let now = new Date().getTime();


const timeout = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "try_again", (Math.floor((dailycontrol / 1000) - 10))),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  

if(dailycontrol && dailycontrol > now) return csybot.send({ embeds: [timeout] });
  
let captcha = csybot.captcha();

const captchaembed = {
        description: csybot.lang(getlang, "captcha_wait"),
        image: {
          url:  captcha.type
        },
        footer: {
          text: csybot.footer
        },
        color: csybot.config.blue
      }

csybot.send({ embeds: [captchaembed] });
  
const filter = m => m.author.id == interaction.member.user.id;
const collector = orginal.channel.createMessageCollector({ filter, time: 15000 });
  
collector.on('collect', async(m) => {
  
  const notcaptcha = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
    description: csybot.lang(getlang, "captcha_error"),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.red
  }
  if(!(captcha.answers).includes(m.content)) return csybot.send({ embeds: [notcaptcha] });
  
let level = await csybot.getlevel(interaction.member.user.id);
var getitem = file.find(el => el.level == level);
let dailygivemoney = getitem.daily;
  
const success = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
  description: csybot.lang(getlang, "daily_reward", dailygivemoney),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.green
}


let logdate = now + 86400000;

await csybot.data("set", "daily", `crypto_${interaction.member.user.id}`, logdate);


await csybot.data("add", "coin", `coin_${interaction.member.user.id}`, dailygivemoney);

await csybot.moneylogadd(interaction.member.user.id, "DAILY-REWARD", `+${dailygivemoney}`)

return csybot.send({ embeds: [success] });
});  

collector.on('end', collected => {
  if(collected.size != 0) return;
  const timestrampend = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
    description: csybot.lang(getlang, "time_out"),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.red
  }
  
  csybot.send({ embeds: [timestrampend], components: []});
  });

};

exports.help = {
  name: "daily-reward",
  description: "Lets You Earn Crypto Daily!",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  category: "shopping",
};