const Discord = require("discord.js");
const fs = require("fs");
const express = require("express");
const app = express();
const client = new Discord.Client({
  partials: ["MESSAGE", "CHANNEL", "REACTION"],
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.DIRECT_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Discord.Intents.FLAGS.GUILD_INVITES
  ],
  fetchAllMembers: true
});

if(client.shard.ids == 0) {
  require("./views/index.js")(client, app);
  const listener = app.listen(process.env.PORT, function() { listener.address().port });
  //console.log("Panel Loaded!");
}

require("./functions/eventLoader.js")(client);
require("./databases/database.js")(client);
require("./functions/shard.js")(client);

process.on("unhandledRejection", err => {
    console.log("[AntiCrash] V1", err);
});
process.on("uncaughtException", err => {
    console.log("[AntiCrash] V2", err);
});
process.on("uncaughtExceptionMonitor", err => {
    console.log("[AntiCrash] V3", err);
});
process.on("multipleResolves", err => {
    console.log("[AntiCrash] V4", err);
});