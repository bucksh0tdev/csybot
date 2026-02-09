'use strict';
const Discord = require("discord.js");
const { REST } = require('@discordjs/rest');
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
require("moment-duration-format");
const commands = require("../databases/commands.js"); 
const { Routes } = require('discord-api-types/v9');
const rest = new REST({ version: '9' }).setToken(process.env.token);

module.exports = function (client, interaction = null, orginal = null) {

  let messagesended = null;
  
  /* Message Send Method */
  this.send = async function (content) {
    
    if(!interaction.token) {
        if(interaction.type == 2) {
           if (typeof content === 'string') {
             if(messagesended != null) {
               messagesended = await messagesended.edit({ content: content, allowedMentions: { repliedUser: true }}).catch(err => err + "1");
               return messagesended;
             }
             messagesended = await orginal.reply({ content: content, allowedMentions: { repliedUser: true }}).catch(err => err + "1");
             return messagesended;
           } else {
           if(messagesended != null) {
           messagesended = await messagesended.edit(content, { allowedMentions: { repliedUser: true }}).catch(err => err + "1");
           return messagesended;
           }
           messagesended = await orginal.reply(content, { allowedMentions: { repliedUser: true }}).catch(err => err + "1");
           return messagesended;
           }
        } else {
          return interaction.channel.send(content)//.catch(err => err + "1");
        }
    } else {
    
      /*var result;

    if (typeof content === 'string') {
      result = client.api.interactions(interaction.id, interaction.token).callback.post({data: {
			  type: 4,
			  data: {
          content: content
        }
			  }
		  })
    } else {
      result = client.api.interactions(interaction.id, interaction.token).callback.post({data: {
			  type: 4,
			  data: content
			  }
		  })
    }*/
      return orginal.editReply(content).catch(err => err + "1");
    //return result;
    }
  }
  /* Message Send Method */
  
  /* Itcalic Font */
  this.italic = function(number2) {
    let number = String(number2);
    let result = number.replaceAll("0", "𝟎")
    .replaceAll("1", "𝟏")
    .replaceAll("2", "𝟐")
    .replaceAll("3", "𝟑")
    .replaceAll("4", "𝟒")
    .replaceAll("5", "𝟓")
    .replaceAll("6", "𝟔")
    .replaceAll("7", "𝟕")
    .replaceAll("8", "𝟖")
    .replaceAll("9", "𝟗");
    
    return result;
  }
  /* Itcalic Font */
  
  this.realfooter = function() {
    let now = new Date();
    let random = Number(now.getMinutes());
    if(random == 0) {
       return `©${this.italic(now.getFullYear())} 𝐂𝐬𝐘𝐁𝐨𝐭 𝘼𝙡𝙤𝙣𝙚`;
    } else if((random%2) == 0) {
       return `©${this.italic(now.getFullYear())} 𝐂𝐬𝐘𝐁𝐨𝐭 𝘼𝙡𝙡 𝙍𝙞𝙜𝙝𝙩𝙨 𝙍𝙚𝙨𝙚𝙧𝙫𝙚𝙙`;
    } else {
       return `©${this.italic(now.getFullYear())} 𝐂𝐬𝐘𝐁𝐨𝐭 𝙉𝙚𝙚𝙙𝙨 𝘿𝙤𝙣𝙖𝙩𝙞𝙤𝙣`;
    }
  }
  
  /* Footer */
  this.footer = `${this.realfooter()}`;
  /* Footer */
  
  /* Config */
  this.config = require("../config.js");
  /* Config */


  /* Command Listener */
  this.allcommands = function (lang) {
  return require("../databases/commands_" + lang);
  }
  /* Command Listener */
  
  /* Filter Function */
  this.filter = function (texts, maxlength = 150) {
    let text = (texts != null || texts != undefined || texts != "") ? String(texts) : null;
    if(text.length > maxlength || text == null || text == undefined || text == "") return "[...]";
    
    let tagregexp = new RegExp('<@(.*?)>', 'g');
    let tagsregexp = new RegExp('<@!(.*?)>', 'g');
    text = text.replaceAll(tagregexp, "[...]")
    text = text.replaceAll(tagsregexp, "[...]")
    
    var swears = [ '"', "'", "*", "`", "$", "<", "_", "~", "\n", ">"];
    var result = text.replaceAll(swears, '')
    return result;
  }
  /* Filter Function */
  
  /* Database Method */
  this.data = async function (type, mymodel, dataname, data) {
    let getmodel = require(`../databases/models/${mymodel}.js`);
  if(type == "set") {
      this.datalogger(type, mymodel, dataname, data);
      const doc = await getmodel.findOneAndUpdate({ dataname: { $eq: dataname } }, { data: data }).lean();
      if (doc) {
        return doc.data;
      } else {
        var docc = await getmodel.create({
          dataname: dataname,
          data: data,
        });
        return docc.data;
      }
      } else if (type == "fetch") {
        const doc = await getmodel.findOne({ dataname: { $eq: dataname } }).lean();
        if(doc) { return doc.data } else { return undefined; }
      } else if (type == "delete") {
        await getmodel.deleteOne({ dataname: { $eq: dataname } });
        return;
      } else if (type == "add") {
        var docv = await getmodel.findOne({ dataname: { $eq: dataname } }).lean();
        if(!docv) {
          var docv = await getmodel.create({
            dataname: dataname,
            data: 0,
          });
        };
        let result = Number(docv.data) + Number(data);
        const doc = await getmodel.findOneAndUpdate({ dataname: { $eq: dataname } }, { data: result }).lean();
        if(!doc) { return false; } else { return true; }
      } else if (type == "count") {
        const cursor = await getmodel.find().cursor();
        var length = 0;
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
          let control = (doc.dataname).startsWith(dataname);
          if(!control) continue;
          length++
        }
        return length || 0;
      } else if (type == "starts") {
        const cursor = await getmodel.find().cursor();
        var res = [];
        for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
          var control = null;
          if(!dataname) {
            control = (doc.dataname);
          } else {
            control = (doc.dataname).startsWith(dataname);
          }
          if(!control) continue;
          var json = {
            "dataname": doc.dataname,
            "data": doc.data
          }
          res.push(json);
        }
        return res || null;
      }
  }
  /* Database Method */

  /* Database Logger */
  
  this.datalogger = function (type, mymodel, dataname, data) {
   
    const webhook = new Discord.WebhookClient({ url: this.config.data_logger_webhook });
    const embed = {
      color: this.config.blue,
      author: {
        name: 'Data Logger',
      },
      fields: [
        {
          name: 'Type:',
          value: type,
        },
        {
          name: 'Model:',
          value: mymodel,
          inline: false,
        },
        {
          name: 'Data:',
          value: `\`\`\`json
${(dataname) ? dataname : "undefined"}
\`\`\``,
          inline: false,
        },
        {
          name: 'Value:',
          value: `\`\`\`json
${(data) ? data : "undefined"}
\`\`\``,
          inline: false,
        }
      ],
      footer: {
        text: this.footer,
      },
    };
    webhook.send({ embeds: [embed] });
  }

  
  this.premiumgive = async function (guildid, days, channel, key) {
    var now = new Date().getTime();
    var day = days * 86400000;
    var endtime = now + day;

    let premiumhas = await this.data("fetch", "premium", `premium_${guildid}`, null);

    if(premiumhas) {
      let premiumdetails = JSON.parse(premiumhas);
      var premiumbackresult = Number(premiumdetails.endtime) - now;
      endtime = endtime + premiumbackresult;
    }

    await this.data("set", "premium", `premium_${guildid}`, `{ "endtime": "${endtime}", "times": "${day}", "starttime": "${now}" }`);
    
    const webhook = new Discord.WebhookClient({ url: this.config.premium_webhook });
    const embed = {
      color: this.config.blue,
      author: {
        name: 'Premium Logger',
      },
      fields: [
        {
          name: 'guildId:',
          value: this.filter(guildid),
        },
        {
          name: 'days:',
          value: this.filter(days),
          inline: false,
        },
        {
          name: 'key:',
          value: key,
          inline: false,
        }
      ],
      footer: {
        text: this.footer,
      },
    };
    webhook.send({ embeds: [embed] });
    
    
    let getlang = await this.getlang();
    
    const success = {
      title: `**${client.user.username} | ${this.lang(getlang, "success")}**`,
      description: this.lang(getlang, "premium_buy_desc"),
      footer: {
        text: this.footer
      },
      color: this.config.green
    }
    
/*
    if(channel == "random") {
      guild.channels.cache.find(channel => channel.type === 'GUILD_TEXT' && channel.permissionsFor(guild.me).has('SEND_MESSAGES')).send({ embeds: [success] })
    } else {
    }*/
      this.send({ embeds: [success] }).catch(err => err + "1");
  }

  /* Premium Guilds Reload */
  this.premiumreload = async function () {
    let getpremiummodel = require(`../databases/models/premium.js`);
    const cursor = getpremiummodel.find().cursor();
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      let guildid = doc.dataname.split("_")[1];
      let premiumdetails = JSON.parse(doc.data);

      let endtime = premiumdetails.endtime;
      let now = new Date().getTime();

      if(endtime < now) {
        await this.data("delete", "premium", `premium_${guildid}`, null)
        this.premiumend(guildid);
      }

    }
  }
  /* Premium Guilds Reload */

  /* Premium End */
  
  this.premiumend = async function(guildid) {
    await this.data("delete", "ultraprotect", `ultraprotect_${guildid}`, null);
    await this.data("delete", "spam", `spamprotect_${guildid}`, null);
  }
  
  /* Premium End */
  
  
  
  /* Premium Days Calculator */
  this.premiumdays = async function (guildid) {

    let premiumget = await this.data("fetch", "premium", `premium_${guildid}`, null);
    if(!premiumget) return "0";
    let premiumdetails = JSON.parse(premiumget);
    let premiumsure = premiumdetails.endtime

    return Math.floor(premiumsure / 1000)
  }
  /* Premium Days Calculator */

  /* Create Premium Code */
  this.createpremiumcode = async function (code, days) {
    await this.data("set", "premiumcode", `premiumcode_${code}`, days);
    return;
  }
  /* Create Premium Code */

  /* Search Premium Code */
  this.premiumcode = async function (code) {
    let getpremiumcode = await this.data("fetch", "premiumcode", `premiumcode_${code}`, null);


    return getpremiumcode


  }
  /* Search Premium Code */


  /* Random Geranator */
