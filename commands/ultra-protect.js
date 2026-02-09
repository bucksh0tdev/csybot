const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
let ultrprotect = await csybot.data("fetch", "ultraprotect", `ultraprotect_${interaction.guild_id}`, null);
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "select_box", ((ultrprotect) ? csybot.lang(getlang, "actived") : csybot.lang(getlang, "deactived"))),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

let option = csybot.options("open-close");
  
if(!option) return csybot.send({embeds: [error]});

if(option == "open" || option == "close") {

    const error2 = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "already_box", ((option) ? csybot.lang(getlang, "actived") : csybot.lang(getlang, "deactived"))),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }


    if(ultrprotect && option == "open") {
        return csybot.send({embeds: [error2]});
    } else if (!ultrprotect && option == "close") {
        return csybot.send({embeds: [error2]});
    }

    const success = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: csybot.lang(getlang, "success_behavior", ((option) ? csybot.lang(getlang, "actived") : csybot.lang(getlang, "deactived"))),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.green
    }
    
if(ultrprotect) {
    await csybot.data("delete", "ultraprotect", `ultraprotect_${interaction.guild_id}`, null)
} else {
    await csybot.data("set", "ultraprotect", `ultraprotect_${interaction.guild_id}`, "actived");
}
csybot.send({embeds: [success]});
} else {
  csybot.send({embeds: [error]});
}

};

exports.help = {
    name: "ultra-protect",
    description: "It Protects Various Vulnerabilities in Writing.",
    category: "moderation",
    permissions: {
      bot: ["ADMINISTRATOR", "EMBED_LINKS"],
      user: ["ADMINISTRATOR"]
    },
    premium: true,
    options: [{
      type: 3,
      name: "open-close",
      description: "You Turn The Ultra Protect System Off and On!",
      required: true,
      "choices": [
          {
            "name": "Open",
            "value": "open"
          },
          {
            "name": "Close",
            "value": "close"
          }
        ]
    }]
  };