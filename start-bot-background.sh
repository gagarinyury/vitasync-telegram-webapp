#!/bin/bash

echo "🤖 Запуск только Telegram бота в фоне"
echo "====================================="

cd /root/vitasync-telegram-webapp

# Останавливаем все предыдущие процессы
echo "🛑 Остановка предыдущих процессов..."
pkill -f "node" || true

# Загружаем переменные окружения
set -a
source .env
set +a

# Создаем директорию для логов
mkdir -p logs

# Создаем минимальный файл только для бота
cat > bot-only.js << 'EOF'
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Start command
bot.command('start', async (ctx) => {
  const user = ctx.from;
  const webAppUrl = `${process.env.TELEGRAM_WEBAPP_URL}?tg_user_id=${user.id}`;
  
  await ctx.reply('Добро пожаловать в VitaSync! 💊\n\nЯ помогу вам анализировать совместимость витаминов и БАДов, а также создавать персональный график приема.\n\n🤖 P.S. Я всего лишь прототип, поэтому не судите меня строго! Иногда могу немного тормозить, но стараюсь изо всех сил 😊', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🚀 Открыть приложение',
            web_app: { url: webAppUrl }
          }
        ],
        [
          {
            text: '📚 О боте',
            callback_data: 'about'
          },
          {
            text: '💬 Поддержка',
            callback_data: 'support'
          }
        ]
      ]
    }
  });
});

// About callback
bot.action('about', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(`
🔍 *О VitaSync*

VitaSync - это интеллектуальный помощник для анализа совместимости витаминов и БАДов.

*Возможности:*
• Анализ совместимости добавок с помощью AI
• Создание персонального графика приема
• Научно обоснованные рекомендации
• Два режима AI: стандартный и премиум

*Как пользоваться:*
1. Нажмите "Открыть приложение"
2. Добавьте ваши добавки
3. Получите анализ совместимости
4. Создайте оптимальный график приема

⚠️ *Важно:* Наши рекомендации не заменяют консультацию врача!

🤖 *P.S.* Я пока что прототип MVP, так что если что-то пойдет не так - не обессудьте! Работаю в режиме бета-тестирования 😅
`, 
    { parse_mode: 'Markdown' }
  );
});

// Support callback
bot.action('support', async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply('По всем вопросам обращайтесь: @your_support_username');
});

// Handle errors
bot.catch((err, ctx) => {
  console.error('Error:', err);
});

// Launch bot
bot.launch();

console.log('Bot started at', new Date().toISOString());

// Graceful shutdown
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
EOF

# Запускаем бота в фоне
echo "🚀 Запуск бота..."
cd backend
nohup node ../bot-only.js > ../logs/bot.log 2>&1 &
BOT_PID=$!

echo ""
echo "✅ Бот запущен с PID: $BOT_PID"
echo "📁 Логи: /root/vitasync-telegram-webapp/logs/bot.log"
echo ""
echo "📊 Просмотр логов:"
echo "   tail -f /root/vitasync-telegram-webapp/logs/bot.log"
echo ""
echo "🛑 Остановка бота:"
echo "   kill $BOT_PID"
echo ""
echo "🤖 Бот работает в фоновом режиме!"