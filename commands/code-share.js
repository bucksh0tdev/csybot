const Discord = require("discord.js");
exports.run = async (client, interaction, csybot, orginal) => {
let getlang = await csybot.getlang();
  
let optionsearch = csybot.options("search", true);
let optionget = csybot.options("get", true);
let optionlist = csybot.options("list", true);
  
let level = await csybot.getlevel(interaction.member.user.id);
  
let max = 5;

if(optionlist) {
  let codes = await csybot.data("starts", "code", "code_", null);

  let codess = [];

  await codes.forEach((x, i) => {
    var parsed = JSON.parse(x.data);
    var dataid = (x.dataname).split("_")[1];
    var datadesc = parsed.desc;
    codess.push(`\`\`${dataid}\`\` **➟** ${datadesc}`);
  });
  
  const row = new Discord.MessageActionRow()
  .addComponents(
    new Discord.MessageButton()
      .setCustomId(`code_back`)
      .setLabel('◀️')
      .setStyle(2)
      .setDisabled(true)
  )
  .addComponents(
    new Discord.MessageButton()
      .setCustomId(`code_refresh`)
      .setLabel('🔃')
      .setStyle(2)
  )
  .addComponents(
    new Discord.MessageButton()
      .setCustomId(`code_next`)
      .setLabel('▶️')
      .setStyle(2)
  );  
  
  let starts = await codess.slice(0, max);
  
  let embed = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
    description: (!String(starts)) ? `${csybot.lang(getlang, "not_found")}` : `${csybot.lang(getlang, "code_list", (starts.join("\n")))}`,
    footer: {
      text: csybot.footer
    },
    color: csybot.config.orange
  }
  
  if(codess.length == 0 || codess.length < max) {
    row.components[0].disabled = true;
    row.components[2].disabled = true;
  }
  
  
  csybot.send({ embeds: [embed], components: [row] });
  
  const filter = i => (i.customId === 'code_back' || i.customId === 'code_refresh' || i.customId === 'code_next') && i.user.id === interaction.member.user.id && i.message.interaction.id === orginal.id;
  const collector = orginal.channel.createMessageComponentCollector({ filter });
  
var data = 0;
let page = 0;
let maxpage = Math.ceil(codess.length/3)
  
collector.on('collect', async i => {
  await i.deferUpdate();
  if(i.customId == "code_back") {
    if(data != 0) {
      
      if((data-max) == 0) row.components[0].disabled = true;
      row.components[2].disabled = false;
      var p = data-max;
      var pp = p+max;
      
      data = p;
      page--;
      
      let xss = codess.slice(p, pp);   
      
      
      let embed = {
        title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
        description: (!String(xss)) ? `${csybot.lang(getlang, "not_found")}` : `${csybot.lang(getlang, "code_list", (xss.join("\n")))}`,
        footer: {
          text: csybot.footer
        },
        color: csybot.config.orange
      }
      
    csybot.send({ embeds: [embed], components: [row] });
      
    }
    
    
  } else if (i.customId == "code_refresh") {
      var p = data;
      var pp = p+max;
      
      let xss = codess.slice(p, pp);
      
      let embed = {
        title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
        description: (!String(xss)) ? `${csybot.lang(getlang, "not_found")}` : `${csybot.lang(getlang, "code_list", (xss.join("\n")))}`,
        footer: {
          text: csybot.footer
        },
        color: csybot.config.orange
      }
      
    csybot.send({ embeds: [embed], components: [row] });
    
  } else if (i.customId == "code_next") {
      if(page == maxpage) { } else {
        
      var p = data+max;
      var pp = p+max;
      
      let xss = codess.slice(p, pp);
      if(!String(xss)) { } else {
      row.components[0].disabled = false;
        
      if(codess.length <= pp) row.components[2].disabled = true;
      data = p; 
      page++;
        
      let embed = {
        title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
        description: (!String(xss)) ? `${csybot.lang(getlang, "not_found")}` : `${csybot.lang(getlang, "code_list", (xss.join("\n")))}`,
        footer: {
          text: csybot.footer
        },
        color: csybot.config.orange
      }
      
    csybot.send({ embeds: [embed], components: [row] });
    } 
    }
  }
    
});
  
  
  
  
collector.on('end', collected => {
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
  
  
  
} else if (!optionlist && optionget) {
  
  let getid = csybot.options("code-id", true, "get");
  
  const error = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
    description: csybot.lang(getlang, "shop_item_not_found"),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.red
  }
  
  let getcode = await csybot.data("fetch", "code", `code_${getid}`, null);
  if(!getcode) return csybot.send({ embeds: [error] });
  
  let parsed = JSON.parse(getcode);
  
  const erro = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
    description: csybot.lang(getlang, "shop_level_min", String((level || 0)), (parsed.level || 0), parsed.desc),
    footer: {
      text: csybot.footer
    },
    color: csybot.config.red
  }
  
  if(parsed.level > level) return csybot.send({ embeds: [erro] })
  
  const buffer = Buffer.from((parsed.code || "Not Found. https://api.csycraft.com"))
  const attachment = new Discord.MessageAttachment(buffer, 'code.js')


  if(!parsed.howuse || parsed.howuse == "") {
    csybot.send({ files: [attachment] });
  } else {
    csybot.send({ content: `${csybot.filter(parsed.howuse)}`, files: [attachment] });
  }
  
} else if (!optionlist && !optionget && optionsearch) {
  
let getsearch = csybot.options("code-search", true, "search");

  
let codes = await csybot.data("starts", "code", "code_", null);

let gcodess = [];

await codes.forEach((x, i) => {
  var parsed = JSON.parse(x.data);
  var dataid = (x.dataname).split("_")[1];
  var datadesc = parsed.desc;
  gcodess.push({ desc: `${String(datadesc)}`, id: `${String(dataid)}` });
});  
  
  
let get = gcodess.filter(x => (x.desc.includes(getsearch)) ? true : false);
  
const error = {
  title: `**${client.user.username} | ${csybot.lang(getlang, "error")}**`,
  description: csybot.lang(getlang, "shop_item_not_found"),
  footer: {
    text: csybot.footer
  },
  color: csybot.config.red
}
  
if(get == []) return csybot.send({ embeds: [error] });
  


  let codess = [];

  await get.forEach((x, i) => {
    var dataid = x.id;
    var datadesc = x.desc;
    codess.push(`\`\`${dataid}\`\` **➟** ${datadesc}`);
  });
  
  const row = new Discord.MessageActionRow()
  .addComponents(
    new Discord.MessageButton()
      .setCustomId(`code_back`)
      .setLabel('◀️')
      .setStyle(2)
      .setDisabled(true)
  )
  .addComponents(
    new Discord.MessageButton()
      .setCustomId(`code_refresh`)
      .setLabel('🔃')
      .setStyle(2)
  )
  .addComponents(
    new Discord.MessageButton()
      .setCustomId(`code_next`)
      .setLabel('▶️')
      .setStyle(2)
  );
    
  
  let starts = await codess.slice(0, max);
  
  let embed = {
    title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
    description: (!String(starts)) ? `${csybot.lang(getlang, "not_found")}` : `${csybot.lang(getlang, "code_list", (starts.join("\n")))}`,
    footer: {
      text: csybot.footer
    },
    color: csybot.config.orange
  }
  
  if(codess.length == 0 || codess.length < max) {
    row.components[0].disabled = true;
    row.components[2].disabled = true;
  }
  
  
  csybot.send({ embeds: [embed], components: [row] });
  
  const filter = i => (i.customId === 'code_back' || i.customId === 'code_refresh' || i.customId === 'code_next') && i.user.id === interaction.member.user.id && i.message.interaction.id === orginal.id;
  const collector = orginal.channel.createMessageComponentCollector({ filter });
  
var data = 0;
let page = 0;
let maxpage = Math.ceil(codess.length/3)
  
collector.on('collect', async i => {
  await i.deferUpdate();
  if(i.customId == "code_back") {
    if(data != 0) {
      
      if((data-max) == 0) row.components[0].disabled = true;
      row.components[2].disabled = false;
      var p = data-max;
      var pp = p+max;
      
      data = p;
      page--;
      
      let xss = codess.slice(p, pp);   
      
      
      let embed = {
        title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
        description: (!String(xss)) ? `${csybot.lang(getlang, "not_found")}` : `${csybot.lang(getlang, "code_list", (xss.join("\n")))}`,
        footer: {
          text: csybot.footer
        },
        color: csybot.config.orange
      }
      
    csybot.send({ embeds: [embed], components: [row] });
      
    }
    
    
  } else if (i.customId == "code_refresh") {
      var p = data;
      var pp = p+max;
      
      let xss = codess.slice(p, pp);
      
      let embed = {
        title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
        description: (!String(xss)) ? `${csybot.lang(getlang, "not_found")}` : `${csybot.lang(getlang, "code_list", (xss.join("\n")))}`,
        footer: {
          text: csybot.footer
        },
        color: csybot.config.orange
      }
      
    csybot.send({ embeds: [embed], components: [row] });
    
  } else if (i.customId == "code_next") {
      if(page == maxpage) { } else {
        
      var p = data+max;
      var pp = p+max;
      
      let xss = codess.slice(p, pp);
      if(!String(xss)) { } else {
      row.components[0].disabled = false;
        
      if(codess.length <= pp) row.components[2].disabled = true;
      data = p; 
      page++;
        
      let embed = {
        title: `**${client.user.username} | ${csybot.lang(getlang, "info")}**`,
        description: (!String(xss)) ? `${csybot.lang(getlang, "not_found")}` : `${csybot.lang(getlang, "code_list", (xss.join("\n")))}`,
        footer: {
          text: csybot.footer
        },
        color: csybot.config.orange
      }
      
    csybot.send({ embeds: [embed], components: [row] });
    } 
    }
  }
    
});
  
  
  
  
collector.on('end', collected => {
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
  
  
  
  
  
  
}

};

exports.help = {
  name: "code",
  description: "Get The Most Suitable Code For You And It's Yours!",
  permissions: {
    bot: ["ADMINISTRATOR", "EMBED_LINKS", "ATTACH_FILES"],
    user: []
  },
  category: "legendary",
  onlySlash: true,
  options: [{
    type: 1,
    name: "list",
    description: "What's inside?",
  },
  {
    type: 1,
    name: "get",
    description: "Fetch the code",
    options: [{
        type: 3,
        name: "code-id",
        description: "Specified Code ID",
        required: true
    }]
  },
  {
      type: 1,
      name: "search",
      description: "Code Search",
      options: [{
          type: 3,
          name: "code-search",
          description: "Search term",
          required: true
      }]
  }]
};