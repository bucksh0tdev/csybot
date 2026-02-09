const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {

let getlang = await csybot.getlang();
  
let optionreset = csybot.options("reset", true);
let optionset = csybot.options("set", true);
let optionshow = csybot.options("show", true);
/* Sub Command Is Reset */
if(optionreset) {
    let fetchedautorole = await csybot.data("fetch", "autorole", `autorole_${interaction.guild_id}`, null);


    const error = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "autorole_not_active"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }

    if(!fetchedautorole) return csybot.send({ embeds: [error] });

    const success = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: csybot.lang(getlang, "autorole_success_close"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.green
    }
  
    await csybot.data("delete", "autorole", `autorole_${interaction.guild_id}`, null)
    return csybot.send({ embeds: [success] });
} else if (!optionreset && optionset) {
/* Sub Command Is Set */
  
    const error = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "role_none"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }
    
    const error2 = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "channel_none"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }
    
    const errorv2 = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "role_valid"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }
    
    const error2v2 = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "channel_valid"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }

    let role = csybot.options("role", true, "set");
    let channel = csybot.options("channel", true, "set");

    if(!role) return csybot.send({ embeds: [error] });
    if(!channel) return csybot.send({ embeds: [error2] });

    let guild = await csybot.guildget();
    if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });
    if(!role.id) return csybot.send({ embeds: [errorv2] })
    if(!channel || !channel.id || channel.type != "GUILD_TEXT") return csybot.send({ embeds: [error2v2] })

    let fetchedautorole = await csybot.data("fetch", "autorole", `autorole_${interaction.guild_id}`, null);

    let msg = (fetchedautorole) ? `${csybot.lang(getlang, "autorole_renewed")}` : `${csybot.lang(getlang, "autorole_opened")}`;

    await csybot.data("set", "autorole", `autorole_${interaction.guild_id}`, `{"channel": "${channel.id}", "role": "${role.id}" }`);
  
    const success = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: `${msg}`,
      fields: [
        {
          name: `${csybot.lang(getlang, "role")}:`,
          value: `<@&${role.id}>`,
          inline: true
        },
        {
          name: `${csybot.lang(getlang, "channel")}:`,
          value: `<#${channel.id}>`,
          inline: true
        }
      ],
      footer: {
        text: csybot.footer
      },
      color: csybot.config.green
    }

    return csybot.send({ embeds: [success] });
} else if (!optionreset && !optionset && optionshow) {
/* Sub Command Is Show */

let fetchedautorole = await csybot.data("fetch", "autorole", `autorole_${interaction.guild_id}`, null);
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "autorole_not_active"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

if(!fetchedautorole) return csybot.send({ embeds: [error] });

let datas = JSON.parse(fetchedautorole);
  
    const info = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
      description: `${csybot.lang(getlang, "autorole_info")}`,
      fields: [
        {
          name: `${csybot.lang(getlang, "role")}:`,
          value: `<@&${datas.role}>`,
          inline: true
        },
        {
          name: `${csybot.lang(getlang, "channel")}:`,
          value: `<#${datas.channel}>`,
          inline: true
        }
      ],
      footer: {
        text: csybot.footer
      },
      color: csybot.config.blue
    }
  

return csybot.send({ embeds: [info] });
}

};

exports.help = {
  name: "auto-role",
  description: "It Allows You To Auto Give The Role Determined To The Members Entering The Server!",
  permissions: {
    bot: ["ADMINISTRATOR", "EMBED_LINKS"],
    user: ["ADMINISTRATOR"]
  },
  category: "moderation",
  options: [{
    type: 1,
    name: "set",
    description: "Makes the Settings!",
    options: [{
            type: 8,
            name: "role",
            description: "Which Role Would You Like to Be Given to the Members Entering the Server?",
            required: true
        },
        {
            type: 7,
            name: "channel",
            description: "Where Do You Want Role-Assigned Members Logged?",
            required: true
        }]
  },
  {
    type: 1,
    name: "reset",
    description: "Reset Settings!"
  },
  {
      type: 1,
      name: "show",
      description: "Show Current Settings"
  }]
};