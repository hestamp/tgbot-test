const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '5702124363:AAFkGexhQJs66xmiPZkKxwcnSrn_8cxq0AY'

const bot = new TelegramApi(token, {polling:true})

const chats = {}


const startGame = async(chatId) => {
  await bot.sendMessage(chatId, 'I create number 0 to 9. You need to guess the number')
  const randomNumber = Math.floor(Math.random() * 10)
  chats[chatId] = randomNumber
  await bot.sendMessage(chatId, 'Guess the number!', gameOptions)
}

const start = () => {
  bot.setMyCommands([
    {command: '/start', description: 'Started command'},
    {command: '/info', description: 'About user info'},
    {command: '/game', description: 'Guess the number'},
  ])
  
  bot.on('message', async (msg) => {
    const text = msg.text
    const chatId = msg.chat.id
    if(text === '/start') {
      await bot.sendSticker(chatId, 'https://tgram.ru/wiki/stickers/img/goose_vk/gif/1.gif' )
      return bot.sendMessage(chatId, `Welcome to the jungle`)
    }
    if(text === '/info') {
      return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`)
    }
    if(text === '/game') {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, 'Wrong command, baby')
  })

  bot.on('callback_query', async msg => {
    const data = msg.data
    const chatId = msg.message.chat.id
    if(data == '/again') {
      return startGame(chatId)
    }
if(data == chats[chatId]){
  return await bot.sendMessage(chatId, 'Yeah, thats correct!', againOptions)
} else {
  return await bot.sendMessage(chatId, `You were wrong, its not ${data}! I guess ${chats[chatId]}`, againOptions)
}  
  })
}

start()