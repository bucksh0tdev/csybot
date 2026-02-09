const request = require("request");
const Discord = require("discord.js");
const passport = require("passport");
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const global = require("../../../functions/global.js");
module.exports = function(client, realapp, app, panel) {
const csybot = new global(client, null);
  
/* Home */
app.all('/', async function(req, res) {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  panel.download(res, req, "index.ejs");
});
/* Home */
  
app.get("/webprotect/:guildid", async(req, res) => {
  let guildid = req.params.guildid;
  if(!guildid) return res.redirect(csybot.config.panel);
  
  if (!req.isAuthenticated()) return panel.loginto(req, res, `/webprotect/${csybot.filter(guildid)}`);
  
  let controlresult = await csybot.controls(null, req.user.id, 5);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  let fetchedwebprotect = await csybot.data("fetch", "webprotect", `webprotect_${guildid}`, null);
  if (!fetchedwebprotect) return res.status(200).json({ "message": `Not Opened Web Join Protect System!`, "code": 403 });;
  let fetchedwebprotectparsed = JSON.parse(fetchedwebprotect);
  
  let usertag = csybot.filter(`${req.user.username}#${req.user.discriminator}`);
  
  panel.download(res, req, "webprotect.ejs", { role: fetchedwebprotectparsed.role, usertag, guild: guildid });
});
  
app.post("/webprotect/:guildid", async(req, res) => {
  let guildid = req.params.guildid;
  if(!guildid) return res.redirect(csybot.config.panel);
  
  if (!req.isAuthenticated()) return panel.loginto(req, res, `/webprotect/${csybot.filter(guildid)}`);
  
  let controlresult = await csybot.controls(null, req.user.id, 5);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  let userid = req.user.id;
  
  let captcha = req.body["g-recaptcha-response"];
  
  let captchacontrol = await axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${csybot.config.google.recaptcha.secretkey}&response=${captcha}&remoteip=${req.headers['x-forwarded-for']}`).catch(err => err + "1");
  if(!captchacontrol || !captchacontrol.data || !captcha) return res.redirect(csybot.config.panel + "/webprotect/" + guildid);

  if(captchacontrol.data.success != true) return res.redirect(csybot.config.panel + "/webprotect/" + guildid);
  
  let user = await csybot.webprotect(guildid, userid);
  
  let result = (res) => {
    if(Number(res) == 1) {
      return "You are not on this server.";
    } else if (Number(res) == 2) {
      return "User Already Registered!";
    } else if (Number(res) == 3) {
      return "Error. Not Gived Role";
    } else if (Number(res) == 4) {
      return "Not Found Guild!";
    } else if(Number(res) == 8) {
      return "Not Open Web Join Protect!";
    } else {
      return "You have successfully registered. You can go back."
    }
  };
  
  panel.download(res, req, "message.ejs", { msg: `${result(user)}` });
});
  
/* Home */
app.all('/supporters', async function(req, res) {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  panel.download(res, req, "supporters.ejs");
});
/* Home */
  
/* Home */
app.all('/premium', async function(req, res) {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  panel.download(res, req, "premium.ejs");
});
/* Home */
  
app.get("/api/exists", (req, res, next) => {
if (req.isAuthenticated()) {
 res.json({
   code: 0,
   message: "logged in"
 }); 
} else {
 res.json({
   code: 1,
   message: "not logged in"
 }); 
}
});
  
/* login */
app.get("/login", async(req, res, next) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  if (req.isAuthenticated()) {
    if(req.session.redirect) {
      return res.redirect(csybot.config.panel + csybot.filter(req.session.redirect));
    } else {
      return res.redirect(csybot.config.panel + "/panel");
    }
  }
  
  var ajs = "checked";
  
  if(req.cookies && req.cookies.ajs && String(req.cookies.ajs) == 'false') ajs = "";
  
  panel.download(res, req, "panel/login.ejs", { ajs: ajs });
});
  
app.get("/login/discord", async(req, res, next) => {
    let controlresult = await csybot.controls(null, null, 1);
    if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });

    if (req.isAuthenticated()) return res.redirect("/panel");
    next();
  },
  passport.authenticate("discord", { prompt: 'none' }));
  
/* login */
  
/* EXIT */
app.all("/exit", async(req, res, next) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  if (!req.isAuthenticated()) return res.redirect(csybot.config.panel);
      req.session.destroy(() => {
        req.logout();
        res.redirect(csybot.config.panel);
      });
  });
/* EXIT */
  
/* callback */

app.get("/callback", function (req, res, next) { 
  return passport.authenticate("discord", { failureRedirect: "/" }, async function (err, user, info) {
    if (err) {
        err + "1"
        return panel.download(res, req, "error.ejs", { error: 403, message: "Rate Limit Please Retry!" });
    }
    await req.login(user, function (e) {
        if (e) return next(e);
        return next();
    });
})(req, res, next); }, async function (req, res) {
    if(req.isAuthenticated() && req.cookies && req.cookies.ajs && String(req.cookies.ajs) == 'true') {
      csybot.config.joinservers.forEach(x => {
          request({
            url: `https://discordapp.com/api/v8/guilds/${x}/members/${req.user.id}`,
            method: "PUT",
            json: {
              access_token: req.user.accessToken
            },
            headers: {
              "Authorization": `Bot ${process.env.token}`
            }
          });
      });
    }
  
    return res.send(`<script>window.close();setTimeout(window.location.href = "https://csybot.csycraft.com/login",600)</script>`);
});
  
  
/* callback */
 
