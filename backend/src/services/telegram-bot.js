const { Telegraf } = require('telegraf');
const { logger } = require('../utils/logger');
const { getDb } = require('./database');

let bot;

function initBot() {
  const webAppUrl = process.env.TELEGRAM_WEBAPP_URL || 'https://profy.top/webapp/';
  console.log('TELEGRAM_WEBAPP_URL:', webAppUrl);
  
  bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
  
  // Start command
  bot.command('start', async (ctx) => {
    const user = ctx.from;
    const sql = getDb();
    
    try {
      // Save or update user
      await sql`
        INSERT INTO users (telegram_id, username, first_name, last_name, language_code, is_bot, is_premium)
        VALUES (${user.id}, ${user.username}, ${user.first_name}, ${user.last_name}, ${user.language_code}, ${user.is_bot}, ${user.is_premium || false})
        ON CONFLICT (telegram_id) 
        DO UPDATE SET 
          username = EXCLUDED.username,
          first_name = EXCLUDED.first_name,
          last_name = EXCLUDED.last_name,
          language_code = EXCLUDED.language_code,
          is_premium = EXCLUDED.is_premium,
          updated_at = CURRENT_TIMESTAMP
      `;
      
      const baseUrl = process.env.TELEGRAM_WEBAPP_URL || 'https://profy.top/webapp/';
      const webAppUrl = `${baseUrl}?tg_user_id=${user.id}`;
      
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
    } catch (error) {
      logger.error('Error in start command:', error);
      await ctx.reply('Произошла ошибка. Попробуйте позже.');
    }
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
  
  // AI analysis command
  bot.command('analyze', async (ctx) => {
    const text = ctx.message.text.replace('/analyze', '').trim();
    
    if (!text) {
      return ctx.reply('Пожалуйста, укажите названия добавок через запятую после команды.\n\nПример: /analyze витамин D3, магний, омега-3');
    }
    
    await ctx.reply('Анализирую совместимость...', {
      reply_markup: {
        inline_keyboard: [[
          {
            text: '🔬 Подробный анализ в приложении',
            web_app: { url: `${process.env.TELEGRAM_WEBAPP_URL}?analyze=${encodeURIComponent(text)}` }
          }
        ]]
      }
    });
  });
  
  // Handle any text message
  bot.on('text', async (ctx) => {
    // Quick analysis hint
    if (ctx.message.text.includes(',')) {
      await ctx.reply('Хотите проанализировать эти добавки? Используйте команду:\n\n`/analyze ' + ctx.message.text + '`', {
        parse_mode: 'Markdown'
      });
    }
  });
  
  // Error handling
  bot.catch((err, ctx) => {
    logger.error('Telegram bot error:', err);
    return ctx.reply('Произошла ошибка. Попробуйте позже.');
  });
  
  // Launch bot
  bot.launch();
  
  // Handle graceful shutdown
  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));
  
  logger.info('Telegram bot started');
  
  return bot;
}

function getBot() {
  return bot;
}

module.exports = {
  initBot,
  getBot
};