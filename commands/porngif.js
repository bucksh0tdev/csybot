const Discord = require("discord.js");
const request = require('node-superfetch');
const axios = require('axios');
exports.run = async (client, interaction, csybot, orginal) => {
let getlang = await csybot.getlang();
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "nsfw_permission_denied"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const error2= {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "error_occurred"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
let guild = await csybot.guildget();
if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });
let channel = orginal.channel
if(!channel) return csybot.send({ embeds: [csybot.errorcode(203)] });
if(!channel.nsfw) return csybot.send({ embeds: [error] });

const { body } = await request
            .get('https://www.reddit.com/r/adultgifs.json?sort=top&t=week')
            .query({
                limit: 800
            });
        const allowed = channel.nsfw ? body.data.children : body.data.children.filter(post => !post.data.over_18);
        if (!allowed.length) return csybot.send({ embeds: [error2] });
                
           const randomnumber = Math.floor(Math.random() * allowed.length)
           let images = allowed[randomnumber].data.url
           let image = images.replace(".gifv", ".gif");

      const embed = {
        image: {
          url: image
        },
        footer: {
          text: csybot.footer
        },
        color: csybot.config.blue
      }
  
  return csybot.send({ embeds: [embed] });
  
};

exports.help = {
  name: "porngif",
  description: "po* graphic content",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  category: "moderation",
};