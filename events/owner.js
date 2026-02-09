const Discord = require("discord.js");
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const globalfun = require("../functions/global.js");
const request = require('node-superfetch');
const axios = require("axios");
const execSync = require('child_process').execSync; 
exports.run = async (client, message) => {
const csybot = new globalfun(client, message);

  if(!message || !message.content || !message.guild || !message.author || message.author.bot) return;
  
  if (message.author.id != csybot.config.ownerid/* || message.guild.id != csybot.config.testguildid*/) return;
  if (message.content == "!reload") {

    var startedmsg;

    await message.channel.send("Started refreshing application (/) commands.").then(msg => startedmsg = msg).catch(err => err + "1");

    let cmdArrGlobal = await client.api.applications(client.user.id).commands.get();
    let commands = [];

    const commandFiles_en = fs.readdirSync(__dirname + "/../commands").filter(file => file.endsWith('.js'));

    for (const file of commandFiles_en) {
      const command = require(`../commands/${file}`);
      commands.push(command.help);
    }
    const rest = new REST({ version: '9' }).setToken(process.env.token);

    (async () => {
      try {
        await rest.put(
          Routes.applicationCommands(client.user.id),
          { body: commands },
        );
        startedmsg.edit("Successfully reloaded application (/) commands.").catch(err => err + "1");
      } catch (error) {
        console.error(error);
      }
    })();
  } else if (message.content.startsWith("!precode")) {
    let code = message.content.trim().split(/ +/g);
    if (!code[1]) return message.channel.send("Please Enter Premium Days!").catch(err => err + "1");
    let premiumcode = csybot.random(15);

    await csybot.createpremiumcode(premiumcode, code[1]);
    return message.channel.send("Successfully New Premium Code ``" + premiumcode + "`` [" + code[1] + "]").catch(err => err + "1");
  } else if (message.content == "!prelist") {
    let getpremiumcodemodel = require(`../databases/models/premiumcode.js`);
    const cursor = getpremiumcodemodel.find().cursor();
    var list = "";
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      var premiumname = doc.dataname.split("_")[1];
      list += "``" + premiumname + "`` [" + doc.data + "]\n"
    }
    message.channel.send((list) ? list : "No Code!").catch(err => err + "1");


  } else if (message.content.startsWith("!moneyget")) {
    let price = message.content.trim().split(/ +/g);
    if (!price[1]) return message.channel.send("Please Enter Price!").catch(err => err + "1");
    await csybot.data("add", "coin", `coin_${message.author.id}`, Number(price[1]));
    message.channel.send("Successfully! Gived Coin **" + price[1] + "**").catch(err => err + "1");
  } else if (message.content == "!test") {
    client.emit("guildMemberAdd", message.member);
    message.channel.send({ content: "Successfully! Tested Emit!" }).catch(err => err + "1");
  } else if (message.content.startsWith("!stop")) {
    let price = message.content.trim().split(/ +/g);
    await message.channel.send(`Stopped (${(price[1] != "all") ? "Only Shard!" : "All Shard!"})`);
    if(price[1] != "all") {
       process.exit(1);
    } else {
    client.shard.broadcastEval(async(c) => {
       process.exit(1);
    });
    }
  } else if (message.content.startsWith("!eval")) {
    
    let args = message.content.split(' ').slice(1);
    let cont = message.content.split(' ').slice(1).join(' ');
    message.channel.send('Evaluating...').then(async(msg) => {
        try {
          
     function clean(sta) {
        let rege = new RegExp(client.token, "gi");
       let text = String(sta);
        text
            .replace(/`/g, '`' + String.fromCharCode(8203))
            .replace(/@/g, '@' + String.fromCharCode(8203))
            .replace(rege, '404')
        return text;
    };
          
          
            let code = args.join(' ')
          
            let evaled = await eval(code);

            const evalcode = {
              author: {
                name: `Eval by ${message.author.tag}`
              },
              description: `**:inbox_tray: Input:**\n\n\`\`\`js\n${cont}\`\`\``,
              fields: [
                {
                  name: `\u200b`,
                  value: `**:outbox_tray: Output:**\n\n\`\`\`js\n${clean(evaled)}\`\`\``,
                }
              ],
              footer: {
                text: `Node.js - Time taken: ${Date.now() - message.createdTimestamp} ms`
              },
              color: csybot.config.green
            }
          
            msg.edit({ embeds: [evalcode] }).catch(e => e + "1");
        } catch (err) {
            const errorcode = {
              author: {
                name: `Eval by ${message.author.tag}`
              },
              description: `**:inbox_tray: Input:**\n\n\`\`\`js\n${cont}\`\`\``,
              fields: [
                {
                  name: `\u200b`,
                  value: `**:outbox_tray: Output:**\`\`\`js\n${err}\`\`\``,
                }
              ],
              footer: {
                text: `Node.js - Time taken: ${Date.now() - message.createdTimestamp} ms`
              },
              color: csybot.config.red
            }
          
          
            msg.edit({
                embeds: [errorcode]
            }).catch(e => e + "1");
        }
    });
    
    
    
  } else if (message.content == "!codeshare") {
    
    const filter = m => m.author.id == message.author.id;
    
    await message.channel.send("Send Description!");
    
    const desc = await message.channel.createMessageCollector({ filter, max: 1, time: 60000 });

    let descorg = "";
    let howuse = "";
    
    desc.on('collect', async(m) => {
      descorg = m.content;
      await message.channel.send("How Use?");
      const howusee = await message.channel.createMessageCollector({ filter, max: 1, time: 60000 });
      howusee.on('collect', async(ms) => {
        howuse = ms.content;
        await message.channel.send("Send Code?");
        const code = await message.channel.createMessageCollector({ filter, max: 1, time: 60000 });
        
        code.on('collect', async(mss) => {
          
          let kod = mss.attachments.first();
          let { data } = await axios.get(`${kod.url}`);

          let random = csybot.random(8).toLowerCase();

          let getcontrol = await csybot.data("fetch", "code", `code_${random}`, null);
          if(getcontrol) return message.channel.send("Error: 502");

          let json = {
            desc: `${String(descorg)}`,
            code: `${String(data)}`,
            howuse: `${String(howuse)}`
          }

          await csybot.data("set", "code", `code_${random}`, JSON.stringify(json));

          message.channel.send(`Published, Code: ${random}`);
          
        });

      code.on('end', collected => {
        if(collected.size != 0) return;
        const timestrampend = {
          title: `**${client.user.username} | ${csybot.lang("tr", "error")}**`,
          description: csybot.lang("tr", "time_out"),
          footer: {
            text: csybot.footer
          },
          color: csybot.config.red
        }

        message.channel.send({ embeds: [timestrampend], components: []});
        });
        
      });
      
      howusee.on('end', collected => {
        if(collected.size != 0) return;
        const timestrampend = {
          title: `**${client.user.username} | ${csybot.lang("tr", "error")}**`,
          description: csybot.lang("tr", "time_out"),
          footer: {
            text: csybot.footer
          },
          color: csybot.config.red
        }

        message.channel.send({ embeds: [timestrampend], components: []});
        });
      
    });
    
    
    desc.on('end', collected => {
      if(collected.size != 0) return;
      const timestrampend = {
        title: `**${client.user.username} | ${csybot.lang("tr", "error")}**`,
        description: csybot.lang("tr", "time_out"),
        footer: {
          text: csybot.footer
        },
        color: csybot.config.red
      }

      message.channel.send({ embeds: [timestrampend], components: []});
      });
    
    
    
  } else if (message.content.startsWith("!codedel")) {
    let code = message.content.trim().split(/ +/g);
    let getcontrol = await csybot.data("fetch", "code", `code_${code[1]}`, null);
    if(!getcontrol) return message.channel.send("Code Not Found!");
    let parsed = JSON.parse(getcontrol);
    
    const buffer = Buffer.from((parsed.code || "Not Found. https://api.csycraft.com"))
    const attachment = new Discord.MessageAttachment(buffer, 'code.js')
    await message.channel.send({ files: [attachment] });
    
    await csybot.data("delete", "code", `code_${code[1]}`, null);
    
    message.channel.send("SUCCESS, Deleted!");
    
    
  } else if (message.content.startsWith("!ready")) {
    let slice = message.content.trim().split(/ +/g);
    let method = slice[1];
    
    if(method != "set" && method != "reset") return message.channel.send("Allow methods (set, reset)");
    
    if(method == "reset") {
    await csybot.data("delete", "bot", `ready`, null);
    await client.shard.broadcastEval(async(c) => {

      let user1 = await c.shard.broadcastEval(cs => cs.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0));
      let user2 = user1.reduce((acc, memberCount) => acc + memberCount, 0);
      let user3 = user2 * 2;
      let user = user3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      
      c.user.setActivity(`${user} Users?! | Shard: ${c.shard.ids}`, {
        url: "https://www.twitch.tv/csycraft",
        type: "STREAMING"
      });
    });
    message.channel.send("SUCCESS, Ready Renewed!");
  } else if(method == "set") {
    let msg = slice.slice(2).join(" ");
    
    await csybot.data("set", "bot", `ready`, `${msg}`);
    
    await client.shard.broadcastEval(async(c, msg) => {
      c.user.setActivity(`${msg} | Shard: ${c.shard.ids}`, {
        url: "https://www.twitch.tv/csycraft",
        type: "STREAMING"
      });
    }, { context: msg});
    
    message.channel.send("SUCCESS, Ready Fixed!");
  }
      
      
    
    
  } else if (message.content.startsWith("!secretkeyban")) {
    let split = message.content.trim().split(/ +/g);
    let key = split[1];
    let reason = split.slice(2).join(" ");
    if(!key) return message.channel.send("Please Enter Secret Key!").catch(err => err + "1");
    if (!reason) return message.channel.send("Please Enter Ban Reason!").catch(err => err + "1");

    let msg = await message.channel.send("Secret Key Baning.. (``" + key + "``)").catch(err => err + "1");
    
    let control = await csybot.data("fetch", "secretkeys", `secret_${key}`, null);
    if(!control) return msg.edit("Secret Key Not Found!").catch(err => err + "1");
    
    let parsing = JSON.parse(control);
    
    if(parsing.banned && parsing.banned == true) return msg.edit(`Secret Key Already Banned. Reason (${parsing.banreason})`);
    
    parsing.banned = true;
    parsing.banreason = reason;
    
    await csybot.data("set", "secretkeys", `secret_${key}`, JSON.stringify(parsing));
    
    return msg.edit("SUCCESS, Secret Key Banned. Reason (" + reason + ")").catch(err => err + "1");
  } else if (message.content.startsWith("!secretkeyunban")) {
    let split = message.content.trim().split(/ +/g);
    let key = split[1];
    if(!key) return message.channel.send("Please Enter Secret Key!").catch(err => err + "1");

    let msg = await message.channel.send("Secret Key UnBaning.. (``" + key + "``)").catch(err => err + "1");
    
    let control = await csybot.data("fetch", "secretkeys", `secret_${key}`, null);
    if(!control) return msg.edit("Secret Key Not Found!").catch(err => err + "1");
    
    let parsing = JSON.parse(control);
    
    if(!parsing.banned || parsing.banned != true) return msg.edit(`Secret Key Not Banned.`);
    
    parsing.banned = false;
    await csybot.data("set", "secretkeys", `secret_${key}`, JSON.stringify(parsing));
    
    return msg.edit("SUCCESS, Secret Key UnBanned").catch(err => err + "1");
  } else if (message.content.startsWith("!secretkeyreason")) {
    let split = message.content.trim().split(/ +/g);
    let key = split[1];
    if(!key) return message.channel.send("Please Enter Secret Key!").catch(err => err + "1");

    let msg = await message.channel.send("Secret Key Searching.. (``" + key + "``)").catch(err => err + "1");
    
    let control = await csybot.data("fetch", "secretkeys", `secret_${key}`, null);
    if(!control) return msg.edit("Secret Key Not Found!").catch(err => err + "1");
    
    let parsing = JSON.parse(control);
    
    if(!parsing.banned || parsing.banned != true) return msg.edit(`Secret Key Not Banned.`);
    
    return msg.edit("Secret Key Banned, Reason (" + parsing.banreason + ")").catch(err => err + "1");
  }
};

exports.help = {
  event: "messageCreate"
};