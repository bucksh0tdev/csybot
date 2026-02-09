const Discord = require("discord.js");
const globalfun = require("../functions/global.js");
exports.run = async (client, member) => {
const csybot = new globalfun(client, member);
let getlang = await csybot.getlang();
  
if(!member || !member.guild || member.user.bot) return;

  let fetchedwebprotect = await csybot.data("fetch", "webprotect", `webprotect_${member.guild.id}`, null);
  if (!fetchedwebprotect) return;

  let fetchedwebprotectparsed = JSON.parse(fetchedwebprotect);

  let role = await member.guild.roles.fetch(fetchedwebprotectparsed.role);
  let channel = await member.guild.channels.cache.get(fetchedwebprotectparsed.channel);
  if (!role || !channel) return;
  
  let url = csybot.config.panel+`/webprotect/${member.guild.id}`;
  
  const success = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
    description: csybot.lang(getlang, "webprotect_run_desc", url),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.green
  }
  

  return member.send({ content: `${csybot.lang(getlang, "webprotect_run_title", member.id)}`, embeds: [success] }).catch(err => err + "1")
  
};

exports.help = {
  event: "guildMemberAdd"
};