this.random = function(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLM0123456789NOPQRSTUVWXYZ';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
  charactersLength));
}
   return result;
}
  /* Random Geranator */

  /* error code */
  this.errorcode = function(number) {
    const errorcode = {
      title: `**${client.user.username} | Error**`,
      description: `An Internal Error Has Occurred! Your Code: (${number})`,
      footer: {
        text: this.footer
      },
      color: this.config.red
    }
    
    return errorcode;
  }
  /* error code */


  this.category = async function(category) {

    let file = require("../databases/commands.js")
    
    let arr = [];
    file.forEach((x) => {
      arr.push(x);
    })
    
    let filters = arr.filter((element => element.category == `${category}`));

    var commands = "";

    await filters.forEach((i) => {
        commands += `\`\`/${i.name}\`\` **➟** ${i.description}\n`;
    });
    
    let getlang = await this.getlang();

    return (commands) ? commands : this.lang(getlang, "commands_no");


  }

  this.formatter = function(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
  }

  this.edit = async function (response) {
    
    if(interaction.type == 2) return
    
    const data = typeof response === 'string' ? { content: response } : response;
    let channel = await this.channelget(interaction.guild_id, interaction.channel_id);
    let axiosurl = `https://discord.com/api/v8/webhooks/${client.user.id}/${interaction.token}/messages/@original`;
    return axios.patch(`${axiosurl}`, data).then((answer) => {
            return channel.messages.fetch(answer.data.id).catch(err => err + "1");
        }).catch(err => err + "1");
};


  this.getmoney = async function(userid) {
    
  let result = await this.data("fetch", "coin", `coin_${userid}`, null);

    /*if(result == NaN) {
      await this.data("set", "coin", `coin_${userid}`, "0");
      return 0;
    }*/

    if(!result) return Number(0);
    if(result) return Number(result);

  }
  
  this.getlevel = async function(userid) {
    
  let result = await this.data("fetch", "coin", `level_${userid}`, null);

    if(!result) return Number(0);
    if(result) return Number(result);

  }
  
  this.getcheese = async function() {
    
    return Number(0);
    
  }

  this.moneylogadd = async function(userid, type, money) {
    let logsmodal = require(`../databases/models/logs.js`);
    let logdate = new Date().getTime();

    await logsmodal.create({
      dataname: `coin_${userid}_${logdate}`,
      timestramp: logdate,
      data: `{ "timestramp": "${logdate}", "type": "${type}", "money": "${money}" }`
    });
    
    var cached = [];
    const cursor = logsmodal.find().cursor();
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      if(doc.dataname.startsWith(`coin_${userid}_`)) {
        let logdetails = JSON.parse(doc.data);
        let name = logdetails.timestramp;
        cached.push(logdetails);
      }
    }

    cached.sort(function(a, b){ 
      var ass = a.timestramp;
      var bsd = b.timestramp;
      return bsd - ass;
      });
    
    cached.forEach((logdetails, index) => {
      if(index >= 5) {
        this.data("delete", "logs", `coin_${userid}_${logdetails.timestramp}`, null)
      }
    });
    
    return true;

  }

  this.moneylogs = async function(userid) {
    let logsmodal = require(`../databases/models/logs.js`);
    const cursor = logsmodal.find().cursor();
    var logs = "";
    var cached = [];
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      if(doc.dataname.startsWith(`coin_${userid}_`)) {
        let logdetails = JSON.parse(doc.data);
        let name = logdetails.timestramp;
        //console.log("Fetched Log: " + name)
        cached.push(logdetails);
      }
    }

    cached.sort(function(a, b){ 
      var ass = a.timestramp;
      var bsd = b.timestramp;
      return bsd - ass;
      });

    cached.forEach((logdetails, index) => {
      
      
      if(index >= 5) {

        this.data("delete", "logs", `coin_${userid}_${logdetails.timestramp}`, null)

      } else {


    logs += `**${index + 1}.** - <t:${Math.floor((logdetails.timestramp / 1000) - 10)}:R> | **${logdetails.type}** | **${logdetails.money}**\n`;
      }
    });
    
    let getlang = await this.getlang();


    return (logs != "") ? logs : this.lang(getlang, "not_found");


  }


  this.options = function (name, sub = false, ultrasub = false) {
    
    if(interaction.type == 2) {
      if(!interaction.commandFile) return null; 
      let command = require(`../commands/${interaction.commandFile}`);
      if(!command) return null;
      
      
      if(sub) {
        if(ultrasub) {
          if(!interaction.options || !interaction.options[0] || !interaction.options[0].value) return null;
          let subcommand = interaction.options[0].value;
          if(String(subcommand) != ultrasub) return null;

          let shifted = interaction.options.slice(1);
          
          let getsub = command.help.options.find(x => x.name == ultrasub);
          
          let index = Number(getsub.options.findIndex(x => x.name == name));
          
          if(!shifted[index] || !shifted[index].type) return null;
          
          if(shifted[index].type != name) {
            return String(shifted[index].value);
          } else {
            return shifted[index].value;
          }
        } else {
          if(interaction.options && interaction.options[0] && interaction.options[0].value == name) return true;
          return false;
        }
      } else {
                
        let index = Number(command.help.options.findIndex(x => x.name == name));
      
        if(!interaction.options[index] || !interaction.options[index].type) return null;
        
        if(interaction.options[index].type != name) {
          return String(interaction.options[index].value);
        } else {
          return interaction.options[index].value;
        }
      }
    }
      
    if(!orginal.options) return null;
    if(sub) {
      if(ultrasub) {
        if(orginal.options._subcommand != ultrasub) return null;
        
        let getoption = orginal.options._hoistedOptions.filter(option => option.name === name);
        if(!getoption || !getoption[0] || !getoption[0].value) return null;
        let res = getoption[0]
        
        if(res.type == 'STRING') {
          return res.value;
        } else if (res.type == 'ROLE') {
          return res.role;
        } else if (res.type == 'CHANNEL') {
          return res.channel
        } else if (res.type == 'USER') {
          return res.member
        }
        return getoption[0].value;
      } else {
        if(orginal.options._subcommand == name) return true;
        return false;
      }
    } else {
      let getoption = orginal.options._hoistedOptions.filter(option => option.name === name);
      if(!getoption || !getoption[0] || !getoption[0].value) return null;
      let res = getoption[0]
        if(res.type == 'STRING') {
          return res.value;
        } else if (res.type == 'ROLE') {
          return res.role;
        } else if (res.type == 'CHANNEL') {
          return res.channel
        } else if (res.type == 'USER') {
          return res.member
        }
      return getoption[0].value;
    }

  }


  this.deletable = function() {
    const row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
        .setCustomId(`deletable`)
        .setLabel('❌')
        .setStyle(4)
    );

    return row;
  }
  
  
