const Discord = require("discord.js");
const axios = require("axios");
exports.run = async (client, interaction, csybot, orginal) => {
let getlang = await csybot.getlang();
  
let optionremove = csybot.options("remove", true);
let optionadd = csybot.options("add", true);
let optionshow = csybot.options("list", true);
let optioninfo = csybot.options("info", true);

const error = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
    description: csybot.lang(getlang, "channel_none"),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.red
  }

const error2 = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
    description: csybot.lang(getlang, "user_none"),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.red
  }

const error3 = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
    description: csybot.lang(getlang, "error_occurred"),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.red
  }

const already = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
    description: csybot.lang(getlang, "votetracker_already"),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.red
  }

  const error5 = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
    description: csybot.lang(getlang, "votetracker_not_found"),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.red
  }

if(optionadd) {
    let botid = csybot.options("bot-id", true, "add");
    let channel = csybot.options("channel", true, "add");

    if(!channel || !channel.id || channel.type != "GUILD_TEXT") return csybot.send({ embeds: [error] })

    let control1 = await csybot.dcuserget(csybot.filter(botid));
    if(!control1) return csybot.send({ embeds: [error2] });

    let count = await csybot.data("count", "votetracker", `tracker_${interaction.guild_id}_`);
    const max = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "votetracker_max", String(count || 0), "2"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }
    if(count >= 2) return csybot.send({ embeds: [max] });

    let control = await csybot.data("fetch", "votetracker", `tracker_${interaction.guild_id}_${control1.id}`, null);
    if(control) return csybot.send({ embeds: [already] });

    let control2 = await axios.get(`https://top.gg/api/bots/${control1.id}`, {
        headers: {
          'Authorization': csybot.config.topggtoken
        }
      }).catch(err => err + "1");
    if(!control2 || !control2.data) return csybot.send({ embeds: [error5] });
    if(control2.data.error) return csybot.send({ embeds: [error2] });
    if(control2.data.id != control1.id) return csybot.send({ embeds: [error5] });
    
    let webhook = await channel.createWebhook(`Vote Tracker`).catch(err => err + "1");
    if(!webhook || !webhook.url) return csybot.send({ embeds: [error2] });
    let pass = csybot.random(65).toLowerCase();

    await csybot.data("set", "votetracker", `tracker_${interaction.guild_id}_${control1.id}`, `{"channel": "${channel.id}", "webhook": "${webhook.url}", "pass": "${pass}", "guild": "${interaction.guild_id}"}`);

    const success = {
        title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
        description: csybot.lang(getlang, "votetracker_success"),
        fields: [
              {
                  name: `${csybot.lang(getlang, "channel")}:`,
                  value: `<#${channel.id}>`,
                  inline: false
              },
              {
                  name: `Webhook URL:`,
                  value: `https://api.csycraft.com/votetracker/${interaction.guild_id}/${control1.id}`,
                  inline: false
              },
              {
                  name: `Authorization:`,
                  value: `\`\`${pass}\`\``,
                  inline: false
              },
          ],
        footer: {
          text: csybot.footer
        },
        color: csybot.config.green
      }
    
    return csybot.send({ embeds: [success] });

} else if (!optionadd && optionremove) {
  let botid = csybot.options("bot-id", true, "remove");

  let control = await csybot.data("fetch", "votetracker", `tracker_${interaction.guild_id}_${csybot.filter(botid)}`, null);
  if(!control) return csybot.send({ embeds: [error5] });

  await csybot.data("delete", "votetracker", `tracker_${interaction.guild_id}_${csybot.filter(botid)}`, null);

  const error6 = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
    description: csybot.lang(getlang, "votetracker_deleted", String(csybot.filter(botid))),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.green
  }

  return csybot.send({ embeds: [error6] });

} else if (!optionadd && !optionremove && optionshow) {
  
  let reactionmodel = require(`../../databases/models/votetracker.js`);
  const cursor = reactionmodel.find().cursor();
  var list = "";

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    let guildid = doc.dataname.split("_")[1];
    if(guildid != interaction.guild_id) continue;
    let botid = doc.dataname.split("_")[2];
    let details = JSON.parse(doc.data);
    
    list += `\`\`${botid}\`\` **➟** <#${details.channel}>\n`;
    
  }
    
  if(!list) return csybot.send({ embeds: [error5] })

    const info = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
      description: `${list}`,
      footer: {
        text: csybot.footer
      },
      color: csybot.config.blue
    }
    
    
  return csybot.send({ embeds: [info] });


} else if (!optionadd && !optionremove && !optionshow && optioninfo) {
  let botid = csybot.options("bot-id", true, "info");

  let control = await csybot.data("fetch", "votetracker", `tracker_${interaction.guild_id}_${csybot.filter(botid)}`, null);
  if(!control) return csybot.send({ embeds: [error5] });

  let details = JSON.parse(control);

    const success = {
        title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
        description: csybot.lang(getlang, "votetracker_success"),
        fields: [
              {
                  name: `${csybot.lang(getlang, "channel")}:`,
                  value: `<#${details.channel}>`,
                  inline: false
              },
              {
                  name: `Webhook URL:`,
                  value: `https://api.csycraft.com/votetracker/${interaction.guild_id}/${csybot.filter(botid)}`,
                  inline: false
              },
              {
                  name: `Authorization:`,
                  value: `\`\`${details.pass}\`\``,
                  inline: false
              },
          ],
        footer: {
          text: csybot.footer
        },
        color: csybot.config.green
      }
    
    return csybot.send({ embeds: [success] });

}


};

exports.help = {
  name: "vote-tracker",
  description: "Dbl vote tracker list all incoming votes.",
  permissions: {
    bot: ["ADMINISTRATOR", "EMBED_LINKS"],
    user: ["ADMINISTRATOR"]
  },
  category: "legendary",
  options: [{
    type: 1,
    name: "add",
    description: "Makes the Settings!",
    options: [{
            type: 3,
            name: "bot-id",
            description: "Specified bot ID",
            required: true
        },
        {
            type: 7,
            name: "channel",
            description: "What channel is the message on?",
            required: true
        }]
  },
  {
    type: 1,
    name: "remove",
    description: "Remove setting",
    options: [{
        type: 3,
        name: "bot-id",
        description: "Specified bot ID",
        required: true
    }]
  },
  {
    type: 1,
    name: "info",
    description: "Info setting",
    options: [{
        type: 3,
        name: "bot-id",
        description: "Specified bot ID",
        required: true
    }]
  },
  {
      type: 1,
      name: "list",
      description: "Show Current Settings"
  }]
};