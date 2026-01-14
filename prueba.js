const axios = require('axios');

const numero = '56984369058';
const mensaje = 'Hola desde mi API!';

axios.post('http://localhost:3000/enviar', {
  numero: numero,
  mensaje: mensaje
})
.then(response => {
  console.log('✅ Respuesta:', response.data);
})
.catch(error => {
  console.log('❌ Error:', error.message);
});