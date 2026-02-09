const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
var swearprotect = await csybot.data("fetch", "swearprotect", `swearprotect_${interaction.guild_id}`, null);
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "select_box", ((swearprotect == "actived") ? csybot.lang(getlang, "actived") : csybot.lang(getlang, "deactived"))),
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
      description: csybot.lang(getlang, "already_box", ((option == "open") ? csybot.lang(getlang, "actived") : csybot.lang(getlang, "deactived"))),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }


    if(swearprotect && option == "open") {
        return csybot.send({embeds: [error2]});
    } else if (!swearprotect && option == "close") {
        return csybot.send({embeds: [error2]});
    }

    const success = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: csybot.lang(getlang, "success_behavior", ((option == "open") ? csybot.lang(getlang, "actived") : csybot.lang(getlang, "deactived"))),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.green
    }
  
if(swearprotect) {
    await csybot.data("delete", "swearprotect", `swearprotect_${interaction.guild_id}`, null)
} else {
    await csybot.data("set", "swearprotect", `swearprotect_${interaction.guild_id}`, "actived");
}
csybot.send({embeds: [success]});
} else {
  csybot.send({embeds: [error]});
}





};

exports.help = {
  name: "swear-protect",
  description: "Profanity protection",
  category: "moderation",
  permissions: {
    bot: ["MANAGE_MESSAGES", "EMBED_LINKS"],
    user: ["MANAGE_MESSAGES"]
  },
  options: [{
			type: 3,
      name: "open-close",
      description: "You Turn the Cursing System Off and On!",
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