const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
  
let optionremove = csybot.options("delete", true);
let optionsetting = csybot.options("setting", true);
let optionshow = csybot.options("show", true);
  
let guild = await csybot.guildget();
if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });

if(optionsetting) {
let channel = csybot.options("channel", true, "setting");
let category = csybot.options("category", true, "setting");
let role = csybot.options("role", true, "setting");
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "channel_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const error3 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "channel_valid"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const errorv = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "role_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const errorvv = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "role_valid"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const error2 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "category_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
const error4 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "category_valid"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

if(!channel) return csybot.send({ embeds: [error] });
if(!category) return csybot.send({ embeds: [error2] });
if(!role) return csybot.send({ embeds: [errorv] });

  
if(!channel || !channel.id || channel.type != "GUILD_TEXT") return csybot.send({ embeds: [error3] })
if(!category || !category.id || category.type != "GUILD_CATEGORY") return csybot.send({ embeds: [error4] })
if(!role || !role.id) return csybot.send({ embeds: [errorvv] })
  
  
await csybot.data("set", "ticket", `ticket_${interaction.guild_id}`, `{"channel": "${channel.id}", "guild": "${interaction.guild_id}", "category": "${category.id}", "role": "${role.id}"}`);

const success = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
  description: csybot.lang(getlang, "ticket_success"),
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
			name: `${csybot.lang(getlang, "category")}:`,
			value: `\`\`${csybot.filter(category.name)}\`\``,
      inline: true
		}
	],
  footer: {
    text: csybot.footer
  },
  color: csybot.config.green
}

const info = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
  description: csybot.lang(getlang, "ticket_info"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.blue
}

const row = new Discord.MessageActionRow()
.addComponents(
  new Discord.MessageButton()
    .setCustomId(`ticketCreate`)
    .setLabel(`${csybot.lang(getlang, "ticket_label")}`)
    .setStyle(3)
)
  
channel.send({ embeds: [info], components: [row] }).catch(err => err + "1");
  
return csybot.send({ embeds: [success] });

} else if (!optionsetting && optionshow) {

let fetchedticket = await csybot.data("fetch", "ticket", `ticket_${interaction.guild_id}`, null);
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "ticket_not_active"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

if(!fetchedticket) return csybot.send({ embeds: [error] });

let datas = JSON.parse(fetchedticket);
  
let category = await guild.channels.cache.get(datas.category);
let categoryname = (category && category.id && category.name) ? category.name : "Deleted!";

let role = await guild.roles.cache.get(datas.role);
let rolesh = (role && role.id && role.name) ? `<@&${csybot.filter(role.id)}>` : "Deleted!";
  
    const info = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
      description: `${csybot.lang(getlang, "ticket_infos")}`,
      fields: [
        {
          name: `${csybot.lang(getlang, "channel")}:`,
          value: `<#${datas.channel}>`,
          inline: true
        },
        {
          name: `${csybot.lang(getlang, "role")}:`,
          value: `${rolesh}`,
          inline: true
        },
        {
          name: `${csybot.lang(getlang, "category")}:`,
          value: `\`\`${csybot.filter(categoryname)}\`\``,
          inline: true
        }
      ],
      footer: {
        text: csybot.footer
      },
      color: csybot.config.blue
    }
  

return csybot.send({ embeds: [info] });
  
  
} else if (!optionsetting && !optionshow && optionremove) {
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "ticket_not_active"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
let fetchedticket = await csybot.data("fetch", "ticket", `ticket_${interaction.guild_id}`, null);
if(!fetchedticket) return csybot.send({ embeds: [error] });
  
let deleteing = await csybot.data("starts", "ticket", `user_${interaction.guild_id}`, null);
for (var i = 0; i < deleteing.length; i++) {
  var dataname = deleteing[i];
  await csybot.data("delete", "ticket", dataname.dataname, null);
}

await csybot.data("delete", "ticket", `ticket_${interaction.guild_id}`, null);
  
  const success = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
    description: csybot.lang(getlang, "ticket_deleted"),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.green
  }
  
  return csybot.send({ embeds: [success] });
  
  
}




};

exports.help = {
  name: "ticket",
  description: "Support request manager",
  permissions: {
    bot: ["ADMINISTRATOR", "EMBED_LINKS"],
    user: ["ADMINISTRATOR"]
  },
  category: "legendary",
  options: [{
    type: 1,
    name: "setting",
    description: "Makes the Settings!",
    options: [{
            type: 7,
            name: "channel",
            description: "Which channel should I send a message to?",
            required: true
        },
        {
            type: 7,
            name: "category",
            description: "Specified category",
            required: true
        },
        {
            type: 8,
            name: "role",
            description: "Ticket manager role",
            required: true
        },
      ]
  },
  {
    type: 1,
    name: "delete",
    description: "Delete ticket",
    options: []
  },
  {
      type: 1,
      name: "show",
      description: "Show Current Settings"
  }]
};