this.user = async function (trued = false) {
  
let userss = await client.shard.broadcastEval(c => c.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0));
let usersss = userss.reduce((acc, memberCount) => acc + memberCount, 0);
let users = String(usersss);
  
  if(trued != true) {
    let usersnov = users.split(",").join("");
    let user2 = usersnov * 2;
    return user2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    let usersnov = users.split(",").join("");
    let user2 = usersnov * 2;
    return user2;
  }
  
  
  /*
  if(trued != true) {
    let users = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString();
    let usersnov = users.split(",").join("");
    let user2 = usersnov * 2;
    return user2.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    let users = client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString();
    let usersnov = users.split(",").join("");
    let user2 = usersnov * 2;
    return user2;
  }*/
  
}
  
this.date = function() {
  
var date = new Date();

let year  = date.getFullYear();
let month = (date.getMonth() + 1).toString().padStart(2, "0");
let day = date.getDate().toString().padStart(2, "0");
  
return `${year}-${month}-${day}`;
  
}
  
this.dateget = function(timestramp) {
  
var date = new Date(timestramp);
  
let year  = date.getFullYear();
let month = (date.getMonth() + 1).toString().padStart(2, "0");
let day = date.getDate().toString().padStart(2, "0");
  
let hours = date.getHours().toString().padStart(2, "0");
let minutes = date.getMinutes().toString().padStart(2, "0");
  
return `${year}.${month}.${day} - ${hours}:${minutes}`;
  
}
  
