const fs = require('fs');
const reqEvent = (event) => require(`../events/${event}`);
module.exports = async (client) => {
  
  const eventsfile = fs.readdirSync(__dirname + "/../events").filter(file => file.endsWith('.js'));
  var events = [];
  for (var file of eventsfile) {
    var command = require(`../events/${file}`);
    var eventname = command.help.event;
    
      events.push({ eventname: command.help.event, filename: file, ws: (command.help.ws) ? true : false });
  }
  
  let eventsm = "";
   
  events.forEach(x => {
    

    if(x.ws == true) {
    eventsm += `
  client.ws.on(\`${x.eventname}\`, async(commandoptionslister0, commandoptionslister1, commandoptionslister2) => {
      let command = require("../events/` + x.filename + `");
      command.run(client, commandoptionslister0, commandoptionslister1, commandoptionslister2);
    });
`;
    } else {
    eventsm += `
  client.on(\`${x.eventname}\`, async(commandoptionslister0, commandoptionslister1, commandoptionslister2) => {
      let command = require("../events/` + x.filename + `");
      command.run(client, commandoptionslister0, commandoptionslister1, commandoptionslister2);
    });
`;
    }
    //console.log(`Loaded new handler ${x.filename.replace(".js", "")}`);
  });
  
  
  await eval(eventsm);
  
};
