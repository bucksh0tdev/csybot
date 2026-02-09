const Discord = require("discord.js");
const fs = require("fs");
let langs = [];
const files = fs.readdirSync(__dirname + "/../../databases/langs").filter(file => file.endsWith('.js')); 
files.forEach(x => {
  let name = x.split(".")[0]
  langs.push({
    "name": name.toUpperCase(),
    "value": name
  });
});
exports.run = async (client, interaction, csybot) => {
var lang = await csybot.data("fetch", "lang", `lang_${interaction.guild_id}`, null);
let getlang = await csybot.getlang();
  
let already = await String(getlang).toUpperCase();

const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "select_box", already),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

let option = csybot.options("lang-select");
  
if(!option) return csybot.send({embeds: [error]});

if(files.includes(`${option}.js`)) {
  
    const error2 = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "already_box", (String(option).toUpperCase())),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }


    if(lang == option || (!lang && option == csybot.config.defaultlang)) return csybot.send({embeds: [error2]});


    const success = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: csybot.lang(getlang, "success_behavior", (String(option).toUpperCase())),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.green
    }
    
if(option == csybot.config.defaultlang) {
    await csybot.data("delete", "lang", `lang_${interaction.guild_id}`, null)
} else {
    await csybot.data("set", "lang", `lang_${interaction.guild_id}`, `${String(option)}`);
}
csybot.send({embeds: [success]});
} else {
  csybot.send({embeds: [error]});
}





};

exports.help = {
  name: "lang",
  description: "Change Language",
  category: "utilty",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: ["MANAGE_MESSAGES"]
  },
  options: [{
			type: 3,
      name: "lang-select",
      description: "Enter Language Short Name.",
      required: true,
      "choices": langs
		}]
};