const base = "http://api.brainshop.ai/get";

const superagent = require("superagent");
const axios = require("axios");
const globalfun = require("../functions/global.js");
const csybot = new globalfun(null, null);
module.exports = function() {

this.fetchResponse = async function(message, name, owner, user, lang, datas) {
  
var question = null;
  
if(lang != "en") {
   question = await csybot.translate(message, 'en').catch(err => err + "1");
} else {
   question = message
}

  let params = {
    'bid': csybot.config.dependencies.smart_chatbot.secrets.bid,
    'key': csybot.config.dependencies.smart_chatbot.secrets.secretkey,
    'uid': user,
    'msg': question
  };
  let request = await axios.get(base, { params }).catch(err => err + 1)
  if(request && request.data && request.data.cnt) {
    let res = request.data.cnt;
    let filtered2 = res.replace(csybot.config.dependencies.smart_chatbot.secrets.namepas, ((name) ? csybot.filter(name) : csybot.config.botname))
    .replace(csybot.config.dependencies.smart_chatbot.secrets.ownerpas, ((owner) ? csybot.filter(owner) : csybot.config.ownername))
    
    .replace(csybot.config.dependencies.smart_chatbot.secrets.genderpas, ((datas.gender) ? csybot.filter(datas.gender) : "female"))
    .replace(csybot.config.dependencies.smart_chatbot.secrets.locationpas, ((datas.location) ? csybot.filter(datas.location) : "https://csycraft.com"))
    .replace(csybot.config.dependencies.smart_chatbot.secrets.emailpas, ((datas.email) ? csybot.filter(datas.email) : "brain@csycraft.com"))
    .replace(csybot.config.dependencies.smart_chatbot.secrets.birthpas, ((datas.birth) ? csybot.filter(datas.birth) : "https://csycraft.com"))
    
    
    .replaceAll("@", "")
    .replaceAll("acobot.ai", "Problem")
    .replaceAll("aco", "")
    .replaceAll("acobot", name)
    .replaceAll("Acobot", name)
    .replaceAll("Aco", name);
    return filtered2;
  } else {
    return null;
  }
  
}
  
this.translate = async function(message, lang) {

  if(lang == "en") return message;
  
  let translated = await csybot.translate(message, `${lang}`).catch(err => err + "1");
  return translated;
  
}

this.shortcuts = function(msg) {
  
  let filtered = (msg).toLowerCase();
  
  let translate = [
    {
      "result": "hello",
      "transitions": ["sa", "selamun aleyküm", "selamun", "aleyküm", "merhaba"],
      "trued": true
    },
    {
      "result": "whats' up",
      "transitions": ["naber", "nabıyon", "neabıyon", "naberr", "nabıon", "nasılsın", "nasilsin", "nasilsın", "nasılsin"],
      "trued": true
    },
    {
      "result": "Ha! ha! Very Funny 🤮",
      "transitions": ["31", "otuzbir"],
      "trued": true
    }
  ];

  let res = translate.find(el => el.transitions.includes(filtered) == true);
  return (res && res.result) ? res.result : msg;
}
  
  
this.chat = function(messag, user, botname, ownername, lang = "tr", datas = {} ) {

  return new Promise(async(resolve, reject) => {
    if (!messag) return resolve("An error occurred");
    let messa = (messag).toLowerCase();
    let message = csybot.filter(messa, 200);
    
    if (typeof message !== "string" || message.length > 200) return resolve("An error occurred");
    if (!user) user = 1;
    var result = (lang == "tr") ? this.shortcuts(message) : message;
    
    if(message.split(" ").includes("cortex")) {
     let msgggg = "cortex lives in my next apartment. Every day there is noise, it's so annoying";
     let translatedingg = await this.translate(msgggg, lang);
      
     resolve(translatedingg);
    };
    
    let reply = await this.fetchResponse(result, ((botname) ? csybot.filter(botname) : csybot.config.botname), ((ownername) ? csybot.filter(ownername) : csybot.config.ownername), user, lang, datas);
    let error1 = csybot.lang("en", "brain_problem");
    if(!reply || reply == null || reply == undefined || reply == "undefined") return resolve(error1);
    
    let translated = await this.translate(reply, lang);
    
    let filtered1 = csybot.filter(translated, 200);
    resolve(filtered1);
  });
}


}