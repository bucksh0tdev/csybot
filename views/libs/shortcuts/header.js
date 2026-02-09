module.exports = function(client, csybot, path) {
  let location = path
    .replaceAll("panel/index.ejs", "Dashboard")
    .replaceAll("index.ejs", "Home")
    .replaceAll("supporters.ejs", "Supporters")
    .replaceAll("main.ejs", "Hub")
    .replaceAll("premium.ejs", "Premium")
    .replaceAll("link-redirect.ejs", "Redirecting")
    .replaceAll("redirect.ejs", "Redirecting")
    .replaceAll("message.ejs", "Join Web Protect")
    .replaceAll("webprotect.ejs", "Join Web Protect")
    .replaceAll("privacy.ejs", "Privacy")
    .replaceAll("terms.ejs", "Terms")
    .replaceAll("panel/secretkey.ejs", "SecretKey")
    .replaceAll("panel/servers.ejs", "Servers")
    .replaceAll("panel/settings.ejs", "Settings")
    .replaceAll("panel/login.ejs", "Login")
    .replaceAll("panel/admin.ejs", "Admin")
    .replaceAll("panel/setting.ejs", "Settings")
    .replaceAll("error.ejs", "Error")
    .replaceAll("link.ejs", "Link");

  var header = "";

  if (
    location == "Dashboard" ||
    location == "Servers" ||
    location == "Settings" ||
    location == "Login" ||
    location == "Admin" ||
    location == "SecretKey"
  ) {
    header = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons+Sharp" rel="stylesheet" />
    <link rel="stylesheet" href="${csybot.config.web.apipath}/libs/css/panel.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" />
    <meta name="twitter:card" value="summary">
    <meta name="twitter:title" content="CsYBot - Dashboard">
    <meta name="twitter:description" content="${csybot.config.description}">
    <meta name="twitter:image" content="${csybot.config.web.apipath}/libs/img/logo.png">
    <meta name="title" content="CsYBot - Dashboard">
    <meta name="description" content="${csybot.config.description}">
    <meta name="keywords" content="${csybot.config.keywords
      .map(x => x)
      .join(", ")}">
    <meta name="image" content="${csybot.config.web.apipath}/libs/img/logo.png">
    <meta itemprop="image" content="${csybot.config.web.apipath}/libs/img/logo.png"  />
    <meta http-equiv="Content-Type" content="text/html; charset=utf8">
    <meta name="revisit-after" content="1 days">
    <meta name="google" content="notranslate" />
    
    <link rel="icon" href="${csybot.config.web.apipath}/libs/img/logo.png">
    
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6804591694961902"
    crossorigin="anonymous"></script>
    
    <title>CsYBot - ${location}</title>
  `;
  } else if (location == "Hub") {
    header = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    <meta name="twitter:card" value="summary">
    <meta name="twitter:title" content="CsYBot - Hub">
    <meta name="twitter:description" content="All Software Made By CsY Team Here!">
    <meta name="twitter:image" content="${csybot.config.web.apipath}/libs/img/logo.png">
    <meta name="title" content="CsYBot - Hub">
    <meta name="description" content="All Software Made By CsY Team Here!">
    <meta name="keywords" content="${csybot.config.keywords
      .map(x => x)
      .join(", ")}">
    <meta name="image" content="${csybot.config.web.apipath}/libs/img/logo.png">
    <meta itemprop="image" content="${csybot.config.web.apipath}/libs/img/logo.png"  />
    <meta http-equiv="Content-Type" content="text/html; charset=utf8">
    <meta name="revisit-after" content="1 days">
    <meta name="google" content="notranslate" />
    
    <link rel="stylesheet" href="${csybot.config.web.apipath}/libs/css/bootstrap.min.css">
    <link rel="stylesheet" href="${csybot.config.web.apipath}/libs/css/main.css?v=0.0.1">
    <link rel="stylesheet" href="${csybot.config.web.apipath}/libs/css/global.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,600,700,800,900&display=swap" rel="stylesheet">
    <link rel="icon" href="${csybot.config.web.apipath}/libs/img/logo.png">
    
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6804591694961902"
    crossorigin="anonymous"></script>
    
    <title>CsYBot - ${location}</title>
  `;
  } else if (location == "Error") {
    header = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    <meta name="twitter:card" value="summary">
    <meta name="twitter:title" content="CsYBot - Error">
    <meta name="twitter:description" content="${csybot.config.description}">
    <meta name="twitter:image" content="${csybot.config.web.apipath}/libs/img/logo.png">
    <meta name="title" content="CsYBot - Error">
    <meta name="description" content="${csybot.config.description}">
    <meta name="keywords" content="${csybot.config.keywords
      .map(x => x)
      .join(", ")}">
    <meta name="image" content="${csybot.config.web.apipath}/libs/img/logo.png">
    <meta itemprop="image" content="${csybot.config.web.apipath}/libs/img/logo.png"  />
    <meta http-equiv="Content-Type" content="text/html; charset=utf8">
    <meta name="revisit-after" content="1 days">
    <meta name="google" content="notranslate" />
    
    <link rel="stylesheet" href="${csybot.config.web.apipath}/libs/css/bootstrap.min.css">
    <link rel="stylesheet" href="${csybot.config.web.apipath}/libs/css/main.css?v=0.0.1">
    <link rel="stylesheet" href="${csybot.config.web.apipath}/libs/css/global.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,600,700,800,900&display=swap" rel="stylesheet">
    <link rel="icon" href="${csybot.config.web.apipath}/libs/img/logo.png">
    
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6804591694961902"
    crossorigin="anonymous"></script>
    
    <title>CsYBot - ${location}</title>
  `;
  } else {
    header = `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    
    <meta name="twitter:card" value="summary">
    <meta name="twitter:title" content="CsYBot - ${location}">
    <meta name="twitter:description" content="${csybot.config.description}">
    <meta name="twitter:image" content="${csybot.config.web.apipath}/libs/img/logo.png">
    <meta name="title" content="CsYBot - ${location}">
    <meta name="description" content="${csybot.config.description}">
    <meta name="keywords" content="${csybot.config.keywords
      .map(x => x)
      .join(", ")}">
    <meta name="image" content="${csybot.config.web.apipath}/libs/img/logo.png">
    <meta itemprop="image" content="${csybot.config.web.apipath}/libs/img/logo.png"  />
    <meta http-equiv="Content-Type" content="text/html; charset=utf8">
    <meta name="revisit-after" content="1 days">
    <meta name="google" content="notranslate" />
    
    ${(location != "Terms" && location != "Privacy") ? `<link rel="stylesheet" href="${csybot.config.web.apipath}/libs/css/bootstrap.min.css">
    <link rel="stylesheet" href="${csybot.config.web.apipath}/libs/css/main.css?v=0.0.1">
    <link rel="stylesheet" href="${csybot.config.web.apipath}/libs/css/global.css">` : ""}
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.11.2/css/all.min.css" />
    <link href="https://fonts.googleapis.com/css?family=Poppins:300,400,600,700,800,900&display=swap" rel="stylesheet">
    <link rel="icon" href="${csybot.config.web.apipath}/libs/img/logo.png">
    
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6804591694961902"
    crossorigin="anonymous"></script>
    
    <title>CsYBot - ${location}</title>
  `;
  }

  let pwa = `
    <link rel="manifest" href="/manifest.json">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-title" content="CsYBot">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link href="${csybot.config.web.apipath}/libs/img/iphone5_splash.png" media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
    <link href="${csybot.config.web.apipath}/libs/img/iphone6_splash.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
    <link href="${csybot.config.web.apipath}/libs/img/iphoneplus_splash.png" media="(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
    <link href="${csybot.config.web.apipath}/libs/img/iphonex_splash.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" rel="apple-touch-startup-image" />
    <link href="${csybot.config.web.apipath}/libs/img/ipad_splash.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
    <link href="${csybot.config.web.apipath}/libs/img/ipadpro1_splash.png" media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
    <link href="${csybot.config.web.apipath}/libs/img/ipadpro2_splash.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)" rel="apple-touch-startup-image" />
    <link rel="apple-touch-icon" sizes="128x128" href="${csybot.config.web.apipath}/img/resize?width=128&height=128">
    <link rel="apple-touch-icon-precomposed" sizes="128x128" href="${csybot.config.web.apipath}/img/resize?width=128&height=128">
    <link rel="icon" sizes="192x192" href="${csybot.config.web.apipath}/img/resize?width=192&height=192">
    <link rel="icon" sizes="128x128" href="${csybot.config.web.apipath}/img/resize?width=128&height=128">`
  
  return header + pwa + require("./gtag.js")(location) + require("./loader.js")(csybot, location);
}