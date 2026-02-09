const Discord = require("discord.js");
exports.run = async (client, interaction, csybot) => {
let getlang = await csybot.getlang();
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "premium_none"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

const error2 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "premium_wrong"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

let premiumcode = csybot.options("gift-code");
  
if(!premiumcode) return csybot.send({ embeds: [error] });

let premiumcodehas = await csybot.premiumcode(csybot.filter(premiumcode));

if(!premiumcodehas) return csybot.send({ embeds: [error2] });
  
await csybot.data("delete", "premiumcode", `premiumcode_${premiumcode}`, null);
await csybot.premiumgive(interaction.guild_id, Number(premiumcodehas), "yes", premiumcode);

};

exports.help = {
  name: "premium-code",
  description: "Upgrade Your Server With Premium Codes!",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
    options: [{
			type: 3,
      name: "gift-code",
      description: "The Only Obstacle Before You To Be Premium!",
      required: true
		}],
  category: "premium"
  
};