this.guilds = async function (trued = false) {
  
  let ress = await client.shard.fetchClientValues("guilds.cache.size");
  let res = ress.reduce((p, n) => p + n, 0);
  
  if(trued != true) {
    return res.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return res;
  }
  
}
  
this.channels = async function (trued = false) {
  
let ress = await client.shard.fetchClientValues("channels.cache.size");
let res = ress.reduce((p, n) => p + n, 0);

  if(trued != true) {
    return res.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return String(res);
  }
  
}
  
this.webmoneylogs = async function(userid) {
    let cached = []; 
    
    let logsmodal = require(`../databases/models/logs.js`);
    const cursor = logsmodal.find().cursor();
    var logs = "";
    var i = 0;
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      if(doc.dataname.startsWith(`coin_${userid}_`)) {
        cached.push(doc.data)
      }
    }
  
    cached.sort(function(a, b){ 
      var parse1 = JSON.parse(a);
      var parse2 = JSON.parse(b);
      var ass = parse1.timestramp;
      var bsd = parse2.timestramp;
      return Number(bsd) - Number(ass);
      });
  
  
  
  
var result = "";
cached.forEach(y => {

var z = JSON.parse(y);
result += `<tr>
  <td>${this.dateget(Number(z.timestramp))}</td>
  <td>${this.filter(z.type)}</td>
  <td>${z.money}</td>
</tr>`;
});

  return result;
  
}
  
  
this.randomnum = function(length) {
  var result = Math.floor(Math.random() * length) + 1;
   return result;
}

  
this.dcuserget = async function(id) {
  return await axios.get(`https://discord.com/api/v8/users/${id}`, {
    headers: {
      'Authorization': `Bot ${process.env.token}`
    }
  }).then(x => {
    return x.data;
  }).catch(err => err + "1");
  
}

this.supporters = async function() {
  
let votes = require(`../databases/models/votes.js`);
const cursor = votes.find().cursor();
let result = [];
for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
  let userid = doc.dataname.split("_")[1];
  let user = await this.dcuserget(userid);
  if(!user || !user.username) continue;
  let timestramp = doc.timestramp;
  var json = {
    "username": `${this.filter(user.username + "#" + user.discriminator)}`,
    "timestramp": timestramp,
    "count": this.filter((doc.count) ? doc.count : 1)
  }
  result.push(json);
  
}
  
    result.sort(function(a, b){ 
      var ass = a.timestramp;
      var bsd = b.timestramp;
      return bsd - ass;
      });
  
  return result;
  
  
}  

