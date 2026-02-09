const Discord = require("discord.js");
const globalfun = require("../functions/global.js");
exports.run = async (client, oldMessage, message) => {
const csybot = new globalfun(client, message);
let getlang = await csybot.getlang();
  
  if(!message || !message.content || !message.guild || !message.author || message.author.bot) return;

  /* Ad Protection */
  var adprotect = await csybot.data("fetch", "adprotect", `adprotect_${message.guild.id}`, null);
  if (!adprotect) return;

  const ads = [
    ".com",
    ".net",
    ".xyz",
    ".tk",
    ".pw",
    ".io",
    ".me",
    ".gg",
    "www.",
    "https:",
    "http:",
    ".gl",
    ".org",
    ".tr",
    ".biz",
    ".party",
    ".rf.gd",
    ".az",
    ".cf",
    ".me",
    ".app"
  ];

  let user = message.member;

  if (ads.some(word => message.content.toLowerCase().includes(word))) {
    if (!user.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)) {
      await csybot.data("set", "adshare", `adshare_${message.guild.id}`, csybot.filter(message.content));
      message.delete().catch(err => err + "1");

      
      const noadmsg = {
        description: csybot.lang(getlang, "protect_message"),
        footer: {
          text: `/advertise-show`
        },
        color: csybot.config.red
      }
      

      message.channel.send({ embeds: [noadmsg] }).then(msg => {
        setTimeout(() => msg.delete(), 5000);
      }).catch(err => err + "1")
      return;
    }
  }
  /* Ad Protection */

  var swearprotect = await csybot.data("fetch", "swearprotect", `swearprotect_${message.guild.id}`, null);
  if (!swearprotect) return;

  const sweards = [
    "fuck",
    "Asshole",
    "Bastard",
    "Get off",
    "ass",
    "Get the fuck up",
    "Bitch",
    "Bollocks",
    "Chav",
    "Codger",
    "Cunt",
    "Damn",
    "Dick",
    "Dickhead",
    "Duffer",
    "Fanny",
    "Fuckher",
    "Gormless",
    "Motherfucker",
    "Pillock",
    "Prat",
    "Shit",
    "Swine",
    "mq",
    "amk",
    "aq",
    "orospu",
    "oruspu",
    "oç",
    "sikerim",
    "yarrak",
    "piç",
    "amq",
    "sik",
    "amcık",
    "çocu",
    "sex",
    "seks",
    "amına",
    "orospu çocuğu",
    "siktir",
    "siktir git",
    "aptal",
    "gerizekali",
    "salak"
  ];


  let swearuser = message.member;

  if (sweards.some(word => message.content.toLowerCase().includes(word))) {
    if (!user.permissions.has(Discord.Permissions.FLAGS.KICK_MEMBERS)) {
      await csybot.data("set", "swearshare", `swearshare_${message.guild.id}`, csybot.filter(message.content));
      message.delete().catch(err => err + "1");
      
      const noswearmsg = {
        description: csybot.lang(getlang, "protect_message"),
        footer: {
          text: `/swear-show`
        },
        color: csybot.config.red
      }
      

      message.channel.send({ embeds: [noswearmsg] }).then(msg => {
        setTimeout(() => msg.delete(), 5000);
      }).catch(err => err + "1")
    }
  }



  
};

exports.help = {
  event: "messageUpdate"
};