module.exports = {
  "botid": "CLIENT ID",
  "ownername": "OWNER NAME",
  "botname": "BOT NAME",
  "defaultlang": "en",
  "supportguildid": "SUPPORT GUILD ID",
  "testguildid": "TEST GUILD ID",
  "ownerid": "OWNER ID",
  "invite": "https://discord.com/oauth2/authorize?response_type=code&redirect_uri=https://URL_WEB/callback&scope=bot+identify+guilds+guilds.join+applications.commands&client_id=BOT_ID&permissions=8",
  "supportinvite": "SUPPORT SERVER INVITE",
  "github": "https://github.com/bucksh0tdev/csybot",
  "youtubeinvite": "YOUTUBE CHANNEL LINK",
  "voices": ["VOICE CHANNEL ID 1", "VOICE CHANNEL ID 2"],
  "topggtoken": "TOP.GG TOKEN",
  "topggpass": "TOP.GG PASSWORD",
  "topggrecive": 2500,
  "cooldown": 10000,
  "uptime": 1644681991210,
  "rightarrow": "RIGHT ARROW EMOJI",
  "callbackURL": "https://URL_WEB/callback",
  "panel": "https://URL_WEB",
  "email": "EMAIL",
  "oauthSecret": process.env.secret,
  "scope": ["identify", "guilds", "guilds.join"],
  "vote": "https://top.gg/bot/BOT_ID/vote",
  "keywords": ["CsYBot", "CsYBot manage", "dashboard", "discord", "bot", "CsYBott", "CsYB", "CsYBo", "csybot", "csybot easy", "csybot topgg", "csy", "discord spam protect", "discord bot yapma", "discord vscode bot"],
  "joinservers": ["SERVER ID 1", "SERVER ID 2"],
  "description": "CsYBot is always fast safe Start using it and your server will be colorful!",
  "prefix": ["c!", "/"],
  "shards": 2,
  
  // Vote
  "vote_tracker_webhook": "VOTE TRACKER WEBHOOK",
  "voteonrole": true,
  "voterole": "VOTER ROLE ID",
  
  // Premium
  "premiumbuy": "https://URL_WEB/premium",
  "premium_webhook": "PREMIUM WEBHOOK",
  
  // Google
  "google": {
    "recaptcha": {
      "secretkey": "RECAPTCHA SECRET KEY",
      "publickey": "RECAPTCHA PUBLIC KEY"
    }
  },

  // Maintenance
  "maintenance": {
    "bot": false,
    "web": false,
    "bot_message": "We Design Better For You. We are in maintenance.",
    "web_message": "We Design Better For You. We are in maintenance."
  },
  "web": {
    "uptimepath": "https://API_URL_WEB/uptime",
    "apipath": "https://API_URL_WEB",
    "pingpath": "PING PATH",
  },
  
  
  // Colors
  "green": 3066993,
  "yellow": 16776960,
  "red": 15158332,
  "blue": 3447003,
  "orange": 15105570,
  "black": 2303786,
  
  
  // Dependencies
  "dependencies": {
    "smart_chatbot": {
      "version": "1.4.0",
      "bdfd_version": "v2",
      "webhook": "SMART CHATBOT WEBHOOK",
      "supported_langs": ["tr", "en", "pt"],
      "secrets": {
        'secretkey': "SECRET KEY",
        'bid': "163963",
        'namepas': "264963",
        'ownerpas': "264983",
        
        'genderpas': "231911",
        'locationpas': "22682",
        'emailpas': "264821",
        'birthpas': "264895"
      },
      "problem": false
    }
  },
  "data_logger_webhook": "DATA LOGGER WEBHOOK",
  
  "sponsored": {
    "name": "yok",
    "url": "https://discord.gg/yok",
    "text": "Sponsor: Yok!"
  },
  
  "linkservice": {
    "url": "https://link.csycraft.com",
    "rurl": "https://link.csycraft.com",
    "domain": "link",
    "maxlimit": 200,
    "maxchar": 90
  }
}