this.supporteradd = async function(userid) {
  
    let logsmodal = require(`../databases/models/votes.js`);
    let logdate = new Date().getTime();
  
      const doc = await logsmodal.findOne({ dataname: { $eq: `vote_${userid}` } }).lean();
  
      if (!doc) {
        await logsmodal.create({
          dataname: `vote_${userid}`,
          timestramp: logdate,
          count: 1
        });
      } else {
          let nowcount = (doc.count) ? doc.count : 1;
          let totalcount = Number(nowcount) + 1;
          await logsmodal.findOneAndUpdate({ dataname: { $eq: `vote_${userid}` } }, { timestramp: logdate, count: totalcount }).lean();
      }
  
  
  return true;
  
}  
  
/*this.guildget = async function(id) {
  
    const req = await client.shard.broadcastEval((c, id) => c.guilds.cache.get(id), { context: id });

    return req.find(res => !!res) || null;

    let server = client.guilds.cache.get(id);
    return server;
}*/
  
this.memberget = async function(guildid, id) {
  
    let req = await client.shard.broadcastEval(async (c, { guildid, id }) => {
        let guild = await c.guilds.cache.get(guildid)
        if (guild) {
            let res = await guild.members.cache.get(id);
            return res;
        }
    }, { context: { guildid, id } })
  
    return req.find(res => !!res) || null;

    /*let server = client.guilds.cache.get(id);
    return server;*/
}
  
this.getmember = async function(userid) {
  
let guild = await this.guildget();
  
return await guild.members.fetch(userid).then(x => {
                    return x;
                  }).catch(err => {
  err + "1";
  return null;
});
  
}
  
this.getmemberg = async function(guild, userid) {
  
return await guild.members.fetch(userid).then(x => {
                    return x;
                  }).catch(err => {
  err + "1";
  return null;
});
  
}
  
this.userget = async function(id) {
    let req = await client.shard.broadcastEval(async (c, { id }) => {
        let user = await c.users.cache.get(id)
        if (user) {
            return user;
        }
    }, { context: { id } })
    return req.find(res => !!res) || null;
}

  
this.guildget = async function() {
  let guild = (interaction.guild) ? interaction.guild : (orginal) ? orginal.guild : (interaction) ? interaction : null;
  if(!guild) return null;
  return guild;
  /*var test;
    let req = await client.shard.broadcastEval(async (c, { id, test }) => {
        let channel = await c.channels.cache.get(id);
        if (channel) {
            let guild = channel.guild;
            return guild;
        }
    }, { context: { id, test } }).then(a=> console.log(a))
    let guild = req.find(res => !!res) || null;
    return guild;*/
}
  
this.serverget = async function(id) {
    let req = await client.shard.broadcastEval(async (c, id) => {
        let guild = await c.guilds.cache.get(id);
        if (guild) {
            return guild;
        }
    }, { context: id });
  
    let guild = req.find(res => !!res) || null;
    return guild;
}
  
this.webprotect = async function(guildid, userid) {
  
    let fetchedwebprotect = await this.data("fetch", "webprotect", `webprotect_${guildid}`, null);
    if (!fetchedwebprotect) return 8;
    let fetchedwebprotectparseds = JSON.parse(fetchedwebprotect);
  
    let getlang = await this.getlang(false, guildid); 
    const success = {
      description: this.lang(getlang, "webprotect_success", this.filter(userid)),
      footer: {
        text: this.footer
      },
      color: this.config.green
    }
    const embeds = {
      embed: success,
      content: this.lang(getlang, "webprotect_run_title", this.filter(userid))
    }
  
    let req = await client.shard.broadcastEval(async (c, json) => {
      let { guildid: getguildid, userid: getuserid, fetchedwebprotectparseds: fetchedwebprotectparsed, embeds: embed } = json;
      
        let guild = await c.guilds.cache.get(getguildid);
        if (guild) {
            let member = await guild.members.fetch(getuserid).catch(err => err + "1");
            if(member && member.id && !member.user.bot) {
              let controlrole = await member.roles.cache.get(fetchedwebprotectparsed.role);
              if(!controlrole) {
              
                let catchs = 6;
                
                if(fetchedwebprotectparsed.role2) {
                  await member.roles.add(fetchedwebprotectparsed.role2).catch(err => {
                    catchs = 3;
                    err + "1";
                  });
                }
                await member.roles.add(fetchedwebprotectparsed.role).catch(err => {
                  catchs = 3;
                  err + "1";
                });
                
                if(catchs != 3) {
                  let channel = await guild.channels.cache.get(fetchedwebprotectparsed.channel);
                  if(channel) {
                    channel.send({ content: embed.content, embeds: [embed.embed] });
                  }
                  return member.user;
                } else {
                  return catchs;
                }
              } else {
                return 2;
              }
            } else {
              return 1;
            }
        }
    }, { context: { guildid, userid, fetchedwebprotectparseds, embeds } });
  
    let guild = req.find(res => !!res) || 4;
    return guild;
}
  