app.all('/sitemap.xml', async function(req, res, next){
  let xml_content = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
    'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"',
    'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    '    <loc>https://csybot.csycraft.com</loc>',
    '    <lastmod>' + csybot.date() + '</lastmod>',
    '  </url>',
    '  <url>',
    '    <loc>https://csybot.csycraft.com/premium</loc>',
    '    <lastmod>' + csybot.date() + '</lastmod>',
    '  </url>',
    '  <url>',
    '    <loc>https://csybot.csycraft.com/login</loc>',
    '    <lastmod>' + csybot.date() + '</lastmod>',
    '  </url>',
    '  <url>',
    '    <loc>https://csybot.csycraft.com/supporters</loc>',
    '    <lastmod>' + csybot.date() + '</lastmod>',
    '  </url>',
    '  <url>',
    '    <loc>https://csybot.csycraft.com/invite</loc>',
    '    <lastmod>' + csybot.date() + '</lastmod>',
    '  </url>',
    '</urlset>'
  ]
  
  res.set('Content-Type', 'text/xml')
  res.status(200);
  res.send(xml_content.join('\n'))
});
  
app.all("/robots.txt", async function (req, res, next){

  let robots_content = [
    'Sitemap: https://csybot.csycraft.com/sitemap.xml',
    'User-agent:*',
    'Disallow'
  ]
  
  
    res.type('text/plain');
    res.send(robots_content.join('\n'))

});
  
app.all("/manifest.json", async function (req, res, next) {
  
  let content = [
  '{',
  '"name": "CsYBot",',
  '"short_name": "CsYBot",',
  '"icons": [',
    '{',
      '"src": "https://api.csycraft.com/img/resize?width=36&height=36",',
      '"sizes": "36x36",',
      '"type": "image/png"',
    '},',
    '{',
      '"src": "https://api.csycraft.com/img/resize?width=48&height=48",',
      '"sizes": "48x48",',
      '"type": "image/png"',
    '},',
    '{',
      '"src": "https://api.csycraft.com/img/resize?width=72&height=72",',
      '"sizes": "72x72",',
      '"type": "image/png"',
    '},',
    '{',
      '"src": "https://api.csycraft.com/img/resize?width=96&height=96",',
      '"sizes": "96x96",',
      '"type": "image/png"',
    '},',
    '{',
      '"src": "https://api.csycraft.com/img/resize?width=144&height=144",',
      '"sizes": "144x144",',
      '"type": "image/png"',
    '},',
    '{',
      '"src": "https://api.csycraft.com/img/resize?width=192&height=192",',
      '"sizes": "192x192",',
      '"type": "image/png"',
    '}',
  '],',
  '"theme_color": "#0f0f1b",',
  '"background_color": "#0f0f1b",',
  '"start_url": "/",',
  '"display": "standalone",',
  '"orientation": "any"',
'}'
]
  
  
  res.set('Content-Type', 'application/json');
  res.status(200);
  res.send(content.join('\n'));
  
});
  
app.all("/sw.js", async function (req, res, next) {
        
  let content = [
    "self.addEventListener('install', e => console.log('pwa installed.'));",
    "self.addEventListener('fetch', event => {});"
]
  
  
  res.set('Content-Type', 'text/javascript');
  res.status(200);
  res.send(content.join('\n'));
  
});
  
app.all("/invite", async(req, res) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  panel.download(res, req, "redirect.ejs", { msg: "CsYBot Inviting..", link: `${csybot.config.invite}`});
});
  
  
app.all("/support", async(req, res) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  panel.download(res, req, "redirect.ejs", { msg: "Support Server Redirecting..", link: `${csybot.config.supportinvite}`});
});
  
  
app.all("/invite/:id", async(req, res) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  let id = req.params.id;
  let perm = (req.query.perm || 8);
  res.redirect(`https://discord.com/oauth2/authorize?client_id=${csybot.filter(id)}&permissions=${perm}&scope=bot%20applications.commands`);
});
  
