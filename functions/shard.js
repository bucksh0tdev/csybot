const fs = require("fs");
module.exports = function(client) {
  
const commands = require("../databases/commands.js");
const commandFiles_en = fs.readdirSync(__dirname + "/../commands").filter(file => file.endsWith('.js')); 
for (const file of commandFiles_en) {
  const command = require(`../commands/${file}`);
  let json = {
    file: file,
    name: command.help.name,
    description: command.help.description,
    category: command.help.category
  }
      commands.set(command.help.name, json);
}
  

  
  
client.on("ready", () => {
  console.log(`[SHARD] shard (${Number(client.shard.ids) + 1}/${client.shard.count}) Online`);
});
  
}