this.channelget = async function(guildid, channelid) {
    let guild = await this.guildget();
    if(!guild) return null;
    let channel = guild.channels.cache.get(channelid);
         
    return channel;
}

  
this.permissionget = function(bitfield) {

  
	bitfield = BigInt(bitfield);
	let perms = {
		CREATE_INSTANT_INVITE: 0x0000000001n,
		KICK_MEMBERS: 0x0000000002n,
		BAN_MEMBERS: 0x0000000004n,
		ADMINISTRATOR: 0x0000000008n,
		MANAGE_CHANNELS: 0x0000000010n,
		MANAGE_GUILD: 0x0000000020n,
		ADD_REACTIONS: 0x0000000040n,
		VIEW_AUDIT_LOG: 0x0000000080n,
		PRIORITY_SPEAKER: 0x0000000100n,
		STREAM: 0x0000000200n,
		VIEW_CHANNEL: 0x0000000400n,
		SEND_MESSAGES: 0x0000000800n,
		SEND_TTS_MESSAGES: 0x0000001000n,
		MANAGE_MESSAGES: 0x0000002000n,
		EMBED_LINKS: 0x0000004000n,
		ATTACH_FILES: 0x0000008000n,
		READ_MESSAGE_HISTORY: 0x0000010000n,
		MENTION_EVERYONE: 0x0000020000n,
		USE_EXTERNAL_EMOJIS: 0x0000040000n,
		VIEW_GUILD_INSIGHTS: 0x0000080000n,
		CONNECT: 0x0000100000n,
		SPEAK: 0x0000200000n,
		MUTE_MEMBERS: 0x0000400000n,
		DEAFEN_MEMBERS: 0x0000800000n,
		MOVE_MEMBERS: 0x0001000000n,
		USE_VAD: 0x0002000000n,
		CHANGE_NICKNAME: 0x0004000000n,
		MANAGE_NICKNAMES: 0x0008000000n,
		MANAGE_ROLES: 0x0010000000n,
		MANAGE_WEBHOOKS: 0x0020000000n,
		MANAGE_EMOJIS_AND_STICKERS: 0x0040000000n,
		USE_APPLICATION_COMMANDS: 0x0080000000n,
		REQUEST_TO_SPEAK: 0x0100000000n,
		MANAGE_THREADS: 0x0400000000n,
		USE_PUBLIC_THREADS: 0x0800000000n,
		USE_PRIVATE_THREADS: 0x1000000000n,
		USE_EXTERNAL_STICKERS: 0x2000000000n,
	};
	return Object.entries(perms)
		.filter(([_perm_name, perm_bitfield]) => {
			return (bitfield & perm_bitfield) == perm_bitfield;
		})
		.map(([perm]) => perm);
  
}
  
this.term = function() {
  
return new Promise(async(resolve, reject) => {
let userid = (!interaction.author) ? interaction.member.user.id : interaction.author.id;

let control = await this.data("fetch", "uses", `uses_${userid}`, null);
if(control) return resolve(true);
  
const row = new Discord.MessageActionRow()
.addComponents(
  new Discord.MessageButton()
    .setCustomId(`verification_${userid}`)
    .setLabel('✅')
    .setStyle(3)
)
.addComponents(
  new Discord.MessageButton()
    .setCustomId(`noverification_${userid}`)
    .setLabel('❌')
    .setStyle(4)
);
  
let getlang = await this.getlang();
  
let acceptted = await this.data("count", "uses", "");
  
const info = {
  title: `**${client.user.username} | ${this.lang(getlang, "info")}**`,
  description: this.lang(getlang, "term_policies_desc", userid, this.config.email, acceptted),
  footer: {
    text: this.footer
  },
  color: this.config.blue
}


await this.send({ embeds: [info], components: [row] });
  
resolve(false);
})
  
  
}
  
  
this.lang = function(getlang, term, ...vars) {
  
let guildid;
  
if(interaction && interaction.guild_id) {
  guildid = interaction.guild_id;
} else if (interaction && interaction.guild && interaction.guild.id) {
  guildid = interaction.guild.id;
} else {
  guildid = "null";
}
  
let lang = getlang;
  

let strings = require("../databases/lang.js");

// Function to get locales and replace variables
function getLocale(language, string) {
   let getting = strings(language);
   let locale = getting[string];
   if(!locale || locale == undefined) return null;
  
   let count = 0;
   let arr = [];
   locale = locale.replace(/%var%/g, (c, ca) => {
     arr.push(c);
     count++;
     return String(((vars[count - 1]) ? vars[count - 1] : "%var%"));
    });

   return locale;
}

let result = getLocale(String(lang), String(term));
  
return result;
  
}
  
this.getlang = async function(falsed = true, serverid = null) {
  
  if(!serverid) {
  
    if(falsed == true) {

      let guildid;

      if(interaction && interaction.guild_id) {
        guildid = interaction.guild_id;
      } else if (interaction && interaction.guild && interaction.guild.id) {
        guildid = interaction.guild.id;
      } else {
        return String(this.config.defaultlang);
      }

      let lang = await this.data("fetch", "lang", `lang_${guildid}`, null);
      let res = this.config.defaultlang;

      if(lang && lang != this.config.defaultlang) res = lang;

      return String(res);
    } else {
      return String(this.config.defaultlang)
    } 
  } else {
    let lang = await this.data("fetch", "lang", `lang_${serverid}`, null);
    if(lang) return lang;
    return this.config.defaultlang;
  }
}
  
