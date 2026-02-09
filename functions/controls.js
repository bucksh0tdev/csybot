let getmodel = require(`../databases/models/votes.js`);
let axios = require("axios");
module.exports = async function(client, csybot, guildid, userid, type) {
  
  // type of 1 === web
  // type of 2 === bot
  
  // type of 4 === only guildid control // WEB
  // type of 5 === only user control // WEB
  
  

  let result = false;
  
  if(type == 1 || type == 4 || type == 5) {
    if(csybot.config.maintenance.web == true) {
      result = { message: csybot.config.maintenance.web_message };
    }
  } else if (type == 2 || type == 7) {
    if(csybot.config.maintenance.bot == true) {
      result = { content: csybot.config.maintenance.bot_message };
    } else {
//       let control = await axios.get(`https://top.gg/api/bots/check?userId=${encodeURIComponent(csybot.filter(userid))}`, {
//         headers: {
//           Authorization: `${csybot.config.topggtoken}`
//         }
//       }).catch(err => err + "1")
//       if(control && control.data && control.data.voted == 0) {
//         let getlang = (guildid) ? await csybot.getlang(false, guildid) : csybot.config.defaultlang;
//         let getvote = {
//           title: `**${client.user.username} | ${csybot.lang(getlang, "vote_title")}**`,
//           description: csybot.lang(getlang, "vote_desc", csybot.config.topggrecive, csybot.config.vote),
//           footer: {
//             text: csybot.footer
//           },
//           color: csybot.config.orange
//         }

//         result = { embeds: [getvote] }
//       }
    }
  } 
  
  return result;
}