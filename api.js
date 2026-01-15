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

app.post('/webhook', express.raw({type: '*/*'}), (req, res) => {
  fs.appendFileSync('mensajes.log', new Date().toISOString() + ': ' + req.body.toString() + '\n');
  res.json({ok: true});
});

app.get('/estado', (req, res) => res.json({ activo: true }));

app.listen(3000, () => console.log('✅ API + WEBHOOK'));
