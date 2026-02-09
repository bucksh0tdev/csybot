const { ShardingManager } = require("discord.js");
const globalfun = require("./functions/global.js");
const csybot = new globalfun(null, null);

const manager = new ShardingManager("./index.js", {
  totalShards: csybot.config.shards,
  token: process.env.token,
  spawnTimeout: -1,
  respawn: true
});

manager.on("shardCreate", shard => {
  console.log(`[SHARD] shard (${Number(shard.id) + 1}/${manager.totalShards}) Created!`);
  
  shard.on('death', () => {
        console.log(`[SHARD] shard (${Number(shard.id) + 1}/${manager.totalShards}) Disconnected!`);
    });
  shard.on('error', (error) => {
     console.log(error)
  });
});

manager.spawn(manager.totalShards, 5500, -1).catch(err => err + "1")