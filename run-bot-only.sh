#!/bin/bash

echo "🤖 Запуск только Telegram бота"
echo "============================"

cd /root/vitasync-telegram-webapp

# Загружаем переменные окружения
echo "📁 Загрузка переменных окружения..."
set -a
source .env
set +a

echo ""
echo "📱 Токен бота: ${TELEGRAM_BOT_TOKEN:0:20}..."
echo "🌐 WebApp URL: $TELEGRAM_WEBAPP_URL"
echo ""

# Создаем простой скрипт для запуска бота
cat > test-bot.js << 'EOF'
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

console.log('🤖 Запуск бота...');

// Start command
bot.command('start', async (ctx) => {
  console.log('📨 Получена команда /start от:', ctx.from.username);
  
  const webAppUrl = `${process.env.TELEGRAM_WEBAPP_URL}?tg_user_id=${ctx.from.id}`;
  
  await ctx.reply('Добро пожаловать в VitaSync! 💊', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🚀 Открыть приложение',
            web_app: { url: webAppUrl }
          }
        ]
      ]
    }
  });
});

// Log all messages
bot.on('message', (ctx) => {
  console.log('💬 Сообщение от', ctx.from.username, ':', ctx.message.text);
});

// Error handling
bot.catch((err, ctx) => {
  console.error('❌ Ошибка:', err);
});

// Launch bot
bot.launch()
  .then(() => {
    console.log('✅ Бот успешно запущен!');
    console.log('📱 Проверьте его в Telegram');
  })
  .catch(err => {
    console.error('❌ Ошибка запуска бота:', err);
  });

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
EOF

# Запускаем бота
cd backend
echo "🚀 Запуск бота..."
node ../test-bot.js