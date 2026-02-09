const Discord = require("discord.js");
const steam = require("steam-provider");
let provider = new steam.SteamProvider();
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "search_term_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

let search = csybot.filter(csybot.options("search"));

if(!search) return csybot.send({ embeds: [error] });

let steampng =
"https://cdn.discordapp.com/attachments/458004691402489856/470344660364034049/steam.png";

await provider.search(search).then(result => {
const error2 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "search_term_valid"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
if(!result || !result[0] || !result[0].id) return csybot.send({ embeds: [error2] });

provider.detail(result[0].id, "en", "en").then(results => {
  
  const embed = {
    author: {
      name: 'Steam Store',
      icon_url: steampng,
    },
    title: result[0].name,
    thumbnail: {
      url: results.otherData.imageUrl,
    },

    fields: [
      {
        name: `${csybot.lang(getlang, "steam_game_id")}:`,
        value: result[0].id,
      },
      {
        name: `${csybot.lang(getlang, "types")}:`,
        value: results.genres.join(', '),
        inline: false,
      },
      {
        name: `${csybot.lang(getlang, "price")}:`,
        value: `${csybot.lang(getlang, "steam_regular")}: **${results.priceData.initialPrice}$**
${csybot.lang(getlang, "steam_discounted")}: **${results.priceData.finalPrice}$**`,
        inline: true,
      },
      {
        name: `${csybot.lang(getlang, "platforms")}:`,
        value: results.otherData.platforms.join(', '),
        inline: true,
      },
      {
        name: `${csybot.lang(getlang, "tags")}:`,
        value: results.otherData.features.join(', '),
        inline: true,
      },
      {
        name: `${csybot.lang(getlang, "developers")}:`,
        value: results.otherData.developer.join(', '),
        inline: true,
      },
      {
        name: `${csybot.lang(getlang, "publishers")}:`,
        value: results.otherData.publisher.join(', '),
        inline: true,
      }
    ],

    footer: {
      text: csybot.footer
    },
    color: csybot.config.orange
  }
  
  return csybot.send({ embeds: [embed] });
});
});



};

exports.help = {
  name: "steam",
  description: "Search about steam games",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  category: "fun",
  options: [{
    type: 3,
    name: "search",
    description: "Enter the Game Name You Want to Search",
    required: true
  }]
};