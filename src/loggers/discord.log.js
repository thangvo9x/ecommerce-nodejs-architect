'use strict';

const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on('ready', () => {
  console.log('Logged as ', client.user.tag);
});

const token =
  'MTEyMDcwNDgxMzc1NjMzMDA3NQ.GfkYQo.l-Fteqa6hak4Lq_Ekus-spcFVkd-vAwNZZRwl4';
client.login(token);

client.on('messageCreate', msg => {
  // if(msg.author.bot) return;
  if (msg.content === 'hello') {
    msg.reply('Hello! how are u today ?');
  }
});
