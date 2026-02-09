const path = require("path");
const passport = require("passport");
const url = require("url");
const axios = require("axios");
const Discord = require("discord.js");
const https = require('http-request');
const superagent = require("superagent");
const Strategy = require("passport-discord").Strategy;
const express = require("express");
const http = require("http");
const fs = require("fs");
const session = require("express-session");
const MemoryStore = require('memorystore')(session);
const subdomain = require('express-subdomain');
const globalfun = require("../../functions/global.js");
const brainfun = require("../../functions/brain.js");
const brain = new brainfun();
module.exports = function (client, app, listener) {
const csybot = new globalfun(client, null);
  
const mainlocation = path.resolve(`${process.cwd()}${path.sep}views`);
const templateslocation = path.resolve(`${mainlocation}${path.sep}views${path.sep}`);
  
this.download = async function(res, req, template, data = {}) {
  
let headershortcut = require(path.join(__dirname, "shortcuts/header.js"));
let pwashortcut = require(path.join(__dirname, "shortcuts/pwa.js"));
let realfooter = require(path.join(__dirname, "shortcuts/realfooter.js"));
let footerdesingshortcut = require(path.join(__dirname, "shortcuts/footerdesing.js"));
  
  let lang = await csybot.getlang();
  
    const baseData = {
      client: client,
      user: (req.user) ? req.user : null,
      base: (!data.lang) ? csybot.config.panel : csybot.config.panel/* + "/" + data.lang*/,
      rbase: csybot.config.panel,
      path: req.path,
      lang: lang,
      csybot: csybot,
      stats: { users: await csybot.user(true), guilds: await csybot.guilds(true), channels: await csybot.channels(true), userss: await csybot.user(), guildss: await csybot.guilds(), channelss: await csybot.channels() },
      header: headershortcut(client, csybot, template), 
      pwa: pwashortcut(client, csybot, template),
      footerdesing: footerdesingshortcut(client, csybot, template),
      logs: (template == "panel/index.ejs") ? await csybot.webmoneylogs(req.user.id) : "",
      features: (template.startsWith("panel/") && template != "panel/login.ejs") ? await csybot.data("fetch", "voice", `voice_${req.user.id}`, null) : "",
      voters: (template == "supporters.ejs") ? await csybot.supporters() : "",
      realfooter: realfooter(client, csybot, template)
    };
    res.render(path.resolve(`${templateslocation}${path.sep}${template}`), Object.assign(baseData, data), /*{ async: true } */);
    
};
this.loginrequired = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  req.session.backURL = req.url;
  res.redirect("/giris");
}
  
this.login = function (csybotsub) {
let strategy = new Strategy({
  clientID: csybot.config.botid,
  clientSecret: csybot.config.oauthSecret,
  callbackURL: csybot.config.callbackURL,
  scope: csybot.config.scope
}, async (accessToken, refreshToken, profile, cb) => {
    await process.nextTick(async () => {
        if (profile.guilds == undefined) return cb(null, false);
        
        return cb(null, profile);
    });
});
  
passport.use(strategy);
  
passport.serializeUser((user, done) => {
    if (!user) return;
    return done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

csybotsub.use(session({
  secret: 'aaqwce165dsadnsqwce1q5wec15qwsddasnmndasdasdasdasdsdaghasdaa',
  key: "aadsadnsqwcewqec1qwe561q5wec15qwsddasnmndasdasdasdasdsdaghasdaa",
  resave: false,
  saveUninitialized: false,
  store: new MemoryStore({
      checkPeriod: 86400000
  }),
  cookie: {
      maxAge: 86400000,
  }
}));

csybotsub.use(passport.initialize());
csybotsub.use(passport.session());
  
}
  
this.end = function() {
app.use(async function (err, req, res, next) {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  let globalfun2 = require("../libs/global.js");
  let panel = new globalfun2(client, app);
  res.status(500);
  panel.download(res, req, "error.ejs", { error: 500, message: "Internal Error" });
})
  
app.use(async(req, res, next) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  let globalfun2 = require("../libs/global.js");
  let panel = new globalfun2(client, app);
    res.status(404);
  panel.download(res, req, "error.ejs", { error: 404, message: "Page Not Found!" });
})

} 

this.subdomain = function(subdomainname) {
  
let router = express.Router();
  
app.use(subdomain(subdomainname, router));
return router;
  
}
  
this.uptime = async function() {
  var links = [];
  let uptimemodal = require(`../../databases/models/uptime.js`);
  const cursor = uptimemodal.find().cursor();
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    links.push(doc.link);
  }
  axios.get(`${csybot.config.web.pingpath}`, { 
    headers: { 
      'User-Agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.20 Safari/537.36',
      'Authorization': `${String(links)}`
    }
  }).catch(err => err + "1");
  return true;
}
  
  
this.loginto = function(req, res, to) {
    req.session.redirect = to;
    return res.redirect(csybot.config.panel + "/login");
}
  
  
  
}