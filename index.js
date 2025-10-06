const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const WIT_TOKEN = process.env.WIT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`;

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  try {
    const message = req.body.message;
    const chatId = message.chat.id;
    const text = message.text;

    const witResponse = await axios.get(`https://api.wit.ai/message?v=20251006&q=${encodeURIComponent(text)}`, {
      headers: { Authorization: `Bearer ${WIT_TOKEN}` }
    });

    const intent = witResponse.data.intents[0]?.name || 'نامشخص';

    let reply = '';
    if (intent === 'new_currency_alert') {
      reply = 'امروز دلار، یورو و درهم وارد بازار شدن. تزریق از صنایع غذایی آغاز شده.';
    } else if (intent === 'greeting') {
      reply = 'سلام! خوش اومدی به دیده‌بان ارز هلن‌هستی 🌟';
    } else {
      reply = `منظور شما رو فهمیدم: ${intent}`;
    }

    await axios.post(`${TELEGRAM_API}/sendMessage`, {
      chat_id: chatId,
      text: reply
    });

    res.sendStatus(200);
  } catch (error) {
    console.error('خطا:', error.message);
    res.sendStatus(500);
  }
});

app.listen(3000, () => {
  console.log('ربات روی پورت 3000 فعال شد');
});
