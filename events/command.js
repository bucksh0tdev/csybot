const Discord = require("discord.js");
const globalfun = require("../functions/global.js");
exports.run = async (client, interaction) => {
  if (!interaction.isCommand()) return;
  if (!interaction.guild) return interaction.reply("Please Use In Server!");
  
    const json = {
      version: 1,
      type: 1,
      token: interaction.token,
      member: {
        user: {
          username: interaction.member.user.username,
          id: interaction.member.user.id,
          discriminator: interaction.member.user.discriminator,
          avatar: interaction.member.user.avatar
        },
        roles: interaction.member._roles,
        permissions: interaction.memberPermissions.bitfield,
      },
      locale: interaction.locale,
      id: interaction.id,
      guild_id: interaction.member.guild.id,
      options: interaction.options,
      channel_id: interaction.channel.id,
      application_id: interaction.applicationId,
      commandName: interaction.commandName
    }
  
  
  const csybot = new globalfun(client, json, interaction);
  await interaction.deferReply().catch(err => {
    err + "1";
    return;
  });
  
  let controlresult = await csybot.controls(interaction.member.guild.id, interaction.member.user.id, 2);
  if(controlresult != false) return csybot.send(controlresult);
  
  
  let getlang = await csybot.getlang();
  let cooldown = await csybot.cooldown(json.member.user.id, getlang);
  if(cooldown) return csybot.send({ embeds: [cooldown] });
  
  const commands = require("../databases/commands.js");

  if(!commands) return;
  if (!commands.has(interaction.commandName)) return csybot.send("Sorry, This Command Has Been Deleted, Or Under Maintenance!");
  
  let term = await csybot.term();
  if(term != true) return;

  
  try {
    let mycommandfilename = commands.get(interaction.commandName).file;
    let mycommand = require(`../commands/${mycommandfilename}`);
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
  event: "interactionCreate",
  ws: false
};