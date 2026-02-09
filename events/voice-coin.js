const Discord = require("discord.js");
const globalfun = require("../functions/global.js");
exports.run = async (client, oldstate, state) => {
const csybot = new globalfun(client, null);

if(!state.guild) return;
  
  if (state.guild.id != csybot.config.supportguildid) return;

  let guild = await client.guilds.cache.get(csybot.config.supportguildid);
  if(!guild) return;
  
  let includetesting = csybot.config.voices.includes(state.channelId);
  let user = await guild.members.cache.get(state.id);


  if (!state.channelId || (state.channelId && includetesting == false)) {
    let voicecontrol = await csybot.data("fetch", "voice", `voice_${state.id}`, null);
    if (!voicecontrol) return;
    let now = new Date().getTime();
    //let minutes = now - voicecontrol;
    await csybot.data("delete", "voice", `voice_${state.id}`, null)
    //console.log("Ended Voice " + minutes);

    //let seconds = Math.floor(minutes / 1000);

    //let money = (seconds > 600) ? `${(seconds / 60) * 20}` : 0;

    //await csybot.data("add", "coin", `coin_${state.id}`, `${Number(Math.floor(money))}`);
    //await csybot.moneylogadd(state.id, "VOICE", `+${Math.floor(money)}`)

    //let finished = new Discord.MessageEmbed()
    //  .setTitle(`**${client.user.username} | Finish**`, true)
    //  .setDescription(`<t:${Math.floor(voicecontrol / 1000)}:R> (${seconds}) Seconds You've Won (**${Math.floor(money)}**) Coins!`, true)
    //  .setFooter(`${csybot.footer}`)
    //  .setColor('YELLOW');

    //user.send({ embeds: [finished] }).catch(err => err + "1");
    return;
  }

  if (includetesting == true) {
    let voicecontrol = await csybot.data("fetch", "voice", `voice_${state.id}`, null);
    let now = new Date().getTime();
    if (voicecontrol) return;
    await csybot.data("set", "voice", `voice_${state.id}`, now);
    //console.log("Started Voice Limiting!");

    //let started = new Discord.MessageEmbed()
    //  .setTitle(`**${client.user.username} | Started**`, true)
    //  .setDescription(`You Will Earn 20 Coins For Every Minute You Stand Here.\n You must stop for at least 10 minutes to get your coins!\n If You Leave the Room, You Will Be Paid!`, true)
    //  .setFooter(`${csybot.footer}`)
    //  .setColor('YELLOW');

    //user.send({ embeds: [started] }).catch(err => err + "1");
    return;
  }
  
  
};

exports.help = {
  event: "voiceStateUpdate"
};