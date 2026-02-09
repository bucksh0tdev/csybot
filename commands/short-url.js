const Discord = require("discord.js");
exports.run = async (client, interaction, csybot, orginal) => {
let getlang = await csybot.getlang();
  
let string = csybot.options("link");
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "url_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const error2 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "url_valid"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const error3 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "short_max"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const error4 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "short_char"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
  
if(!string) return csybot.send({ embeds: [error] });
  
let link = csybot.urlcontrol(string);
if(link == false) return csybot.send({ embeds: [error2] });
  
if(String(link).length > csybot.config.linkservice.maxchar) return csybot.send({ embeds: [error4] });
  
let nowlimit = await csybot.data("count", "shortlink", "link");
if(nowlimit >= csybot.config.linkservice.maxlimit) return csybot.send({ embeds: [error3] });
  
var shorted = "Problem!";
  
let controling = await csybot.shortlinkcontrol(link, false);
if(controling != false) {
  let parsss = JSON.parse(controling.data);
  shorted = parsss.shorted;
  
  const success = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
    description: csybot.lang(getlang, "short_success"),
    fields: [
        {
          name: `Link:`,
          value: `\`\`${csybot.filter(link)}\`\``,
          inline: false
        },
        {
          name: `Shorted Link:`,
          value: `${csybot.config.linkservice.rurl}/${shorted}`,
          inline: false
        }
      ],
    footer: {
      text: csybot.footer
    },
    color: csybot.config.green
  }
  
  return csybot.send({ embeds: [success] })
}

let now = new Date().getTime();

let short = await csybot.shortlink();

let json = {
  shorted: short,
  id: now,
  link: link
}

shorted = short;

await csybot.data("set", "shortlink", `link_${now}`, JSON.stringify(json))
  
const success = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
  description: csybot.lang(getlang, "short_success"),
  fields: [
      {
        name: `Link:`,
        value: `\`\`${csybot.filter(link)}\`\``,
        inline: false
      },
      {
        name: `Shorted Link:`,
        value: `${csybot.config.linkservice.url}/${short}`,
        inline: false
      }
    ],
  footer: {
    text: csybot.footer
  },
  color: csybot.config.green
}
  
return csybot.send({ embeds: [success] });
};

exports.help = {
  name: "short-url",
  description: "Url shortening",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  options: [{
    type: 3,
    name: "link",
    description: "Enter url",
    required: true
  }],
  category: "utilty"
};