this.dmterm = function() {
  
return new Promise(async(resolve, reject) => {
let userid = interaction.author.id;

let control = await this.data("fetch", "uses", `uses_${userid}`, null);
if(control) return resolve(true);
  
const row = new Discord.MessageActionRow()
.addComponents(
  new Discord.MessageButton()
    .setCustomId(`verification_${userid}`)
    .setLabel('✅')
    .setStyle(3)
)
.addComponents(
  new Discord.MessageButton()
    .setCustomId(`noverification_${userid}`)
    .setLabel('❌')
    .setStyle(4)
);
  
let getlang = await this.getlang(false);
  
let acceptted = await this.data("count", "uses", "");
  
const info = {
  title: `**${client.user.username} | ${this.lang(getlang, "info")}**`,
  description: this.lang(getlang, "term_policies_desc", userid, this.config.email, acceptted),
  footer: {
    text: this.footer
  },
  color: this.config.blue
}
let interactionchannel = interaction.channel;
if(!interactionchannel) return;
  
await interactionchannel.send({ embeds: [info], components: [row] });
  resolve(false);
})
  
  
}
  
this.captcha = function() {
  
let file = require("../databases/captcha.json");
const random = Math.floor(Math.random() * file.length);
let res = file[random];
return res;
  
  
}
  
  
this.nodereload = async function() {

  client.shard.broadcastEval(async(c, config) => {
  
    
    if(!c.guilds.cache.get(config.supportguildid)) return;
    
    const axios = require("axios");
    
    let datetime = new Date().getTime();
    //datetime += (3 * 60 * 60 * 1000);
    let date = new Date(datetime);

    let year  = date.getFullYear();
    let month = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    let day = date.getDate().toString().padStart(2, "0");

    let hours = date.getHours().toString().padStart(2, "0");
    let minutes = date.getMinutes().toString().padStart(2, "0");

    
    let uptimenode = await axios.get(config.web.uptimepath).catch(err => err + "1");
    let apinode = await axios.get(`${config.web.apipath}/status`).catch(err => err + "1");

    let online = ":green_circle: Online";
    let ofline = ":red_circle: Offline";
    let wrong = ":orange_circle: Wrong";
    
    let onlineping = function() {
      return Math.floor(Math.random() * 60) + 20;
    }
    
    let premiumping = function() {
      return Math.floor(Math.random() * 5) + 10;
    }
    
    let wrongping = function() {
      return Math.floor(Math.random() * 100) + 100;
    }
    
    let oflineping = function() {
      return Math.floor(Math.random() * 300) + 550;
    }

    const embed = {
      author: {
        name: `CsYBot Nodes Status`,
      },
      description: `**__Nodes:__**
  **Node 1:** ${online} [\`\`${onlineping()}ms\`\`]
  **Node 2:** ${online} [\`\`${onlineping()}ms\`\`]
  **Node 3:** ${online} [\`\`${onlineping()}ms\`\`]
  \n**__Donator Nodes:__**
  **Dono-01:** ${online} [\`\`${premiumping()}ms\`\`]
  **Dono-02:** ${online} [\`\`${premiumping()}ms\`\`]
  \n**__Datas:__**
  **Mongodb Database:** ${online} [\`\`${premiumping()}ms\`\`]
  **Mysql Database:** ${ofline} [\`\`${oflineping()}ms\`\`]
  **Ftp Server:** ${online} [\`\`${onlineping()}ms\`\`]
  **Cache Server:** ${online} [\`\`${onlineping()}ms\`\`]
  \n**__Misc:__**
  **Uptime Servers:** ${(uptimenode) ? online : wrong}
  **Mail Server:** ${online}
  **Brain Server:** ${(config.dependencies.smart_chatbot.problem == true) ? wrong : online} [\`\`${(config.dependencies.smart_chatbot.problem == true) ? wrongping() : premiumping()}ms\`\`]
  **Api Server:** ${(apinode) ? online : wrong} [\`\`${onlineping()}ms\`\`]`,
      footer: {
        text: `Update at ${hours}:${minutes} (GMT) on ${day} ${month} ${year}`
      },
      color: config.black
    }

  c.guilds.cache.get(config.supportguildid).channels.cache.get("849949734742786068").messages.fetch({around: "849988305705762828", limit: 1}).then(msg => {
          const msgs = msg.first();
          if(!msgs) return console.log(`[CsYBot] Node Status Failing. Pls Renew ch, msg, ids. [./functions/global.js:1152]`);
          msgs.edit({ embeds: [embed] }).catch(err => err + "1");
    }).catch(err => err + "1");
  


  }, { 
        context: this.config
  });
  
}
  
const translator = require('@vitalets/google-translate-api')
  
this.translate = async function(string, language) {
  let translation = await translator(string, { to: language }).catch(e => e + "1");
  return translation.text;
}
  
this.langreload = function() {
  
fs.readdirSync(path.join(__dirname, "/../databases/langs/")).forEach(async(file) => {
   let direct = path.join(__dirname, "/../databases/langs/" + file);
   fs.stat(direct, async function (ms, m) {
   var mm = m.mtime.getTime();
   var now = new Date().getTime();
   //if((mm + 32400000) < now) {
   //if((mm + 10) < now) {
     fs.readFile(direct, 'utf8', async function(err, data) {
        let ff = await axios.get(`https://raw.githubusercontent.com/CsYBot/CsYBot/master/language/${file}`).catch(err => err + "1");
        if(ff.status != 200) {
           await fs.unlinkSync(direct);
           console.log("[FILE] lang (" + file + ") Passed Deleted! (NOT)");
        } else {
        if(String(ff.data) != String(data)) {
           console.log("[FILE] lang (" + file + ") Downloading..!");
           fs.writeFile(direct, String(ff.data), function(err, result) {
             if(err) {
                console.log("[FILE] lang (" + file + ") Passed! (ERR)");
             } else {
                console.log("[FILE] lang (" + file + ") Modified!");
             }
           });
        } else {
           console.log("[FILE] lang (" + file + ") Passed! (SAME)");
        }
       }
     });
   /*} else {
     console.log("[FILE] lang (" + file + ") Passed! (TIME)");
   }*/
  });
});

axios.get(`https://api.github.com/repos/CsYBot/CsYBot/contents/language`).then(async(x) => {
  await x.data.forEach(async(y) => {
    var direct = path.join(__dirname, "/../databases/langs/" + y.name);
    if(!fs.existsSync(direct) && y.name != "api.js") {
       var ff = await axios.get(`https://raw.githubusercontent.com/CsYBot/CsYBot/master/language/${y.name}`).catch(err => err + "1");
       fs.writeFile(direct, ff.data, function(err, result) {
         if(err) {
           console.log(err)
           console.log("[FILE] lang (" + y.name + ") creating.. Passed! (ERR)");
         } else {
           console.log("[FILE] lang (" + y.name + ") Created!");
         }
       });
    }
  });
});
  
  return true; 
  
}
  
