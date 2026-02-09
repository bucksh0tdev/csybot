# CsYBot

CsYBot, Discord sunuculari icin gelismis moderasyon ve panel ozellikleri sunan, shard destekli bir bot ve web panel projesidir. Bu depo; bot cekirdegi, web panel, komutlar, event'ler ve MongoDB tabanli veri katmanini birlikte icerir.

## Ozellikler
- Shard destekli Discord bot altyapisi
- Web panel (Express + EJS)
- OAuth2 ile Discord girisi
- Top.gg oy takibi ve webhook bildirimleri
- Uptime kontrolu ve API entegrasyonlari
- Dil dosyalari ile coklu dil destegi

## Teknoloji
- Node.js
- discord.js v13
- Express, EJS
- MongoDB (Mongoose)
- Passport (Discord OAuth)

## Kurulum
1. Depoyu klonlayin.
2. Bagimliliklari kurun:

```bash
npm install
```

3. Ortam degiskenlerini ayarlayin (ornegin `.env`):

```bash
# zorunlu
PORT=3000
mongodb=mongodb+srv://<user>:<pass>@<cluster>/<db>
token=DISCORD_BOT_TOKEN
secret=DISCORD_OAUTH_CLIENT_SECRET

# opsiyonel / entegrasyonlar
TOPGG_TOKEN=
TOPGG_PASS=
RECAPTCHA_SECRET=
RECAPTCHA_PUBLIC=
```

4. `config.js` icindeki placeholder alanlarini kendi degerlerinizle guncelleyin.

## Calistirma
```bash
npm start
```

Bu komut `shard.js` uzerinden shard yonetimini baslatir. Web panel, shard 0 uzerinden ayaga kalkar.

## Dizin Yapisi (kisa)
- `commands/` Discord komutlari
- `events/` Discord event handler'lari
- `functions/` ortak fonksiyonlar / yardimcilar
- `views/` web panel ve API katmani
- `databases/` MongoDB modelleri ve veri erisimi

## Guvenlik Notlari
- Gercek token/secret degerlerini repoya koymayin. `config.js` ve `.env` bilgilerini gizli tutun.
- `views/libs/global.js` icinde sabit session secret bulunuyor. Bunu ortam degiskeni yapmaniz onerilir.

## Lisans
MIT