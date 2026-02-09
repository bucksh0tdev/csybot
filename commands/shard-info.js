const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();

let results = await client.shard.broadcastEval(client => [
  client.shard.ids, 
  client.ws.status, 
  client.ws.ping, 
  client.guilds.cache.size,
  (String(Number(client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)) * 2).replace(/\B(?=(\d{3})+(?!\d))/g, ","))
])

    const embed = {
      title: csybot.lang(getlang, "shard_title", client.shard.count),
      fields: [],
      color: csybot.config.blue
    }
    
    results.map((data) => {
        embed.fields.push({ name: `📡 Shard ${data[0]}`, value: `**${csybot.lang(getlang, "status")}:** ${(data[1] == 0) ? ":green_circle:" : ":red_circle:" }\n**Ping:** ${data[2]}ms\n**${csybot.lang(getlang, "servers")}:** ${data[3]}\n**${csybot.lang(getlang, "users")}:** ${data[4]}` })
    });
  
return csybot.send({ embeds: [embed] });


};

exports.help = {
  name: "shard-info",
  description: "Shards Current Status",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  category: "utilty"
};