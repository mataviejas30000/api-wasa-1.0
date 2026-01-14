const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// CAMBIA ESTOS DOS VALORES POR LOS TUYOS
const ID_INSTANCE = '7105465843';  // ← CAMBIA ESTO
const API_TOKEN = 'c0dd84bdb1f346d5a5a646f303f1ccf162f5064cb1f34bc390';   // ← CAMBIA ESTO

// Enviar mensaje
app.post('/enviar', async (req, res) => {
  const { numero, mensaje } = req.body;
  
  try {
    const respuesta = await axios.post(
      `https://api.green-api.com/waInstance${ID_INSTANCE}/sendMessage/${API_TOKEN}`,
      {
        chatId: numero + '@c.us',
        message: mensaje
      }
    );
    
    res.json({ ok: true, data: respuesta.data });
  } catch (error) {
    res.json({ ok: false, error: error.message });
  }
});

// Estado
app.get('/estado', (req, res) => {
  res.json({ activo: true, mensaje: 'API funcionando' });
});

app.listen(3000, () => {
  console.log('✅ API corriendo en http://localhost:3000');
});
