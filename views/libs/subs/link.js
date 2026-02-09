const axios = require("axios");
const global = require("../../../functions/global.js");
module.exports = function(client, realapp, app, panel) {
const csybot = new global(client, null);
  
  
app.get('/', async function(req, res) {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  panel.download(res, req, "link.ejs", { error: false, errormsg: null, success: false, shortedcode: null });
});
  
app.all('/:code', async function(req, res, next) {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  let code = csybot.filter(req.params.code);
  
  let codecontrol = String(code).split("");
  if(codecontrol.includes(".")) return next();
  
  if(!code || code == "") return panel.download(res, req, "error.ejs", { error: 404, message: "Link Not Found!" });
  
  let data = await csybot.shortlinkcontrol(code);
  
  if(data == false) return panel.download(res, req, "error.ejs", { error: 404, message: "Link Not Found!" });
  
  let parse = JSON.parse(data.data);
  
  return panel.download(res, req, "link-redirect.ejs", { link: csybot.filter(parse.link) });
});
  
  
app.post('/', async function(req, res) {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  let captcha = req.body["g-recaptcha-response"];
  let string = req.body["link"];
  
  if(!string) return panel.download(res, req, "link.ejs", { error: true, errormsg: "Not Found Link", success: false, shortedcode: null });
  let url = csybot.urlcontrol(string);
  if(url == false) return panel.download(res, req, "link.ejs", { error: true, errormsg: "Not Found Link", success: false, shortedcode: null });
  
  if(!captcha) return panel.download(res, req, "link.ejs", { error: true, errormsg: "The captcha could not be verified." });
  let captchacontrol = await axios.get(`https://www.google.com/recaptcha/api/siteverify?secret=${csybot.config.google.recaptcha.secretkey}&response=${captcha}&remoteip=${req.headers['x-forwarded-for']}`).catch(err => err + "1");
  if(!captchacontrol || !captchacontrol.data || !captcha) return panel.download(res, req, "link.ejs", { error: true, errormsg: "The captcha could not be verified.", success: false, shortedcode: null });

  if(captchacontrol.data.success != true) return panel.download(res, req, "link.ejs", { error: true, errormsg: "The captcha could not be verified.", success: false, shortedcode: null });
  
  if(String(url).length > csybot.config.linkservice.maxchar) return panel.download(res, req, "link.ejs", { error: true, errormsg: `Link Max Character Limit Exceeded (${csybot.config.linkservice.maxchar}/${String(url).length})`, success: false, shortedcode: null }); 
  
  let nowlimit = await csybot.data("count", "shortlink", "link");
  if(nowlimit >= csybot.config.linkservice.maxlimit) return panel.download(res, req, "link.ejs", { error: true, errormsg: "The maximum number of link shortening has been reached in our services.", success: false, shortedcode: null });
  
  let controling = await csybot.shortlinkcontrol(url, false);
  if(controling != false) {
    let parsss = JSON.parse(controling.data);
    return panel.download(res, req, "link.ejs", { error: false, errormsg: null, success: true, shortedcode: parsss.shorted });
  }
  
  let now = new Date().getTime();
  
  let short = await csybot.shortlink();
  
  let json = {
    shorted: short,
    id: now,
    link: url
  }
  
  await csybot.data("set", "shortlink", `link_${now}`, JSON.stringify(json))
  
  panel.download(res, req, "link.ejs", { error: false, errormsg: null, success: true, shortedcode: short });
});
  
app.all('/sitemap.xml', async function(req, res, next){
  let xml_content = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
    'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"',
    'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    '    <loc>https://link.csycraft.com</loc>',
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
    'Sitemap: https://link.csycraft.com/sitemap.xml',
    'User-agent:*',
    'Disallow'
  ]
  
  
    res.type('text/plain');
    res.send(robots_content.join('\n'))

});
  
app.all("/manifest.json", async function (req, res, next) {
  
  let content = [
  '{',
  '"name": "CsYLink",',
  '"short_name": "CsYLink",',
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
  
  
}