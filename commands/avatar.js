const Discord = require("discord.js");
exports.run = async (client, interaction, csybot, orginal) => {
let getlang = await csybot.getlang();
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "user_valid"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

let user = csybot.options("user");
  
let guild = await csybot.guildget();
if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });
  
let getuser = (user && user.id) ? user : orginal.member;
  
  
if(!getuser) return csybot.send({ embeds: [error] });
  
const success = {
  image: {
		url: getuser.user.displayAvatarURL({dynamic: true, size: 256}),
	},
  footer: {
    text: csybot.footer
  },
  color: csybot.config.green
}
  

return csybot.send({ embeds: [success] });


};

exports.help = {
  name: "avatar",
  description: "Get User Avatar!",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  options: [{
			type: 6,
      name: "user",
      description: "Select User",
      required: false
		}],
  category: "utilty"  
};