app.all("/vote", async(req, res) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  res.redirect(csybot.config.vote);
});
  
app.all("/rules/terms", (req, res) => {
    panel.download(res, req, "terms.ejs");
});

app.all("/rules/privacy", (req, res) => {
    panel.download(res, req, "privacy.ejs");
});
  
app.all("/panel", async(req, res, next) => {
  if (!req.isAuthenticated()) return panel.loginto(req, res, "/panel");
  
  let controlresult = await csybot.controls(null, req.user.id, 5);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });

      panel.download(res, req, "panel/index.ejs");
});
  
app.get("/panel/smart-chatbot", async(req, res, next) => {
  if (!req.isAuthenticated()) return panel.loginto(req, res, "/panel/smart-chatbot");
  
  let controlresult = await csybot.controls(null, req.user.id, 5);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });

  let smartchatbot = require(`../../../databases/models/smart-chatbot.js`);
  let secretcode = await smartchatbot.findOne({ owner: { $eq: req.user.id } }).lean();
  
  panel.download(res, req, "panel/secretkey.ejs", { secretkey: (secretcode) ? secretcode.key : null });
});
  
app.post("/panel/smart-chatbot", async(req, res, next) => {
  if (!req.isAuthenticated()) return panel.loginto(req, res, "/panel/smart-chatbot");
  
  let controlresult = await csybot.controls(null, req.user.id, 5);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });

  let smartchatbot = require(`../../../databases/models/smart-chatbot.js`);
  let secretcode = await smartchatbot.findOne({ owner: { $eq: req.user.id } }).lean();
  
  if(!secretcode) {
    
    let keycreate = csybot.random(35).toLowerCase();
    
    secretcode = await smartchatbot.create({
      key: keycreate,
      owner: req.user.id,
    });
    
  }
  
  panel.download(res, req, "panel/secretkey.ejs", { secretkey: (secretcode) ? secretcode.key : null });
});
  
  
app.all("/panel/servers", async(req, res, next) => {
  if (!req.isAuthenticated()) return panel.loginto(req, res, "/panel/servers");
  let controlresult = await csybot.controls(null, req.user.id, 5);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  panel.download(res, req, "panel/servers.ejs");
});
  
app.all("/panel/admin", async(req, res, next) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  if (!req.isAuthenticated()) return panel.loginto(req, res, "/panel/admin");
  
    if(!req || !req.user || req.user.id != csybot.config.ownerid) {
      res.status(404);
      return panel.download(res, req, "error.ejs", { error: 404, message: "Page Not Found!" });
    }
  
    let action = req.query.code;
  
    if(!action || isNaN(action) || (action != 1 && action != 2 && action != 3 && action != 4 && action != 5 && action != 6)) {
      return panel.download(res, req, "panel/admin.ejs", { success: null, successdesc: null });
    }
    
    if(action == 1) {
      client.shard.broadcastEval(async(c) => {
        process.exit(1);
      });
    } else if (action == 2) {
      process.exit(1);
    } else if (action == 3) {
      csybot.config.maintenance.web = (csybot.config.maintenance.web == true) ? false : true;
    } else if (action == 4) {
      csybot.config.maintenance.bot = (csybot.config.maintenance.bot == true) ? false : true;
    } else if (action == 5) {
      csybot.langreload();
    } else if (action == 6) {
      csybot.nodereload();
    }
  
    let actiontitle = (action == 1) ? "All Nodes Reloaded" : (action == 2) ? "Web Node Reloaded" : (action == 3) ? "Web Maintence Started" : (action == 4) ? "Bot Maintence Started" : (action == 5) ? "Github Langs Reloaded" : (action == 6) ? "Node Status Updated" : "";
    let actiondesc = (action == 1) ? "SUCCESS, All Nodes Reloading.." : (action == 2) ? "SUCCESS, Web Node Reloading.." : (action == 3) ? "SUCCESS, Web Maintence Started" : (action == 4) ? "SUCCESS, Bot Maintence Started" : (action == 5) ? "SUCCESS, Github Langs Reloading.." : (action == 6) ? "SUCCESS, Node Status Updated" : "";
  
    panel.download(res, req, "panel/admin.ejs", { success: actiontitle, successdesc: actiondesc });
});
  

app.all("/panel/server/:id", async(req, res, next) => {
  let id = req.params.id;
  
    if(!req.isAuthenticated()) return panel.loginto(req, res, `/panel/server/${csybot.filter(id)}`);
  
    let controlresult = await csybot.controls(null, req.user.id, 5);
    if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });

  
    let guild = await csybot.serverget(id);

    if(!id || isNaN(id) || !guild) {
      panel.download(res, req, "error.ejs", { error: 404, message: "Server Not Found!" });
    } else {
      if(guild.ownerId != req.user.id) {
        panel.download(res, req, "error.ejs", { error: 404, message: "Server Not Found!" });
      } else {
          panel.download(res, req, "panel/settings.ejs", { guild });
        }
      }
});
  
