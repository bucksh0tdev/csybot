const global = require("../../../functions/global.js");
module.exports = function(client, realapp, app, panel) {
const csybot = new global(client, null);
  
app.all("/", async(req, res) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  panel.download(res, req, "main.ejs");
  //res.redirect("https://csybot.csycraft.com");
});
  
app.all("/uptime", async(req, res) => {
  await panel.uptime();
  res.status(200).json({
    "message": "All Project Uptimed!",
    "code": 200
  });
});

  
app.get('/sitemap.xml', async function(req, res, next){
  let xml_content = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"',
    'xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"',
    'xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    '  <url>',
    '    <loc>https://csycraft.com</loc>',
    '    <lastmod>' + csybot.date() + '</lastmod>',
    '  </url>',
    '</urlset>'
  ]
  
  res.set('Content-Type', 'text/xml')
  res.status(200);
  res.send(xml_content.join('\n'))
});
  
app.get("/robots.txt", async function (req, res, next){

  let robots_content = [
    'Sitemap: https://csycraft.com/sitemap.xml',
    'User-agent:*',
    'Disallow'
  ]
  
  
    res.type('text/plain');
    res.send(robots_content.join('\n'))

});
  
app.all("/manifest.json", async function (req, res, next) {
  
  let content = [
  '{',
  '"name": "CsYHub",',
  '"short_name": "CsYHub",',
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
  
  
app.all("/youtube", async function (req, res, next) {
  res.redirect(csybot.config.youtubeinvite);
});
  
app.all("/support", async(req, res) => {
  let controlresult = await csybot.controls(null, null, 1);
  if(controlresult != false) return res.status(200).json({ "message": `${controlresult.message}`, "code": 404 });
  
  panel.download(res, req, "redirect.ejs", { msg: "Support Server Redirecting..", link: `${csybot.config.supportinvite}`});
});
  
}