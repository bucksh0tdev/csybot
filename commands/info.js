const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
  let sunucusayisisonuc = await csybot.guilds();


  let kanalsayisisonuc = await csybot.channels();
  
  let now = new Date().getTime();
  
    const uptimetime = moment
      .duration(now - csybot.config.uptime)
      .format(`${csybot.lang(getlang, "uptime_format")}`);
  
const embed = {
  fields: [
      {
        name: `» <a:tac:795632061406642176> ${csybot.lang(getlang, "bot_owner")}`,
        value: "<@" + interaction.member.user.id + ">",
      },
      {
        name: `:desktop: ${csybot.lang(getlang, "memory_usage")}:`,
        value: (process.memoryUsage().heapUsed / 8048 / 2048).toFixed(2),
      },
      {
        name: `» ${csybot.lang(getlang, "operation_time")}`,
        value: uptimetime,
      },
      {
        name: `» ${csybot.lang(getlang, "users")}`,
        value: await csybot.user()
      },
      {
        name: `» :clipboard: ${csybot.lang(getlang, "servers")}`,
        value: sunucusayisisonuc
      },
      {
        name: `» ${csybot.lang(getlang, "channels")}`,
        value: kanalsayisisonuc
      },
      {
        name: `» Discord.JS ${csybot.lang(getlang, "version")}`,
        value: "v" + Discord.version
      },
      {
        name: `» Node.JS ${csybot.lang(getlang, "version")}`,
        value: `${process.version}`
      },
      {
        name: `» Ping`,
        value: client.ws.ping + " ms"
      },
      {
        name: `:book: ${csybot.lang(getlang, "libary")}`,
        value: `Discord.js`
      },
      {
        name: `**❯ ${csybot.lang(getlang, "bot_invite")}**`,
        value: " [" + csybot.lang(getlang, "invite") + "](" + csybot.config.invite +")"
      },
      {
        name: `**❯ ${csybot.lang(getlang, "bot_support_server")} **`,
        value: " [" + csybot.lang(getlang, "bot_join_support_server") + "](" + csybot.config.supportinvite +")"
      },
      {
        name: "**❯ Panel **",
        value: " [" + csybot.lang(getlang, "manage") + "](" + csybot.config.panel +")"
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
  name: "info",
  description: "Statistics Command",
  options: null,
  category: "utilty",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  }
};