this.draw = async function(channelid, messageid) {
  let channel = interaction.guild.channels.cache.get(String(channelid));
  if(!channel) return "Channel Not Working";
  
  let message = await channel.messages.fetch({around: `${messageid}`, limit: 1}).catch(err => err + "1");
  if(!message || !message.first()) return "Message Not Working";
  message = message.first();
  
  let unreacts = message.reactions.cache.filter(x => x.id != this.config.botid);
  let reacts = unreacts.first();
  let reactusers = await reacts.users.fetch().catch(err => err + "1");
  
  let giveaways = [];
  await reactusers.forEach(user => {
    giveaways.push(user);
  });
  
  let giveawayslist = giveaways.filter(x => x.id != this.config.botid && x.bot == false);
  
  this.randomarr(giveawayslist);
  
  let winuser = giveawayslist[0];
  
  let taganduser = String(winuser.username) + '#' + String(winuser.discriminator);
  
  await message.reply({ content: `<@${winuser.id}>, ${taganduser} Win!`, allowedMentions: { repliedUser: true }});
  
  return `${taganduser} | #${channel.name}`;
    
    //!eval csybot.draw("817086184953741323", "953723410737934376").then(x => x);
  
}
  
this.randomarr = function(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
  
this.shortlinkcontrol = async function(shorted, linking = true) {
  let links = await this.data("starts", "shortlink", "link");

  if(linking == true) {
    let result = await links.find(x => {
      let data = JSON.parse(x.data);
      if(data.shorted == shorted) return true;
      return false;
    });

    return (result) ? result : false;
    
  } else {
    let result = await links.find(x => {
      let data = JSON.parse(x.data);
      if(data.link == shorted) return true;
      return false;
    });

    return (result) ? result : false;
  }
}
  
  
  
this.shortlink = async function(number = 0) {
  return new Promise(async(resolve, reject) => {
    let createnumber = (number == 0) ? 5 : number
    let createdshort = this.random(createnumber).toLowerCase();
    let control = await this.shortlinkcontrol(createdshort);
    if(control != false) return resolve(await this.shortlink((createnumber + 1)));
    resolve(createdshort);
  });
}
  
this.urlcontrol = function(url) {
  var res = url.match(/http(s)?:\/\/.?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
  return (res == null) ? false : res[0];
}
  
  
this.cooldown = async function(id, lang) {
  let data = await this.data("fetch", "cooldown", `${id}`, null);
  
  if(!data) {
    let now = new Date().getTime();
    await this.data("set", "cooldown", `${id}`, `${now}`);
    return false;
  } else {
    let starttime = Number(data);
    let now = new Date().getTime();
    if((starttime + this.config.cooldown) < now) {
      await this.data("delete", "cooldown", `${id}`, null);
      return false;
    } else {
      
      let ress = (starttime + this.config.cooldown) - now

      var seconds = ress / 1000;
      let res = String(seconds).slice(0,3);

        const info = {
          title: `**${client.user.username} | ${this.lang(lang, "cooldown_title")}**`,
          description: this.lang(lang, "cooldown", this.filter(res)),
          footer: {
            text: this.footer
          },
          color: this.config.blue
        }

        return info;
    }
  }
}
  
this.cooldownreload = async function() {
  let datas = await this.data("starts", "cooldown", null)
  
  for (var i = 0; i < datas.length; i++) {
    let starttime = Number(datas[i].data);
    let now = new Date().getTime();
    if((starttime + this.config.cooldown) < now) {
      this.data("delete", "cooldown", `${datas[i].dataname}`);
    }
  }
  return true;
}
  
this.controls = async function(guildid, userid, type) {
  let mycontrolers = require("./controls.js")
  let mycontrolersresult = await mycontrolers(client, this, guildid, userid, type);
  let result = (mycontrolersresult == false) ? false : mycontrolersresult;
  
  return result;
}
  
this.topgg = function() {
  return new Promise(async(res, rej) => {
    var postData = {
      server_count: await this.guilds(),
      shard_count: client.shard.count
    };

    let header = {
      headers: {
          'Authorization': `${this.config.topggtoken}`,
          'Content-Type': 'application/json'
      }
    };

    let response = await axios.post('https://top.gg/api/bots/stats', JSON.stringify(postData), header).catch(err => err + "1")
     res((response && response.data) ? true : false);
  });
}
  
}