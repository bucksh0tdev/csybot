const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
let optionremove = csybot.options("remove", true);
let optionadd = csybot.options("add", true);
let optionshow = csybot.options("list", true);

if(optionadd) {
let messageid = csybot.options("message-id", true, "add");
let role = csybot.options("role", true, "add");
let channel = csybot.options("channel", true, "add");
  
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
  description: csybot.lang(getlang, "message_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const error3 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "role_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
const error4 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "react_already"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
//console.log(channelid)
if(!channel) return csybot.send({ embeds: [error] });
if(!messageid) return csybot.send({ embeds: [error2] });
if(!role) return csybot.send({ embeds: [error3] });
let guild = await csybot.guildget();
if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });
// console.log(guild.channels.cache)
  
if(!channel || !channel.id || channel.type != "GUILD_TEXT") return csybot.send({ embeds: [error] })
  
let messagegets = await channel.messages.fetch({ around: messageid, limit: 1 });
let messageget = messagegets.first();
if(!messageget) return csybot.send({ embeds: [error2] });
  
let total = await csybot.data("count", "reactionrole", `react_${interaction.guild_id}`);
  

const error9 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "react_max", total, "5"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

  
  
  
let getcontrol = await csybot.data("fetch", "reactionrole", `react_${interaction.guild_id}_${messageget.id}`, null);
if(getcontrol) return csybot.send({ embeds: [error4] })

if(total >= 5) return csybot.send({ embeds: [error9] });
  
await csybot.data("set", "reactionrole", `react_${interaction.guild_id}_${messageget.id}`, `{"channel": "${channel.id}", "guild": "${interaction.guild_id}", "message": "${messageget.id}", "role": "${role.id}"}`);

  
const success = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
  description: csybot.lang(getlang, "react_success"),
  fields: [
		{
			name: `${csybot.lang(getlang, "channel")}:`,
			value: `<#${channel.id}>`,
      inline: true
		},
		{
			name: `${csybot.lang(getlang, "role")}:`,
			value: `<@&${role.id}>`,
			inline: true
		},
		{
			name: `${csybot.lang(getlang, "link")}:`,
			value: `[${csybot.lang(getlang, "go")}](https://discord.com/channels/${interaction.guild_id}/${channel.id}/${messageget.id})`,
			inline: true
		}
	],
  footer: {
    text: csybot.footer
  },
  color: csybot.config.green
}
  
messageget.react("🎉");
  
return csybot.send({ embeds: [success] });

} else if (!optionadd && optionshow) {
let reactionmodel = require(`../../databases/models/reactionrole.js`);
const cursor = reactionmodel.find().cursor();
var list = "";

for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  let guildid = doc.dataname.split("_")[1];
  if(guildid != interaction.guild_id) continue;
  let messageid = doc.dataname.split("_")[2];
  let reactdetails = JSON.parse(doc.data);
  
  list += `\`\`${messageid}\`\` **➟** [${csybot.lang(getlang, "go")}](https://discord.com/channels/${reactdetails.guild}/${reactdetails.channel}/${reactdetails.message})\n`;
  
}
  
const error5 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "react_not_found"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
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
  
  
} else if (!optionadd && !optionshow && optionremove) {
  

let message = csybot.options("message-id", true, "remove");
  

const error6 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "message_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
if(!message) return csybot.send({ embeds: [error6] });
  
let getcontrol = await csybot.data("fetch", "reactionrole", `react_${interaction.guild_id}_${message}`, null);
if(!getcontrol) return csybot.send({ embeds: [error6] });

await csybot.data("delete", "reactionrole", `react_${interaction.guild_id}_${message}`, null);
  
  const success = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
    description: csybot.lang(getlang, "react_deleted", csybot.filter(message)),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.green
  }
  
  return csybot.send({ embeds: [success] });
  
  
}




};

exports.help = {
  name: "reaction-role",
  description: "You can give the determined role by reacting.",
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
            type: 7,
            name: "channel",
            description: "What channel is the message on?",
            required: true
        },
        {
            type: 3,
            name: "message-id",
            description: "Specified message ID",
            required: true
        },
        {
            type: 8,
            name: "role",
            description: "On which role should it apply?",
            required: true
        }]
  },
  {
    type: 1,
    name: "remove",
    description: "Remove setting",
    options: [{
        type: 3,
        name: "message-id",
        description: "Specified message ID",
        required: true
    }]
  },
  {
      type: 1,
      name: "list",
      description: "Show Current Settings"
  }]
};