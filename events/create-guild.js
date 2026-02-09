const Discord = require("discord.js");
const globalfun = require("../functions/global.js");
const brainfun = require("../functions/brain.js");
const brain = new brainfun();
exports.run = async (client, guild) => {
const csybot = new globalfun(client, guild);
let getlang = await csybot.getlang();

  if(!guild) return;
  
  csybot.getmember(client.user.id).then(x => {
    let z = x.roles.cache.find(y => y.name == client.user.username);
    guild.roles.create({
      name: 'CsYBot',
      color: 'RED',
      position: z.position
    }).then(a => { 
      x.roles.add(a.id);
      a.setHoist(true)
    }).catch(err => err + "1");
  }).catch(err => err + "1");
  
};

exports.help = {
  event: "guildCreate"
};