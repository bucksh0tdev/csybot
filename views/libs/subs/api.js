const request = require("request");
const Discord = require("discord.js");
const express = require("express");
const path = require("path");
const passport = require("passport");
const fs = require("fs");
const rateLimit = require("express-rate-limit");
const global = require("../../../functions/global.js");
const brainfun = require("../../../functions/brain.js");
const sharp = require('sharp');
const axios = require('axios');
const brain = new brainfun();
module.exports = function(client, realapp, app, panel) {
const csybot = new global(null, null);

app.get("/", async(req, res) => {
  if(csybot.config.maintenance.web == true) return res.status(200).json({ "message": `${csybot.config.maintenance.web_message}`, "code": 404 });
  
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  res.json({
    "message": "404: Not Found", 
    "code": 0
  });
});
  
  
app.use('/libs/css', express.static(path.join(__dirname, '../css')))
app.use('/libs/js', express.static(path.join(__dirname, '../js')))
app.use('/libs/img', express.static(path.join(__dirname, '../img')))
  
app.get("/download/:userid/:secret", async(req, res) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  let userid = req.params.userid;
  let secret = req.params.secret;
  
  if(!userid || !secret) return;
  
  let secretcontrol = await csybot.data("fetch", "secretkeys", `secret_${secret}`, null);
  if(!secretcontrol) return res.status(200).json({
      "message": "404: Secret Key Or User ID Not Found",
      "code": 7
  });
  let secretdetails = JSON.parse(secretcontrol);

  if(!secretdetails || !secretdetails.ownerid || secretdetails.ownerid != userid) {
    res.json({
        "message": "404: Secret Key Or User ID Not Found",
        "code": 7
    });
  } else {
    var allitems = require("../../../databases/shop.json");
    var item = allitems.find(el => el.id === Number(secretdetails.item));
    
    let pathdir = `../../../databases/download/${item.download}`;
        
    if(!fs.existsSync(path.join(__dirname, `${pathdir}`))) return res.status(404).json({
      "message": "FILE NOT FOUND IN SERVER!",
      "code": 404
    });
    
    res.download(path.join(__dirname, `${pathdir}`), `${item.download}`);
  }
});
  
// app.all("/mc.jar", async(req, res) => {


//     let pathdir = `../../../asset/1.11.2 - CsYCraft.jar`;
        
//     if(!fs.existsSync(path.join(__dirname, `${pathdir}`))) return res.status(404).json({
//       "message": "FILE NOT FOUND IN SERVER!",
//       "code": 404
//     });
    
//     res.download(path.join(__dirname, `${pathdir}`), `1.11.2 - CsYCraft.jar`);
// });
  
  
app.all("/uptime", async(req, res) => {
  
    await panel.uptime();
    res.send(`{"message":"All Project Uptimed!","code":200}<script>setTimeout(function() { window.location.href = "https://api.csycraft.com/uptime" }, (2 * 60 * 1000))</script>`);
});
  