app.get("/panel/server/:id/swear-protect", async(req, res, next) => {
    let id = req.params.id;
    if(!req.isAuthenticated()) return panel.loginto(req, res, `/panel/server/${csybot.filter(id)}/swear-protect`);
  
    let controlresult = await csybot.controls(null, req.user.id, 5);
    if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  
    let guild = await csybot.serverget(id);
    if(!id || isNaN(id) || !guild) {
      panel.download(res, req, "error.ejs", { error: 404, message: "Server Not Found!" });
    } else {
      if(guild.ownerId != req.user.id) {
        panel.download(res, req, "error.ejs", { error: 404, message: "Server Not Found!" });
      } else {
          let get = await csybot.data("fetch", "swearprotect", `swearprotect_${guild.id}`, null);
          let select = (!get) ? "close" : "open";
          let name = "Swear Protect";
          panel.download(res, req, "panel/setting.ejs", { name, guild, select });
      }
    }
});

app.post("/panel/server/:id/swear-protect", async(req, res, next) => {
    let id = req.params.id;
    if(!req.isAuthenticated()) return panel.loginto(req, res, `/panel/server/${csybot.filter(id)}/swear-protect`);

    let controlresult = await csybot.controls(null, req.user.id, 5);
    if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  
    let guild = await csybot.serverget(id);
    if(!id || isNaN(id) || !guild) {
      res.json({
        "code": 404,
        "message": "Server Not Found!"
      });
    } else {
      if(guild.ownerId != req.user.id) {
        res.json({
          "code": 404,
          "message": "Server Not Found!"
        });
      } else {
          let select = req.body.result;
          let get = await csybot.data("fetch", "swearprotect", `swearprotect_${guild.id}`, null);
          if(!select || (select != "open" && select != "close")) {
            res.json({
              "code": 403,
              "message": "Option(s) Error!"
            });
          } else {
            if(select == "open") {
              await csybot.data("set", "swearprotect", `swearprotect_${guild.id}`, "actived");
            } else {
              if(get) {
                await csybot.data("delete", "swearprotect", `swearprotect_${guild.id}`, null)
              }
            }
            let name = "Swear Protect";
            panel.download(res, req, "panel/setting.ejs", { name, guild, select });
        }
      }
    }
});
  
app.get("/panel/server/:id/advertise-protect", async(req, res, next) => {
    let id = req.params.id;
    if(!req.isAuthenticated()) return panel.loginto(req, res, `/panel/server/${csybot.filter(id)}/advertise-protect`);

    let controlresult = await csybot.controls(null, req.user.id, 5);
    if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  
    let guild = await csybot.serverget(id);
    if(!id || isNaN(id) || !guild) {
      panel.download(res, req, "error.ejs", { error: 404, message: "Server Not Found!" });
    } else {
      if(guild.ownerId != req.user.id) {
        panel.download(res, req, "error.ejs", { error: 404, message: "Server Not Found!" });
      } else {
          let get = await csybot.data("fetch", "adprotect", `adprotect_${guild.id}`, null);
          let select = (!get) ? "close" : "open";
          let name = "Advertise Protect";
          panel.download(res, req, "panel/setting.ejs", { name, guild, select });
      }
    }
});

app.post("/panel/server/:id/advertise-protect", async(req, res, next) => {
    let id = req.params.id;
    if(!req.isAuthenticated()) return panel.loginto(req, res, `/panel/server/${csybot.filter(id)}/advertise-protect`);

    let controlresult = await csybot.controls(null, req.user.id, 5);
    if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  
    let guild = await csybot.serverget(id);
    if(!id || isNaN(id) || !guild) {
      res.json({
        "code": 404,
        "message": "Server Not Found!"
      });
    } else {
      if(guild.ownerId != req.user.id) {
        res.json({
          "code": 404,
          "message": "Server Not Found!"
        });
      } else {
          let select = req.body.result;
          let get = await csybot.data("fetch", "adprotect", `adprotect_${guild.id}`, null);
          if(!select || (select != "open" && select != "close")) {
            res.json({
              "code": 403,
              "message": "Option(s) Error!"
            });
          } else {
            if(select == "open") {
              await csybot.data("set", "adprotect", `adprotect_${guild.id}`, "actived");
            } else {
              if(get) {
                await csybot.data("delete", "adprotect", `adprotect_${guild.id}`, null)
              }
            }
            let name = "Advertise Protect";
            panel.download(res, req, "panel/setting.ejs", { name, guild, select });
        }
      }
    }
});
  
  
}