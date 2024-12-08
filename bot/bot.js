//Imports
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const handlers = require('./handlers');
const userController = require('../controllers/userController');

//Varivables
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, {polling : true});

//Functionality
bot.on('message', async(msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;
    const telegram_id = msg.from.username;
    const userName = msg.from.username;

    await userController.authorizeUser(telegram_id, userName);

    if (text === '/start') {
        handlers.startCommand(bot,msg)
    } else {
        bot.sendMessage(chatId, 'Привет, пропиши /start и появиться дальнейшая инструкция по входу в наш магазин!')
    }
});

bot.on('polling_error', (error) => {
    console.log('Polling Error',error);
    console.log('Error Code',error.code);
    console.log('Error Response',error.response);
    console.log('Error Description',error.description);
})

module.exports = bot;