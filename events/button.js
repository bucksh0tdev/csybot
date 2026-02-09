const Discord = require("discord.js");
const globalfun = require("../functions/global.js");
exports.run = async (client, i) => {
  const csybot = new globalfun(client, i);
  if (!i.isButton()) return;
  
  let getlang = await csybot.getlang();
  
    const error = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "button_owner"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }
    
    

  if(i.customId.startsWith("verification") || i.customId.startsWith("noverification")) {
    let userid = i.customId.split("_")[1];
    if(userid != i.user.id) return i.reply({ embeds: [error], ephemeral: true }).catch(err => err + "1");
    let control = await csybot.data("fetch", "uses", `uses_${userid}`, null);
    if(control) return i.reply({ embeds: [error], ephemeral: true }).catch(err => err + "1");
    
    let acceptteds = await csybot.data("count", "uses", "");
    if(i.customId.startsWith("verification")) {
    
      const embed = {
        title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
        description: csybot.lang(getlang, "term_policies_desc", userid, csybot.config.email, (acceptteds + 1)),
        footer: {
          text: csybot.footer
        },
        color: csybot.config.green
      }
    
      let now = new Date().getTime();
      await csybot.data("set", "uses", `uses_${userid}`, Number(now));
      await i.update({ components: [], embeds: [embed] }).catch(err => err + "1");

      i.message.reply({ content: csybot.lang(getlang, "button_success"), allowedMentions: { repliedUser: true } }).catch(err => err + "1");
    } else if(i.customId.startsWith("noverification")) {    
      const embed = {
        title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
        description: csybot.lang(getlang, "term_policies_desc", userid, csybot.config.email, acceptteds),
        footer: {
          text: csybot.footer
        },
        color: csybot.config.red
      }
    
      await i.update({ components: [], embeds: [embed] }).catch(err => err + "1");
    }
  } else if(i.customId == "ticketCreate") {
    let guild = i.member.guild;
    
    let fetch = await csybot.data("fetch", "ticket", `ticket_${guild.id}`, null);
    if(!fetch) return i.message.delete().catch(err => err + "1");
    let parsed = JSON.parse(fetch);
    
    let category = await guild.channels.cache.get(parsed.category);
    let role = await guild.roles.cache.get(parsed.role);
    if(!category) return i.reply({ content: "Category Not Found!", ephemeral: true }).catch(err => err + "1");
    if(!role) return i.reply({ content: "Role Not Found!", ephemeral: true }).catch(err => err + "1");
    
    let sizecontrol = await csybot.data("fetch", "ticket", `user_${guild.id}_${i.user.id}`, null);

    if(sizecontrol) {
      let parsed = JSON.parse(sizecontrol);
      const error8 = {
        title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
        description: csybot.lang(getlang, "ticket_max", csybot.filter(parsed.channel)),
        footer: {
          text: csybot.footer
        },
        color: csybot.config.red
      }
      return i.reply({ embeds: [error8], ephemeral: true }).catch(err => err + "1");
    }
    
    let length = category.children.size;
    let id = String(length).padStart(4, "0");
    let channelname = csybot.filter(`ticket_${csybot.filter(id)}`);
    
    let channel = await guild.channels.create(channelname, { 
      parent: category.id,
			permissionOverwrites: [
				{
					id: i.user.id,
					allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
				},
				{
					id: guild.roles.everyone,
					deny: ['VIEW_CHANNEL'],
				},
				{
					id: role.id,
					allow: ['SEND_MESSAGES', 'VIEW_CHANNEL'],
				},
			],
    }).catch(err => err + "1");
    if(!channel || !channel.id || !channel.name) return i.reply({ content: "It seems i am not authorized", ephemeral: true }).catch(err => err + "1");
    
    await csybot.data("set", "ticket", `user_${guild.id}_${i.user.id}`, `{"channel": "${channel.id}", "guild": "${guild.id}"}`);
    
    const info = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: csybot.lang(getlang, "ticket_sended_info"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.green
    }
    
    const row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
        .setCustomId(`ticketDelete`)
        .setLabel(`❌`)
        .setStyle(4)
    )
    
    await channel.send({ embeds: [info], content: `<@${csybot.filter(i.user.id)}>`, components: [row] }).catch(err => err + "1");
    
    const embed = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: csybot.lang(getlang, "ticket_created", csybot.filter(channel.id)),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.green
    }
    
    return i.reply({ embeds: [embed], ephemeral: true }).catch(err => err + "1");
    
  } else if (i.customId == "ticketDelete") {
    i.reply({ content: "Deleting this ticket <@" + csybot.filter(i.user.id) + "> " });
    
    let fetch = await csybot.data("fetch", "ticket", `ticket_${i.member.guild.id}`, null);
    if(!fetch) return;
    if(!i.message || !i.message.channel) return;
    let parsed = JSON.parse(fetch);
    
    setTimeout(async function() {
      let control = await i.member.roles.cache.get(parsed.role);
      if(!i.member.permissions.has(["ADMINISTRATOR"]) && !control) {
        i.message.channel.permissionOverwrites.create(i.member, { SEND_MESSAGES: false, VIEW_CHANNEL: false }).catch(err => err + "1");
        await csybot.data("delete", "ticket", `user_${i.member.guild.id}_${i.user.id}`, null);
      } else {
        try {
          await i.message.channel.delete().catch(err => err + "1");
        } catch (err) {
          err + "1";
        }
        await csybot.data("delete", "ticket", `user_${i.member.guild.id}_${i.user.id}`, null);
      }
    }, 3000);
  }

};
exports.help = {
  event: "interactionCreate",
  ws: false
};