const Discord = require("discord.js");
exports.run = async (client, interaction, csybot, orginal) => {
let getlang = await csybot.getlang();
  
let option = csybot.options("user");
let guild = await csybot.guildget();
if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });

let user = (option && option.id) ? option : orginal.member;

if(!user) return csybot.send({ embeds: [csybot.errorcode(202)] });

let roles = (user._roles.length <= 20) ? user._roles.map(r => `<@&${r}>`).join(" ").replace("everyone", " ") : "[...]"
  
const info = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
  fields: [
		{
			name: `${csybot.lang(getlang, "user")}:`,
			value: `${csybot.filter(`${user.user.tag}`)}`,
		},
		{
			name: 'ID:',
			value: `${user.user.id}`,
		},
		{
			name: 'Bot:',
			value: `${(user.user.bot == true) ? `${csybot.lang(getlang, "yes")}` : `${csybot.lang(getlang, "no")}`}`,
		},
		{
			name: `[${user._roles.length}] ${csybot.lang(getlang, "roles")}:`,
			value: `${csybot.filter((user._roles.length == 1) ? `${csybot.lang(getlang, "no")}` : roles )}`,
		},
		{
			name: `${csybot.lang(getlang, "joined_server")}:`,
			value: `<t:${Math.floor(user.joinedTimestamp / 1000)}:R>`,
		},
		{
			name: `${csybot.lang(getlang, "joined_discord")}:`,
			value: `<t:${Math.floor(user.user.createdAt / 1000)}:R>`,
		},
	],
  footer: {
    text: csybot.footer
  },
  color: csybot.config.blue
}
  

return csybot.send({ embeds: [info] });
  
};

exports.help = {
  name: "user-info",
  description: "Provides information about the user",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  options: [{
			type: 6,
      name: "user",
      description: "Select User",
      required: false
		}]
};