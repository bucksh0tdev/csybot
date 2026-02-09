const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");
const globalfun = require("../functions/global.js");
exports.run = async (client, member) => {
const csybot = new globalfun(client, member);
let getlang = await csybot.getlang();
  
if(!member || !member.guild || member.user.bot) return;

let guild = member.guild;
if(!guild) return;
let datas = await csybot.data("fetch", "security", `security_${guild.id}`, null);
if(!datas) return;
let datasfiltered = JSON.parse(datas);
if(!datasfiltered.channel || !datasfiltered.kickable) return;
let securitychannel = guild.channels.cache.get(datasfiltered.channel);
if(!securitychannel) return;
let user = guild.members.cache.get(member.id);
if(!user) return;

let fulltime = new Date().getTime() - user.user.createdAt.getTime();
let fulltimerecived = moment.duration(fulltime).format(`${csybot.lang(getlang, "timestramp_format")}`);
var warningstat = "";
if(fulltime < 2629800000) {
    warningstat = true;
} else {
    warningstat = false;
}

var kicked = "";
if(datasfiltered.kickable == "true" && warningstat == true) {
if(!user.kickable) {
    kicked = csybot.lang(getlang, "security_run_kick_no");
} else {
    await user.kick().catch(err => err + "1");
    kicked = csybot.lang(getlang, "security_run_kick_yes");
}
} else {
    kicked = csybot.lang(getlang, "security_run_kick_no");
}

  const warningembed2 = {
    title: `**${client.user.username} | ${(warningstat == true) ? csybot.lang(getlang, "warn") : csybot.lang(getlang, "success")}**`,
    
    fields: [
      {
        name: `${csybot.lang(getlang, "security_run_status")}:`,
        value: `${(warningstat == true) ? csybot.lang(getlang, "security_run_unsafe") : csybot.lang(getlang, "security_run_safe")}`,
        inline: true
      },
      {
        name: `${csybot.lang(getlang, "user")}:`,
        value: `<@${user.id}>`,
        inline: true,
      },
      {
        name: `${csybot.lang(getlang, "security_run_account_date")}:`,
        value: `${fulltimerecived}`,
        inline: false,
      },
      {
        name: `${csybot.lang(getlang, "security_run_kick")}:`,
        value: `${kicked}`,
        inline: false,
      }
	  ],
    footer: {
      text: csybot.footer
    },
    color: (warningstat == true) ? csybot.config.orange : csybot.config.green
  }
  

securitychannel.send({ content: `${csybot.lang(getlang, "security_run_title", user.id)}`, embeds: [warningembed2] }).catch(err => err + "1");

};

exports.help = {
    event: "guildMemberAdd"
};