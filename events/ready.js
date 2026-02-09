const Discord = require("discord.js");
const fs = require('fs');
const moment = require('moment');
const { joinVoiceChannel } = require('@discordjs/voice');
const globalfun = require("../functions/global.js");
exports.run = async (client, message) => {
const csybot = new globalfun(client, null);
    let sayimiz = 0;

  async function readyfunction() {


    if (sayimiz == 3) {
      sayimiz = 0;
    }
    
//    let user = await csybot.user();
    
    if(sayimiz == 0) {
    let ready = await csybot.data("fetch", "bot", `ready`, null);
      
    if(ready) {
    client.shard.broadcastEval((c, ready) => {
      c.user.setActivity(`${ready} | Shard: ${c.shard.ids}`, {
        url: "https://www.twitch.tv/csycraft",
        type: "STREAMING"
      });
    }, { context: ready});
      return;
    }
      
    client.shard.broadcastEval(async(c) => {

      let user1 = await c.shard.broadcastEval(cs => cs.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0));
      let user2 = user1.reduce((acc, memberCount) => acc + memberCount, 0);
      let user3 = user2 * 2;
      let user = user3.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      
      c.user.setActivity(`${user} Users?! | Shard: ${c.shard.ids}`, {
        url: "https://www.twitch.tv/csycraft",
        type: "STREAMING"
      });
    });
    } else if(sayimiz == 1) {
    client.shard.broadcastEval((c) => {
      c.user.setActivity(`https://csybot.csycraft.com?! | Shard: ${c.shard.ids}`, {
        url: "https://www.twitch.tv/csycraft",
        type: "STREAMING"
      });
    });
    } else if(sayimiz == 2) {      
    client.shard.broadcastEval((c, ready) => {
      c.user.setActivity(`${ready} | Shard: ${c.shard.ids}`, {
        url: "https://www.twitch.tv/csycraft",
        type: "STREAMING"
      });
    }, { context: csybot.config.sponsored.text});
    }
    sayimiz = sayimiz + 1;
   
  }

  csybot.premiumreload();
  setInterval(function() {
    csybot.premiumreload();
  }, 5 * 30000);
  
let guild = client.guilds.cache.get(csybot.config.supportguildid);
if(guild) {
  let voice = guild.channels.cache.get("932234389612527656");
  joinVoiceChannel({
    channelId: voice.id,
    guildId: guild.id,
    adapterCreator: guild.voiceAdapterCreator
  });
  
  let servers = guild.channels.cache.get("786932161478918156");
  let users = guild.channels.cache.get("786932276453572618");
  let channels = guild.channels.cache.get("787266280502722560");

  servers.setName(`╭🌆╏Servers: ${await csybot.guilds()}`); 

  users.setName(`├👥╏Users: ${await csybot.user()}`); 


  channels.setName(`╰🪑╏Channels: ${await csybot.channels()}`); 
  
  csybot.nodereload();
  csybot.topgg();    
}
  
  
let results = await client.shard.broadcastEval(client => [
  client.ws.status, 
]);
var count = 0;
results.forEach(x => (x[0] == 0) ? count++ : "");
if(Number(count) == client.shard.count) {
  if(csybot.config.maintenance.bot != true) {
    readyfunction();
    setInterval(function() {
      readyfunction();
    }, 10 * 60 * 1000);
  } else {
    client.shard.broadcastEval((c) => {
      c.user.setActivity(`CsYBot is in Maintenance | Shard: ${c.shard.ids}`, {
        url: "https://www.twitch.tv/csycraft",
        type: "STREAMING"
      });
    });
  }
  
  csybot.cooldownreload();
  setInterval(function() {
    csybot.cooldownreload();
  }, 10 * 60 * 1000)
  
  console.log("csybot is ready By bucksh0t.dev");
}
};

exports.help = {
  event: "ready"
}