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
  description: csybot.lang(getlang, "time_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const noperm = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "perm_valid"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const maxtime = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "ban_temp_max"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

let user = csybot.options("user");
let time = csybot.options("time");
  
if(!user || !user.id) return csybot.send({ embeds: [error] });
if(!time || isNaN(time)) return csybot.send({ embeds: [error2] });
if(time > 7) return csybot.send({ embeds: [maxtime] });

let guild = await csybot.guildget();
if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });
if(!user.bannable) return csybot.send({ embeds: [noperm] });
if(user.user.id == client.user.id || user.user.id == csybot.config.ownerid) return csybot.send({ embeds: [noperm] });
await user.ban({
    days: time
});

let banneduser = csybot.filter(`${user.user.username}#${user.user.discriminator}`);

let now = new Date().getTime();
let timestramp = (time * 86400000) + now;

const success = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
  description: csybot.lang(getlang, "ban_temp_success", banneduser, Math.floor(timestramp / 1000)),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.green
}

return csybot.send({ embeds: [success] });


};

exports.help = {
    name: "tempban",
    description: "You can ban the user for a period of time!",
    permissions: {
      bot: ["BAN_MEMBERS", "EMBED_LINKS"],
      user: ["BAN_MEMBERS"]
    },
    options: [{
        type: 6,
        name: "user",
        description: "Select User",
        required: true
    }, 
    {
        type: 3,
        name: "time",
        description: "Choose Duration (Day)",
        required: true
    }],
    category: "moderation"  
  };