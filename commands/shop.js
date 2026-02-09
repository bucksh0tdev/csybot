const Discord = require("discord.js");
exports.run = async (client, interaction, csybot, orginal) => {
let getlang = await csybot.getlang();
  
var allitems = require("../../databases/shop.json");

let coin = await csybot.getmoney(interaction.member.user.id);
let level = await csybot.getlevel(interaction.member.user.id);

/* Shopping */
let marketing = csybot.options("item");
if(marketing) {

var item = allitems.find(el => el.id === Number(marketing));
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "shop_item_not_found"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}


const error2 = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "dm_error"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}

if(!item || !item.price) return csybot.send({ embeds: [error] })

const noprice = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "shop_price_no", String((coin || 0)), item.price, item.name),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
if(coin < item.price) return csybot.send({ embeds: [noprice] });
  
const erro = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "shop_level_min", String((level || 0)), String(item.minlevel), item.name),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
if(item.minlevel > level) return csybot.send({ embeds: [erro] })

const row = new Discord.MessageActionRow()
.addComponents(
  new Discord.MessageButton()
    .setCustomId(`shopverification`)
    .setLabel('✅')
    .setStyle(3)
)
.addComponents(
  new Discord.MessageButton()
    .setCustomId(`shopnoverification`)
    .setLabel('❌')
    .setStyle(4)
);

const info = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
  description: csybot.lang(getlang, "shop_waiting", item.name, csybot.formatter(item.price)),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.blue
}

const filter = i => (i.customId === 'shopverification' || i.customId === 'shopnoverification') && i.user.id === interaction.member.user.id && ((i.message.interaction) ? (i.message.interaction.id === orginal.id) : true);

let guild = orginal.guild;
let interactionchannel = await guild.channels.cache.get(interaction.channel_id);
let user = await guild.members.cache.get(interaction.member.user.id);
if(!user) return csybot.send({ embeds: [csybot.errorcode(202)] });

if(!interactionchannel) return csybot.send({ embeds: [csybot.errorcode(203)] });

await csybot.send({ embeds: [info], components: [row] });

const collector = interactionchannel.createMessageComponentCollector({ filter, time: 5000 });

collector.on('collect', async i => {
  if(i.customId == "shopverification") {
var shopmsg = "";
    /* Change */
    if(item.id == 1 && item.type == "solo") {
      var precode = csybot.random(15);
      await csybot.createpremiumcode(precode, 10);
      shopmsg = csybot.lang(getlang, "shop_result_code", item.name, precode);
    } else if (item.type == "template") {
      let secretcode = csybot.random(35).toLowerCase();
      let downloadlink = csybot.config.panel+"/download/" + interaction.member.user.id + "/" + secretcode + "";
      
      await csybot.data("set", "secretkeys", `secret_${secretcode}`, `{ "ownerid": "${interaction.member.user.id}", "item": "${item.id}" }`);
      
      shopmsg = csybot.lang(getlang, "shop_result_template", item.name, secretcode, downloadlink);
    }
    /* Change */

    
    const dmmsg = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "buy")}**`,
      description: `${shopmsg}`,
      footer: {
        text: csybot.footer
      },
      color: csybot.config.yellow
    }

    var recoin = await csybot.getmoney(interaction.member.user.id);
    
    if(recoin < item.price) return;

    user.send({ embeds: [dmmsg] }).catch(err => {
      csybot.send({ components: [], embeds: [error2] });
      return;
    });


    const embed = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: csybot.lang(getlang, "shop_purchased", item.name),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.green
    }
    
    await csybot.moneylogadd(interaction.member.user.id, `SHOP (${item.name})`, `-${item.price}`)
    await csybot.data("add", "coin", `coin_${interaction.member.user.id}`, -item.price);
    await csybot.send({ components: [], embeds: [embed] });



  } else if(i.customId == "shopnoverification") {
    const embed = {
      title: `**${client.user.username} | ${csybot.lang(getlang, "success")}**`,
      description: csybot.lang(getlang, "shop_rejected"),
      footer: {
        text: csybot.footer
      },
      color: csybot.config.green
    }
    
    await csybot.send({ components: [], embeds: [embed] });
  }
});
collector.on('end', (collected) => {
  if(collected.size != 0) return;
  const timestrampend = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
    description: csybot.lang(getlang, "time_out"),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.red
  }
  
  csybot.send({ embeds: [timestrampend], components: []});
  });




return;
}
/* Shopping */
var items = "";
for (let i = 0; i < allitems.length; i++) {
  let item = allitems[i];
  //items += "``"+ item.name + "`` **➟** " + item.description + " **|** **Price:** " + csybot.formatter(item.price) + "\n";
  items += "``" + item.id + "`` **➟** " + item.description + " **|** **" + csybot.lang(getlang, "price") + ":** " + csybot.formatter(item.price) + "\n";
}


const shopping = {
  title: csybot.lang(getlang, "shop_items"),
  description: csybot.lang(getlang, "shop_list", items),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.blue
}


return csybot.send({ embeds: [shopping] });


};

exports.help = {
  name: "shop",
  description: "Buyable Stuff Here",
  permissions: {
    bot: ["EMBED_LINKS"],
    user: []
  },
  options: [{
    type: 10,
    name: "item",
    description: "Item you want to buy ID",
    required: false
  }],
  category: "shopping"
};