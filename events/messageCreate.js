const Discord = require("discord.js");
const globalfun = require("../functions/global.js");
exports.run = async (client, interaction) => {
  if (!interaction.guild || interaction.author.bot || !interaction.content) return;
  const csybotfuu = new globalfun(client, null, interaction);

  let prefix = null;
  
  
  /* Selecting Multiple Prefix */
  await csybotfuu.config.prefix.some(rprefix => {
    if(interaction.content.toLowerCase().startsWith(rprefix.toLowerCase())) {
     prefix = rprefix;
    }
  });
  /* Selecting Multiple Prefix */
  
  
  if(!prefix || prefix == null) return;
  
  if(!interaction.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
  
  let optionsreal = interaction.content.split(' ').slice(1);
  
  async function optiontranslate(opts) {
    await opts.forEach(async function(mention, i) {
      
      const userpattern = mention.matchAll(Discord.MessageMentions.USERS_PATTERN).next().value;
      const channelpattern = mention.matchAll(Discord.MessageMentions.CHANNELS_PATTERN).next().value;
      const rolepattern = mention.matchAll(Discord.MessageMentions.ROLES_PATTERN).next().value;

      if(userpattern && userpattern[1]) {
        var userget = await interaction.guild.members.cache.get(userpattern[1]);
        opts[i] = {
          typing: 2,
          type: "user",
          value: (userget) ? userget : null
        }
      } else if (channelpattern && channelpattern[1]) {
         var channelget = await interaction.guild.channels.cache.get(channelpattern[1]);
         opts[i] = {
           typing: 2,
           type: "channel",
           value: (channelget) ? channelget : null
        }
      } else if (rolepattern && rolepattern[1]) {
         var roleget = await interaction.guild.roles.cache.get(rolepattern[1]);
         opts[i] = {
           typing: 2,
           type: "role",
           value: (roleget) ? roleget : null
        }
      } else {
         opts[i] = {
           typing: 2,
           type: "text",
           value: mention
        }
      }
    });
    
    return opts;
  }
  
  let optiontranslated = await optiontranslate(optionsreal);

  const json = {
    type: 2,
    member: interaction.member,
    id: interaction.id,
    guild_id: interaction.guild.id,
    options: optiontranslated,
    channel_id: interaction.channel.id,
    application_id: client.user.id,
    commandName: interaction.content.split(' ')[0].slice(prefix.length),
    commandFile: null
  }
  
  const csybot = new globalfun(client, json, interaction);
  
  let controlresult = await csybot.controls(interaction.member.guild.id, interaction.member.user.id, 2);
  if(controlresult != false) return csybot.send(controlresult);
  
  
  let getlang = await csybot.getlang();
  let cooldown = await csybot.cooldown(json.member.user.id, getlang);
  if(cooldown) return csybot.send({ embeds: [cooldown] });
  
  const commands = require("../databases/commands.js");

  if(!commands) return;
  if (!commands.has(json.commandName)) return;
  
  let term = await csybot.term();
  if(term != true) return;

  
  try {
    let mycommandfilename = commands.get(json.commandName).file;
    let mycommand = require(`../commands/${mycommandfilename}`);
    json.commandFile = mycommandfilename;
    
    const errorslash = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
      description: "This Command Can Only Be Used With Slash",
      footer: {
        text: csybot.footer
      },
      color: csybot.config.red
    }
    
    if(mycommand.help.onlySlash && mycommand.help.onlySlash == true) return csybot.send({ embeds: [errorslash] });
    
    /* permisson handler */
    var permission = mycommand.help.permissions
    /* permisson handler */

    // let guild = await csybot.guildget(interaction.guild_id);

    let getclient = await csybot.getmember(client.user.id);

    if(!getclient.permissions.has(permission.bot)) {

      let botreq = [];

      await permission.bot.some(function(x) {
        if(!getclient.permissions.has(x)) {
          botreq.push(x);
        }
      });


      const error4 = {
        title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
        description: csybot.lang(getlang, "bot_missing_permissions", botreq[0]),
        footer: {
          text: csybot.footer
        },
        color: csybot.config.red
      }
      
      return csybot.send({ embeds: [error4] });
    }
    
    if (!interaction.member.permissions.has(permission.user)) {

      let userreq = [];

      await permission.user.some(function(x) {
        if(!interaction.member.permissions.has(x)) {
          userreq.push(x);
        }
      });
      
      const error5 = {
        title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
        description: csybot.lang(getlang, "missing_permissions", userreq[0]),
        footer: {
          text: csybot.footer
        },
        color: csybot.config.red
      }
      
      return csybot.send({ embeds: [error5] });
    }

    if (mycommand.help.premium == true) {
      let premiumhas = await csybot.data("fetch", "premium", `premium_${json.guild_id}`, null);
      if (!premiumhas) {
        const error3 = {
          title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
          description: csybot.lang(getlang, "premium_valid"),
          footer: {
            text: csybot.footer
          },
          color: csybot.config.red
        }
        
        
        return csybot.send({ embeds: [error3] });
      }
    }
    
    mycommand.run(client, json, csybot, interaction)//.catch(err => err + "1");

  } catch (error) {
    console.log(error);
    csybot.send(`${csybot.lang(getlang, "error_occurred")}`);
  };
  
  
};

exports.help = {
  event: "messageCreate",
  ws: false
};