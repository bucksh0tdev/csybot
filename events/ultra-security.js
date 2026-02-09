const Discord = require("discord.js");
const fs = require('fs');
const globalfun = require("../functions/global.js");
exports.run = async (client, message) => {
const csybot = new globalfun(client, message);
let getlang = await csybot.getlang();
  
  if(!message || !message.content || !message.guild || !message.author || message.author.bot) return;
  
  let ultraprotect = await csybot.data("fetch", "ultraprotect", `ultraprotect_${message.guild.id}`, null);
  if(!ultraprotect) return;
  
  if (message.member.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)) return;
  
  let tagregexp = new RegExp('<@(.*?)>', 'g');
  let tagnumber = Math.floor(((message.content).split(tagregexp).length / 2));

  let dublicate = (message.content).split('').filter(function(item, pos, self) {
  if(!item || item == " ") return false;
    return self.indexOf(item) == pos;
  }).length;

  
  const security = {
    description: csybot.lang(getlang, "protect_message"),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.red
  }
  
    
  if(tagnumber >= 4) {

      message.delete().catch(err => err + "1");  
      message.channel.permissionOverwrites.create(message.author, { SEND_MESSAGES: false }).catch(err => err + "1");
    
      message.channel.send({ embeds: [security] }).catch(err => err + "1");
        

  } else if (dublicate < 3 && (message.content).length >= 12) {

    message.delete().catch(err => err + "1");

    return message.channel.send({ embeds: [security] }).then(msg => {
      setTimeout(() => {
        msg.delete().catch(err => err + "1");
      }, 5000);
    }).catch(err => err + "1");
    
  }
  
  
  
};

exports.help = {
  event: "messageCreate"
};