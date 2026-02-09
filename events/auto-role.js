const Discord = require("discord.js");
const globalfun = require("../functions/global.js");
exports.run = async (client, member) => {
const csybot = new globalfun(client, member);
let getlang = await csybot.getlang();
  
if(!member || !member.guild || member.user.bot) return;

  let fetchedautorole = await csybot.data("fetch", "autorole", `autorole_${member.guild.id}`, null);
  if (!fetchedautorole) return;

  let fetchedautoroleparsed = JSON.parse(fetchedautorole);

  let role = await member.guild.roles.fetch(fetchedautoroleparsed.role);
  let channel = await member.guild.channels.cache.get(fetchedautoroleparsed.channel);
  if (!role || !channel) return;

  await member.roles.add(role.id).catch(err => err + "1");

  const success = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
    description: csybot.lang(getlang, "autorole_run_desc", member.id),
    fields: [
      {
        name: `${csybot.lang(getlang, "role")}:`,
        value: `<@&${role.id}>`,
        inline: true
      },
      {
        name: `${csybot.lang(getlang, "time")}:`,
        value: `<t:${Math.floor(new Date().getTime() / 1000) - 10}:R>`,
        inline: true,
      }
    ],
    footer: {
      text: csybot.footer
    },
    color: csybot.config.green
  }
  

  return channel.send({ content: `${csybot.lang(getlang, "autorole_run_title", member.id)}`, embeds: [success] }).catch(err => err + "1")
  
};

exports.help = {
  event: "guildMemberAdd"
};