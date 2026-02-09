module.exports = function(client, csybot, path) {
  
  return `<div style="position: fixed;bottom: 0px;left: 0px;width: 100%;height: 65px;padding:15px;background-color: #000;color:khaki;">
  <div>
    <center><span style="color: #a2a8bd;">Copyright © [${csybot.config.ownername}] - ${new Date().getFullYear()}</span><br>#Her Zaman Daima İleriye</center>
  </div>
</div>`;
}