app.all("/chatbot", async(req, res) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  if(csybot.config.dependencies.smart_chatbot.problem == true) return res.status(200).json({ "message": `Sorry, maintenance mode is enabled. Contact for details!`, "code": 200 });
  
let message = csybot.filter(req.query.message);
let userid = csybot.filter(req.query.user);
let sbotname = csybot.filter(req.query.botname);
  
  
let sgender = csybot.filter(req.query.gender);
let slocation = csybot.filter(req.query.location);
let semail = csybot.filter(req.query.email);
let sbirth = csybot.filter(req.query.birth);
  
var datasing = {
  gender: sgender,
  birth: sbirth,
  location: slocation,
  email: semail
}
  
  
if(!sgender || typeof sgender != "string" || (sgender != "female" && sgender != "male")) datasing.gender = null;
if(!slocation || typeof slocation != "string" || slocation.length > 20) datasing.location = null;
if(!semail || typeof semail != "string" || semail.length > 25) datasing.email = null;
if(!sbirth || typeof sbirth != "string" || sbirth.length > 20) datasing.birth = null;

let lang = String(csybot.config.defaultlang);
let reslang = csybot.filter(req.query.language);
lang = reslang;
if(!reslang || (!csybot.config.dependencies.smart_chatbot.supported_langs.includes(reslang))) lang = csybot.config.defaultlang;
  
if(!message || typeof message != "string" || !userid) return res.json({
  "message": "Formless Question",
  "code": "403"
});
let secret = req.get('Authorization');
let version = req.get('Version');
let agent = req.get('using');
let botname = String(csybot.config.botname);
if(sbotname && sbotname != undefined && sbotname != null && sbotname.length < 20 && sbotname != "undefined") botname = sbotname;
if(!agent || (agent != "bdfd" && agent != "npm")) return res.json({
  "message": "You Agent Problem!",
  "code": "403"
});
let sownername = csybot.filter(req.query.ownername);
let ownername = csybot.config.ownername;
if(sownername && sownername != undefined && sownername != null && sownername.length < 20) ownername = sownername;
let secretjson = {
    "message": "404: Secret Code Not Found! For New Secret Key: "+csybot.config.panel+"/panel/smart-chatbot", 
    "code": 203
};
var versionjson = {
    "message": "[smart-chatbot] Problem", 
    "code": 204
};
  
if(agent == "bdfd") {
  versionjson = {
      "message": "[smart-chatbot] Please Update Package! Dm me (bucksh0t#8720)", 
      "code": 205
  };
} else {
  versionjson = {
      "message": "[smart-chatbot] Please Update Package! (npm install smart-chatbot@" + csybot.config.dependencies.smart_chatbot.version + ")", 
      "code": 205
  };
}
  
if(!secret) return res.status(200).json(secretjson);
if(!version) return res.status(200).json(versionjson);
  
if(csybot.config.dependencies.smart_chatbot.version != version) return res.status(200).json(versionjson);
  
let smartchatbot = require(`../../../databases/models/smart-chatbot.js`);
let secretcontrol = await smartchatbot.findOne({ key: { $eq: secret } }).lean();
  
if(!secretcontrol) return res.status(200).json(secretjson);
  
if(message.length > 100 || userid.length > 20 || botname > 30) return res.status(200).json({
  "message": "Formless Question",
  "code": "403"
});
  
  let secretdetails = {
    lastip: secretcontrol.lastip,
    banned: secretcontrol.banned,
    ratelimit: secretcontrol.ratelimit,
    banreason: secretcontrol.banreason,
    ipchange: secretcontrol.ipchange
  }
  
  let machinaip = botname;

  
  if(secretdetails.banned && secretdetails.banned == true) return res.status(200).json({
    "message": `Hello, this api key seems to be banned. Reason (${(secretdetails.banreason) ? secretdetails.banreason : "No Reason!"})`, 
    "code": 200,
    "ratelimit": secretdetails.ratelimit
  });
  
  if(secretdetails.lastip && secretdetails.ipchange && secretdetails.ipchange >= 4) {
    secretdetails.lastip = machinaip;
    secretdetails.banned = true;
    secretdetails.banreason = "Secret Key Max Change Ip!";
    secretdetails.ipchange = 1;
    
    await smartchatbot.findOneAndUpdate({ "key": secret }, { "$set": { "lastip": secretdetails.lastip, "banned": secretdetails.banned, "ratelimit": secretdetails.ratelimit, "banreason": secretdetails.banreason, "ipchange": secretdetails.ipchange}})
    

let fulldate = new Date();
let date = `${fulldate.getFullYear()}${fulldate.getDate()}${fulldate.getHours()}`;
  
const webhook = new Discord.WebhookClient({ url: csybot.config.dependencies.smart_chatbot.webhook });
const embed = {
	color: csybot.config.blue,
	author: {
		name: 'Smart ChatBot Ban API',
	},
	fields: [
		{
			name: 'secretkey:',
			value: secret,
			inline: false,
		},
    {
      name: "Agent:",
      value: agent
    }
	],
	footer: {
		text: csybot.footer,
	},
};
webhook.send({ embeds: [embed] });
    
    return res.status(200).json({
        "message": `Hello, this api key seems to be banned. Reason (${(secretdetails.banreason) ? secretdetails.banreason : "No Reason!"})`, 
        "code": 200,
        "ratelimit": secretdetails.ratelimit
    });
  } else if (secretdetails.lastip && secretdetails.ipchange && secretdetails.lastip != machinaip) {
    secretdetails.ipchange++;
  } else {
    secretdetails.ipchange = 1;
  }
    secretdetails.lastip = machinaip
  
  
let votemodel = require("../../../databases/models/votes.js");
  
let muaf = [
  "307886481920229376"
];
  
if (!muaf.includes(secretcontrol.owner)) {
  if(secretdetails.ratelimit && secretdetails.ratelimit >= 19) {
    secretdetails.ratelimit = 0;
    res.status(200).json({
      "message": "AD! Join Our Server? Add your bot? https://discord.gg/H9ttYFbGUV | You can buy this message!",
      "code": 200,
      "ratelimit": Number(20)
    });
    await smartchatbot.findOneAndUpdate({ "key": secret }, { "$set": { "lastip": secretdetails.lastip, "banned": secretdetails.banned, "ratelimit": secretdetails.ratelimit, "banreason": secretdetails.banreason, "ipchange": secretdetails.ipchange}})
    return;
  } else {
    secretdetails.ratelimit = (secretdetails.ratelimit) ? secretdetails.ratelimit + 1 : 1;
    await smartchatbot.findOneAndUpdate({ "key": secret }, { "$set": { "lastip": secretdetails.lastip, "banned": secretdetails.banned, "ratelimit": secretdetails.ratelimit, "banreason": secretdetails.banreason, "ipchange": secretdetails.ipchange}})
  }
}
  
  
let fulldate = new Date();
let date = `${fulldate.getFullYear()}${fulldate.getDate()}${fulldate.getHours()}`;
  
const webhook = new Discord.WebhookClient({ url: csybot.config.dependencies.smart_chatbot.webhook });
const embed = {
	color: csybot.config.blue,
	author: {
		name: 'Smart ChatBot API',
	},
	fields: [
		{
			name: 'message:',
			value: csybot.filter(message),
		},
		{
			name: 'secretkey:',
			value: secret,
			inline: false,
		},
    {
      name: "Agent:",
      value: agent
    }
	],
	footer: {
		text: csybot.footer,
	},
};
webhook.send({ embeds: [embed] });
  
let reply = await brain.chat(csybot.filter(message), csybot.filter(String((userid) ? userid : date) + "3131csy3131"), botname, ownername, csybot.filter(lang), datasing);


  
res.status(200).json({
  "message": reply,
  //"message": "Ping Api Problem! (530ms)!",
  "code": 200,
  "ratelimit": Number(secretdetails.ratelimit)
})
  
});
  
