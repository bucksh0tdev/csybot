const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
var adprotect = await csybot.data("fetch", "adprotect", `adprotect_${interaction.guild_id}`, null);
let getlang = await csybot.getlang();
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "select_box", (adprotect == "actived") ? csybot.lang(getlang, "actived") : csybot.lang(getlang, "deactived")),
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


    if(adprotect && option == "open") {
        return csybot.send({embeds: [error2]});
    } else if (!adprotect && option == "close") {
        return csybot.send({embeds: [error2]});
    }
  
    const success = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: csybot.lang(getlang, "success_behavior", (option == "open") ? csybot.lang(getlang, "actived") : csybot.lang(getlang, "deactived")),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.green
    }
    
if(adprotect) {
    await csybot.data("delete", "adprotect", `adprotect_${interaction.guild_id}`, null)
} else {
    await csybot.data("set", "adprotect", `adprotect_${interaction.guild_id}`, "actived");
}
csybot.send({embeds: [success]});
} else {
  csybot.send({embeds: [error]});
}





};

exports.help = {
  name: "advertise-protect",
  description: "Advertise Protection",
  category: "moderation",
  permissions: {
    bot: ["MANAGE_MESSAGES"],
    user: ["MANAGE_MESSAGES"]
  },
  options: [{
			type: 3,
      name: "open-close",
      description: "You Turn the Ad System Off and On!",
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