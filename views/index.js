const path = require("path");
const passport = require("passport");
const url = require("url");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const Discord = require("discord.js");
const Strategy = require("passport-discord").Strategy;
const express = require("express");
const axios = require("axios");
const request = require("request");
const subdomain = require('express-subdomain');
const session = require("express-session");
const minifyHTML = require('express-minify-html-terser');
const cookieParser = require('cookie-parser');
const globalfun = require("../functions/global.js");
const panelfun = require("./libs/global.js");
module.exports = async (client, app) => {

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); 
  
app.engine("html", ejs.renderFile);
app.set("view engine", "html");
  
const csybot = new globalfun(client, null);
const panel = new panelfun(client, app);

app.use(minifyHTML({
  override: true,
  exception_url: false,
  htmlMinifier: {
    removeComments: true,
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    removeAttributeQuotes: true,
    removeEmptyAttributes: true,
    minifyJS: true
  }
}));

app.use(cookieParser());
  
let csybotsub = panel.subdomain("csybot");
let apisub = panel.subdomain("api");
let link = panel.subdomain(csybot.config.linkservice.domain);
let sponsor = panel.subdomain(csybot.config.sponsored.name);
  
panel.login(csybotsub);
require("./libs/subs/csybot.js")(client, app, csybotsub, panel);
require("./libs/subs/main.js")(client, app, app, panel);
require("./libs/subs/api.js")(client, app, apisub, panel);
require("./libs/subs/sponsor.js")(client, app, sponsor, panel);
require("./libs/subs/link.js")(client, app, link, panel);
  
  
/* END Handlers */
panel.end();
/* END Handlers */
};