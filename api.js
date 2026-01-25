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
  
  const texto = data.messageData?.textMessageData?.textMessage;
  const de = data.senderData?.sender;
  const nombre = data.senderData?.senderName;
  
  console.log(`💬 Mensaje: "${texto}"`);
  console.log(`👤 De: ${nombre} (${de})`);
  
  // 🤖 RESPONDER AUTOMÁTICAMENTE:
  if (texto && de) {
    let respuesta = '';
    
    // Diferentes respuestas según el mensaje
    if (texto.toLowerCase().includes('hola')) {
      respuesta = `¡Hola ${nombre}! 👋 ¿En qué puedo ayudarte?`;
    } else if (texto.toLowerCase().includes('precio')) {
      respuesta = 'Nuestros precios varían según el servicio. ¿Qué te interesa?';
    } else if (texto.toLowerCase().includes('horario')) {
      respuesta = 'Estamos disponibles de lunes a viernes, 9:00 - 18:00 hrs.';
    } else {
      respuesta = `Recibí tu mensaje: "${texto}". Un momento, te respondo pronto.`;
    }
    
    // Enviar respuesta
    try {
      await axios.post(
        `https://api.green-api.com/waInstance${ID_INSTANCE}/sendMessage/${API_TOKEN}`,
        { 
          chatId: de,
          message: respuesta
        }
      );
      console.log(`✅ Respuesta enviada a ${nombre}`);
    } catch (error) {
      console.log('❌ Error al enviar respuesta:', error.message);
    }
  }
  
  res.json({ok: true, recibido: data});
});

app.get('/estado', (req, res) => res.json({ activo: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API + WEBHOOK on port ${PORT}`);
});
