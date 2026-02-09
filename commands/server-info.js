const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
let guild = await csybot.guildget();
if(!guild) return csybot.send({ embeds: [csybot.errorcode(201)] });
  
const info = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
  fields: [
		{
			name: `${csybot.lang(getlang, "guild_name")}:`,
			value: `${csybot.filter(guild.name)}`,
		},
		{
			name: `ID:`,
			value: `${guild.id}`,
		},
		{
			name: `${csybot.lang(getlang, "owner")}:`,
			value: `${(guild.ownerId) ? `<@${guild.ownerId}>` : `${csybot.lang(getlang, "not_found")}` }`,
		},
		{
			name: `${csybot.lang(getlang, "member_count")}:`,
			value: `${guild.memberCount}`,
		},
		{
			name: `${csybot.lang(getlang, "channels_count")}:`,
			value: `${guild.channels.cache.size}`,
		},
		{
			name: `${csybot.lang(getlang, "roles_count")}:`,
			value: `${guild.roles.cache.size}`,
		},
		{
			name: `${csybot.lang(getlang, "created_at")}:`,
			value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`,
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
  name: "server-info",
  description: "Provides information about the server",
  permissions: {
    bot: ["EMBED_LINKS", "VIEW_CHANNEL"],
    user: []
  }
};