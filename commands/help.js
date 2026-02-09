const Discord = require("discord.js");
const { translate } = require('bing-translate-api');
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();

let filters = require("../../databases/commands.js")

var legendary = "";
var utilty = "";
var fun = "";
var premium = "";
var moderation = "";
var Communication = "";
  
await filters.forEach(async (i) => {
  var translated = i.description;

  if(i.category == "legendary") {
    legendary += "" + csybot.config.rightarrow + " ``/"+ i.name + "`` **➟** " + translated + "\n";
  }
  if(i.category == "utilty") {
    utilty += "``/"+ i.name + "`` **➟** " + translated + "\n";
  }
  if(i.category == "premium") {
    premium += "``/"+ i.name + "`` **➟** " + translated + "\n";
  }
  if(i.category == "fun") {
    fun += "``/"+ i.name + "`` **➟** " + translated + "\n";
  }
  if(i.category == "moderation") {
    moderation += "``/"+ i.name + "`` **➟** " + translated + "\n";
  }
  if(i.category == "communication") {
    Communication += "``/"+ i.name + "`` **➟** " + translated + "\n";
  }
});

const embed = {
  title: `**${csybot.lang(getlang, "commands")};**`,
  fields: [
      {
        name: `**${csybot.lang(getlang, "commands_legendary")} (${legendary.split("➟").length -1})**`,
        value: `${(legendary) ? legendary : `${csybot.lang(getlang, "commands_not_found")}`}`
      },
      {
        name: `**${csybot.lang(getlang, "commands_premium")} (${premium.split("➟").length -1})**`,
        value: `${(premium) ? premium : `${csybot.lang(getlang, "commands_not_found")}`}`,
      },
      {
        name: `**${csybot.lang(getlang, "commands_utilty")} (${utilty.split("➟").length -1})**`,
        value: `${(utilty) ? utilty : `${csybot.lang(getlang, "commands_not_found")}`}`,
      },
      {
        name: `**${csybot.lang(getlang, "commands_fun")} (${fun.split("➟").length -1})**`,
        value: `${(fun) ? fun : `${csybot.lang(getlang, "commands_not_found")}`}`,
      },
      {
        name: `**${csybot.lang(getlang, "commands_moderation")} (${moderation.split("➟").length -1})**`,
        value: `${(moderation) ? moderation : `${csybot.lang(getlang, "commands_not_found")}`}`,
      }
    ],
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

  
  
csybot.send({ embeds: [embed] });

};

exports.help = {
  name: "help",
  description: "All Commands",
  permissions: {
    bot: ["EMBED_LINKS", "USE_EXTERNAL_EMOJIS"],
    user: []
  },
};