app.all("/chatbot/langs", async(req, res) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  let arr = String(csybot.config.dependencies.smart_chatbot.supported_langs);
  res.status(200).send("[" + arr + "]");
});
  

  
app.all('/img/resize', (req, res) => {

  const widthString = req.query.width
  const heightString = req.query.height

  let width, height
  if (widthString) {
    width = parseInt(widthString)
  }
  if (heightString) {
    height = parseInt(heightString)
  }

  res.type(`image/png`);

  function resize(path, width, height) {
  const readStream = fs.createReadStream(path)
  let transform = sharp()

  if (width || height) {
    transform = transform.resize(width, height)
  }

  return readStream.pipe(transform)
}
  
  resize(path.join(__dirname, "/../img/logo.png"), width, height).pipe(res)
});
  
app.post("/dblwebhook", async function (req, res, next) {
  
  if(!client || !client.user || !client.user.id) return;
  
  let user = (req.body && req.body.user) ? csybot.filter(req.body.user) : false;
  let secret = req.get('Authorization');
  if(user == false || !secret || secret != csybot.config.topggpass) return;
  
  let getmodel = require("../../../databases/models/votes.js");
  const doc = await getmodel.findOne({ dataname: { $eq: `vote_${user}` } }).lean();
  let now = new Date().getTime();
  
  let hours = 43200000;
  
  const votecontrol = (doc) ? (((Number(doc.timestramp) + hours) > now) ? false : true) : true;
  
  if(votecontrol != true && req.body && req.body.type && req.body.type != "test") return; 
  
  await csybot.data("add", "coin", `coin_${user}`, csybot.config.topggrecive);
  await csybot.moneylogadd(user, `VOTE`, `+${csybot.config.topggrecive}`)
  await csybot.supporteradd(user);
  
  const updatedoc = await getmodel.findOne({ dataname: { $eq: `vote_${user}` } }).lean();
  
  let uservotes = (updatedoc && updatedoc.count) ? updatedoc.count : 0;
  
  let userget = await csybot.dcuserget(csybot.filter(user));
  let botget = await csybot.dcuserget(csybot.filter(csybot.config.botid));
  if(!userget || !botget) return;
  
  let control2 = await axios.get(`https://top.gg/api/bots/${csybot.filter(botget.id)}`, {
    headers: {
      'Authorization': csybot.config.topggtoken
    }
  }).catch(err => err + "1");
  
  const webhook = new Discord.WebhookClient({ url: csybot.config.vote_tracker_webhook });
  const embed = {
    color: csybot.config.green,
    title: `**Thank you for voting for ${csybot.filter(botget.username)}#${csybot.filter(botget.discriminator)}${req.body.type == "test" ? " (Test)" : ""}**`,
    fields: [
      {
        name: 'User:',
        value: `\`\`${csybot.filter(userget.username)}#${csybot.filter(userget.discriminator)} (id:${csybot.filter(userget.id)})\`\``,
      },
      {
        name: 'User Votes:',
        value: `${csybot.filter(uservotes)}`,
      },
      {
        name: 'Total Votes:',
        value: `${(!control2 || !control2.data || !control2.data.points) ? 0 : csybot.filter(control2.data.points)}`,
      }
    ],
    footer: {
      text: csybot.footer,
    },
  };
  webhook.send({ content: `<@${csybot.filter(userget.id)}>, Thank You for Voting!`, embeds: [embed] });
  
  
  if(csybot.config.voteonrole == true) {
    let role = csybot.config.voterole;
    let guild = csybot.config.supportguildid;
    let userid = csybot.filter(userget.id);
    
    client.shard.broadcastEval(async(c, { guild, userid, role }) => {
      let control = await c.guilds.cache.get(guild);
      if(control) {
        let member;
        try {
        member = await control.members.fetch(userid);
        } catch (err) {
          err + "1";
        }
        if(member) {
          let controll = member._roles.includes(role);
          if(!controll)
          member.roles.add(role).catch(err => err + "1"); 
        }
      }
    }, { context: { guild, userid, role }});
    
  }
  
  return res.status(200).json({ 
    "message": "Success", 
    "code": 200
  });
});
  
