const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(cors());

const ID_INSTANCE = '7105465843';
const API_TOKEN = 'c0dd84bdb1f346d5a5a646f303f1ccf162f5064cb1f34bc390';

app.post('/enviar', async (req, res) => {
  const { numero, mensaje } = req.body;
  const chatId = numero.replace('+', '').replace(' ', '') + '@c.us';
  
  try {
    const respuesta = await axios.post(
      `https://api.green-api.com/waInstance${ID_INSTANCE}/sendMessage/${API_TOKEN}`,
      { chatId, message: mensaje }
    );
    res.json({ ok: true, data: respuesta.data });
  } catch (error) {
    res.json({ ok: false, error: error.response?.data || error.message });
  }
});

app.post('/webhook', async (req, res) => {
  const data = req.body;
  
  console.log('📩 Webhook recibido:', JSON.stringify(data, null, 2));
  
  fs.appendFileSync('mensajes.log', 
    new Date().toISOString() + ': ' + JSON.stringify(data) + '\n'
  );
  
  // ✅ FILTRO: Solo procesar mensajes ENTRANTES
  if (data.typeWebhook !== 'incomingMessageReceived') {
    console.log('⏭️ Webhook ignorado (no es mensaje entrante):', data.typeWebhook);
    return res.json({ok: true, ignorado: true});
  }
  
  const texto = data.messageData?.textMessageData?.textMessage;
  const de = data.senderData?.sender;
  const nombre = data.senderData?.senderName;
  
  console.log(`💬 Mensaje: "${texto}"`);
  console.log(`👤 De: ${nombre} (${de})`);
  
  // 🔄 REENVIAR A N8N (MODO PRODUCCIÓN):
  try {
    await axios.post(
      'https://wasa-bot-n8n.nawdvf.easypanel.host/webhook/whatsapp',
      data
    );
    console.log('📤 Reenviado a n8n');
  } catch (error) {
    console.log('⚠️ Error al reenviar a n8n:', error.message);
  }
  
  res.json({ok: true, recibido: data});
});

app.get('/estado', (req, res) => res.json({ activo: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API + WEBHOOK on port ${PORT}`);
});
