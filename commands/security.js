const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
let optionreset = csybot.options("reset", true);
let optionset = csybot.options("set", true);
let optionshow = csybot.options("show", true);
/* Sub Command Is Reset */
if(optionreset) {
    let fetchedautorole = await csybot.data("fetch", "security", `security_${interaction.guild_id}`, null);

  
    const error = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "security_not_active"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }

    if(!fetchedautorole) return csybot.send({ embeds: [error] });

    const success = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: csybot.lang(getlang, "security_success_closed"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.green
    }

    await csybot.data("delete", "security", `security_${interaction.guild_id}`, null)
    return csybot.send({ embeds: [success] });
} else if (!optionreset && optionset) {
/* Sub Command Is Set */
  
    const error2 = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "channel_none"),
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
    
    const error2v2v1 = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "security_none_kickable"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }

    let channel = csybot.options("channel", true, "set");
    let kickable = csybot.options("open-close", true, "set");
    if(!channel) return csybot.send({ embeds: [error2] });
    if(!kickable) return csybot.send({ embeds: [error2v2v1] });

    let guild = await csybot.guildget(interaction.guild_id);
    if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });
    if(!channel || channel.type != "GUILD_TEXT") return csybot.send({ embeds: [error2v2] })

    let fetchedautorole = await csybot.data("fetch", "security", `security_${interaction.guild_id}`, null);

    let msg = (fetchedautorole) ? `${csybot.lang(getlang, "security_success_renew")}` : `${csybot.lang(getlang, "security_success_opened")}`;

    await csybot.data("set", "security", `security_${interaction.guild_id}`, `{"channel": "${channel.id}", "kickable": "${kickable}" }`);
  
    const success = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: `${msg}`,
      fields: [
        {
          name: `${csybot.lang(getlang, "channel")}:`,
          value: `<#${channel.id}>`,
          inline: true
        },
        {
          name: `${csybot.lang(getlang, "security_kick_system")}:`,
          value: `\`\`${(kickable == "true") ? csybot.lang(getlang, "actived") : csybot.lang(getlang, "deactived")}\`\` ${(kickable == "true") ? "(" + csybot.lang(getlang, "security_kickable_info") + ")" : ""}`,
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

let fetchedsecurity = await csybot.data("fetch", "security", `security_${interaction.guild_id}`, null);
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "security_not_active"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

if(!fetchedsecurity) return csybot.send({ embeds: [error] });
  
let datas = JSON.parse(fetchedsecurity);
  
    const info = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
      description: csybot.lang(getlang, "security_info"),
      fields: [
        {
          name: `${csybot.lang(getlang, "channel")}:`,
          value: `<#${datas.channel}>`,
          inline: true
        },
        {
          name: `${csybot.lang(getlang, "security_kick_system")}:`,
          value: `\`\`${(datas.kickable == "true") ? csybot.lang(getlang, "actived") : csybot.lang(getlang, "deactived")}\`\` ${(datas.kickable == "true") ? "(" + csybot.lang(getlang, "security_kickable_info") + ")" : ""}`,
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
  name: "security",
  description: "Provides Information About the Security of the Members Entering the Server!",
  permissions: {
    bot: ["KICK_MEMBERS", "EMBED_LINKS"],
    user: ["KICK_MEMBERS"]
  },
  category: "moderation",
  options: [{
    type: 1,
    name: "set",
    description: "Makes the Settings!",
    options: [{
            type: 7,
            name: "channel",
            description: "Where do you want the information to be sent?",
            required: true
        },
        {
		type: 3,
        name: "open-close",
        description: "If You Turn This On Unsafe Members Will Be Kicked Out!",
        required: true,
        "choices": [
            {
            "name": "Open",
            "value": "true"
            },
            {
            "name": "Close",
            "value": "false"
            }
        ]}
    ]
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