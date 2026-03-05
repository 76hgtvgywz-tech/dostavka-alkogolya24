export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, comment, source = 'Сайт' } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Имя и телефон обязательны' });
  }

  const botToken = '8577126925:AAFKxUZuaUZIs-b3yJuA_ZiWJHTp27tfLs8';
  const chatId = '562345561';

  const message = `🚗 *Новая заявка с сайта Alkovoz!*\n\n👤 *Имя:* ${name}\n📱 *Телефон:* ${phone}\n💬 *Комментарий:* ${comment || '—'}\n🕒 *Время:* ${new Date().toLocaleString('ru')}\n🌐 *Источник:* ${source}\n\n#заявка #alkovoz`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: true
      })
    });

    const data = await response.json();
    if (data.ok) {
      res.status(200).json({ success: true });
    } else {
      res.status(500).json({ error: data.description });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}