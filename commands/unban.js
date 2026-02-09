const Discord = require("discord.js");
exports.run = async (client, interaction, csybot, orginal) => {
let getlang = await csybot.getlang();
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "user_id_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const noperm = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "perm_valid"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

let option = csybot.options("user");
  
if(!option || !option.id) return csybot.send({ embeds: [error] });
  
let guild = await csybot.guildget();
if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });

  try {
    await orginal.guild.bans.fetch(option);
  } catch (err) {
    return csybot.send({ embeds: [error] });
  }

    orginal.guild.members.unban(option).then(user => {
    let banneduser = csybot.filter(`${user.username}#${user.discriminator}`);

    const success = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: csybot.lang(getlang, "unban_success", banneduser),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.green
    }
      
        return csybot.send({ embeds: [success] });

    }).catch((err) => {
        csybot.send({ embeds: [noperm] });
        return err + "1";
    });


};

exports.help = {
  name: "unban",
  description: "You Can Unban User!",
  permissions: {
    bot: ["BAN_MEMBERS", "EMBED_LINKS"],
    user: ["BAN_MEMBERS"]
  },
  options: [{
	type: 3,
    name: "user",
    description: "Select UserID",
    required: true
  }],
  category: "moderation"
};