app.post("/votetracker/:guild/:id", async function (req, res, next) {
  
  let guildid = req.params.guild;
  let userid = req.params.id;
  
  let user = (req.body && req.body.user) ? csybot.filter(req.body.user) : false;
  let secret = req.get('Authorization');
  if(user == false || !secret || !req.body.bot || userid != req.body.bot) return;
  
  let control = await csybot.data("fetch", "votetracker", `tracker_${guildid}_${userid}`, null);
  if(!control) return;
  let details = JSON.parse(control);
  if(details.pass != secret) return;
  
  let userget = await csybot.dcuserget(csybot.filter(user));
  let botget = await csybot.dcuserget(csybot.filter(req.body.bot));
  if(!userget || !botget) return;
  
  let control2 = await axios.get(`https://top.gg/api/bots/${csybot.filter(botget.id)}`, {
    headers: {
      'Authorization': csybot.config.topggtoken
    }
  }).catch(err => err + "1");
  
  const webhook = new Discord.WebhookClient({ url: details.webhook });
  const embed = {
    color: csybot.config.green,
    title: `**Thank you for voting for ${csybot.filter(botget.username)}#${csybot.filter(botget.discriminator)}${req.body.type == "test" ? " (Test)" : ""}**`,
    fields: [
      {
        name: 'User:',
        value: `\`\`${csybot.filter(userget.username)}#${csybot.filter(userget.discriminator)} (id:${csybot.filter(userget.id)})\`\``,
      },
      {
        name: 'Monthly Vote Count:',
        value: `${(!control2 || !control2.data || !control2.data.monthlyPoints) ? "I do not know!": csybot.filter(control2.data.monthlyPoints)}`,
      },
      {
        name: 'All Monthly Vote Count:',
        value: `${(!control2 || !control2.data || !control2.data.points) ? "I do not know!" : csybot.filter(control2.data.points)}`,
      }
    ],
    footer: {
      text: csybot.footer,
    },
  };
  webhook.send({ embeds: [embed] });

  return res.status(200).json({ 
    "message": "Success", 
    "code": 200
  });
});
  
  
app.all('/status', (req, res) => {
  res.status(200).json({ 
    "message": "Success", 
    "code": 200
  });
});
  
app.use(async function (err, req, res, next) {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  res.status(500).json({
    "message": "500: Internal Error", 
    "code": 1
  });
  
})
  
app.use(async(req, res, next) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  res.status(404).json({
    "message": "404: Not Found", 
    "code": 0
  });
  
})
  
  
  
}