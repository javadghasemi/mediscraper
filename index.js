import TelegramBot from 'node-telegram-bot-api';
import nodeProxy from 'node-global-proxy';
import {create} from "soundcloud-downloader";
import 'dotenv/config.js';

const proxy = nodeProxy.default;
const scdl = create({
  clientID: process.env.SOUNDCLOUD_CLIENT_ID
});

proxy.setConfig({
  http: "http://127.0.0.1:10809",
  https: "http://127.0.0.1:10809",
});
proxy.start();

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling: true});

bot.onText(/\/soundcloud/, async (msg, match) => {
  const chatID = msg.chat.id;
  const url = msg.text;
  const soundInfo = await scdl.getInfo(url);

  if (!soundInfo) {
    return await bot.sendMessage(chatID, 'Requested music is not found!');
  }

  const mediaStream = await scdl.download(url);
  await bot.sendPhoto(chatID, soundInfo.artwork_url.replace('large', 't500x500'));

  await bot.sendAudio(chatID, mediaStream);
  bot.sendMessage(chatID, match[0]);
});