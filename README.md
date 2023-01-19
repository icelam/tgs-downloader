# TGS Downloader

This is a CLI tool created for downloading animated stickers (\*.tgs) from Telegram, and output them in WebP format.

## Prerequisites

1. Install Node.js 14+
2. Install command-line version of [Gifsk](https://gif.ski/)

### Setup
##### 1. Configure token used to interact with Telegram API
For first time user, please create `.env` file in the project root with the following content:
```
BOT_TOKEN=<TELEGRAM_BOT_TOKEN>
```

To get a bot token, simply follow the below steps:
1. In Telegram, search for the user `@BotFather`.
2. Use the command `\newbot` and choose a name and username for your bot.
3. `@BotFather` will return you the token of the bot created. Remember to keep it safe!

##### Install project dependencies
```
yarn install
```

### How to use

Simply run the command below. The stickers will be download to `output` directory in WebP format.

``` bash
node src/index ANIMATED_STICKER_SET_1 ANIMATED_STICKER_SET_2 ANIMATED_STICKER_SET_3
```
