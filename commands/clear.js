const Discord = require("discord.js");
exports.run = async (client, interaction, csybot, orginal) => {
let getlang = await csybot.getlang();
  
let max = 99;
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "amount_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
const error2 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "clear_max", max),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
const error3 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "error_occurred"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

let numbers = csybot.options("quantity");
  
if(!numbers || numbers < 0 || isNaN(numbers)) return csybot.send({ embeds: [error] });
if(numbers >= (max + 1)) return csybot.send({ embeds: [error2] });

let guild = await csybot.guildget();
if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });
let channel = orginal.channel;
if(!channel) return csybot.send({ embeds: [csybot.errorcode(203)] });

const success = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
  fields: [
      {
        name: `${csybot.lang(getlang, "action")}:`,
        value: `${csybot.lang(getlang, "delete_message")}`,
        inline: true
      },
      {
        name: `${csybot.lang(getlang, "conclusion")}:`,
        value: `${csybot.lang(getlang, "success_term")}`,
        inline: true
      },
      {
        name: `${csybot.lang(getlang, "quantity")}:`,
        value: `${csybot.filter(String(numbers))}`,
        inline: true
      }
  ],
  footer: {
    text: csybot.footer
  },
  color: csybot.config.green
}


await csybot.send({ embeds: [success] });
  
channel.bulkDelete(numbers, true).catch(err => {
  
  return csybot.send({ embeds: [error3] });
  
});
};

exports.help = {
  name: "clear",
  description: "Bulk Clean Chat Messages!",
  permissions: {
    bot: ["MANAGE_MESSAGES"],
    user: ["MANAGE_MESSAGES"]
  },
  category: "moderation",
  options: [{
    type: 10,
    name: "quantity",
    description: "Amount of Messages to be Deleted",
    required: true
  }]
};