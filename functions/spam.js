const Discord = require("discord.js");
const globalfun = require("../functions/global.js");

var MessageData = [];
module.exports = (client, msg, getlang) => {
  const csybot = new globalfun(client, msg);
  if(!msg.guild) return;
    if(MessageData[msg.guild.id] === undefined) MessageData[msg.guild.id] = [];  
  
      if (MessageData[msg.guild.id][msg.author.id] === undefined) {
        MessageData[msg.guild.id][msg.author.id] = { MesssageNumber: 0 };
        setTimeout(() => {
            delete MessageData[msg.guild.id][msg.author.id];
        }, 4000);
      }
      MessageData[msg.guild.id][msg.author.id].MesssageNumber += 1;

      if (MessageData[msg.guild.id][msg.author.id].MesssageNumber == 5) {
        if (msg.deletable) msg.delete().catch(err => err + "1");
          const spamed = {
            title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
            description: csybot.lang(getlang, "spam_success_muted"),
            footer: {
              text: csybot.footer
            },
            color: csybot.config.green
          }
        
          msg.channel.send({ embeds: [spamed] }).catch(err => err + "1");
          msg.channel.bulkDelete("5").catch(err => err + "1");
          msg.channel.permissionOverwrites.create(msg.author, { SEND_MESSAGES: false }).catch(err => err + "1");
          delete MessageData[msg.guild.id][msg.author.id];
        return;
      }

/* Warning! */
      if (MessageData[msg.guild.id][msg.author.id].MesssageNumber == 3) {
        
        const spamed = {
          title: `**${client.user.username} | ${csybot.lang(getlang, "warn")}**`,
          description: csybot.lang(getlang, "spam_warning"),
          footer: {
            text: csybot.footer
          },
          color: csybot.config.orange
        }
        
        msg.channel.send({ embeds: [spamed] }).catch(err => err + "1").then(msgggg => {
            setTimeout(() => {
                msgggg.delete().catch(err => err + "1");
            }, 3000);

        })
      }

/* Warning! */
};
