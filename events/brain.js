const Discord = require("discord.js");
const globalfun = require("../functions/global.js");
const brainfun = require("../functions/brain.js");
const brain = new brainfun();
exports.run = async (client, message) => {
const csybot = new globalfun(client, message);
  
  if(!message || !message.content || !message.author || message.author.bot) return;

  
  

  let getlang = await csybot.getlang();
  
  if (!message.guild) {
    let controlresult = await csybot.controls(null, message.author.id, 7);
    if(controlresult != false) return message.channel.send(controlresult);
    

    
    let term = await csybot.dmterm();
    if(term != true) return;
    
    const error = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "brain_null"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }
    

    if (!message.content) return message.channel.send({ embeds: [error] }).catch(err => err + "1");
    message.channel.sendTyping();
    let reply = await brain.chat(message.content, csybot.filter(String(message.author.id) + "131csy131"), csybot.config.botname, null, getlang);
    message.reply({ content: reply, allowedMentions: { repliedUser: true }});
    return;
  }

  
  var referencecontrol = false;
  
  /* Reference */
  if(message.reference && message.reference.messageId) {
    let reference = await message.channel.messages.fetch({around: message.reference.messageId, limit: 1});
    if(reference && reference.first() && reference.first().author.id == client.user.id) referencecontrol = true;
  }

  /* Reference */
  

  if(!message.content.startsWith(`<@${client.user.id}>`) && !message.content.startsWith(`<@!${client.user.id}>`) && !message.content.startsWith(`csybot`) && referencecontrol == false) return;
  
    let controlresult = await csybot.controls(message.guild.id, message.author.id, 2);
    if(controlresult != false) return message.channel.send(controlresult);
  
  
    let term = await csybot.term();
    if(term != true) return;
    
    //await csybot.data("delete", "brain", `brain_${message.guild.id}`, null)

    let brainhas = await csybot.data("fetch", "brain", `brain_${message.guild.id}`, null);

    if (!brainhas) {
      if (!message.member.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)) {
        
        const error2 = {
          title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
          description: csybot.lang(getlang, "brain_perm_valid"),
          footer: {
            text: csybot.footer
          },
          color: csybot.config.red
        }
        

        return message.channel.send({ embeds: [error2] }).catch(err => err + "1");

      } else {
        const row = new Discord.MessageActionRow()
          .addComponents(
            new Discord.MessageButton()
              .setCustomId(`brainverification`)
              .setLabel('✅')
              .setStyle(3)
          )
          .addComponents(
            new Discord.MessageButton()
              .setCustomId(`brainnoverification`)
              .setLabel('❌')
              .setStyle(4)
          );


        const info = {
          title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
          description: csybot.lang(getlang, "brain_term_info"),
          footer: {
            text: csybot.footer
          },
          color: csybot.config.blue
        }
        

        var msg;
        await message.channel.send({ embeds: [info], components: [row] }).then(msga => msg = msga).catch(err => err + "1");

        const filter = i => (i.customId === 'brainverification' || i.customId === 'brainnoverification') && i.user.id === message.author.id;

        const collector = message.channel.createMessageComponentCollector({ filter, time: 15000 });

        collector.on('collect', async i => {
          if (i.customId == "brainverification") {
            const embed = {
              title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
              description: csybot.lang(getlang, "brain_success_opened"),
              footer: {
                text: csybot.footer
              },
              color: csybot.config.green
            }
            
            await csybot.data("set", "brain", `brain_${message.guild.id}`, "actived");
            await i.update({ components: [], embeds: [embed] });
          } else if (i.customId == "brainnoverification") {
            const embed = {
              title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
              description: csybot.lang(getlang, "brain_success_reject"),
              footer: {
                text: csybot.footer
              },
              color: csybot.config.green
            }
            
            await i.update({ components: [], embeds: [embed] }).catch(err => err + "1");
          }
        });

        collector.on('end', collected => {
          if (collected.size != 0) return;
          const timestrampend = {
            title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
            description: csybot.lang(getlang, "time_out"),
            footer: {
              text: csybot.footer
            },
            color: csybot.config.red
          }
          
          if(!msg) return;
          msg.edit({ embeds: [timestrampend], components: [] }).catch(err => err + "1");
        });
        return;
      }


    }

    let soru;
  
    if(referencecontrol == true) {
      soru = message.content
    } else {
      let args = message.content.split(" ").slice(1);
      soru = args.slice(0).join(' ');
    }

    const error = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: csybot.lang(getlang, "brain_null"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }
    

    if (!soru) return message.channel.send({ embeds: [error] }).catch(err => err + "1");
    message.channel.sendTyping()
    let reply = await brain.chat(soru, csybot.filter(String(message.author.id) + "131csy131"), csybot.config.botname, null, getlang);
    message.reply({ content: reply, allowedMentions: { repliedUser: true }}).catch(err => err + "1");
  
};

exports.help = {
  event: "messageCreate"
};