// Script de prueba para abrir caja
// Ejecutar desde el directorio del proyecto: node test-abrir-caja.js

const axios = require('axios');

const testAbrirCaja = async () => {
  try {
    const response = await axios.post('http://localhost:3000/caja/abrir', {
      montoInicial: 100000,
      empresaId: 1,
      sedeId: 1,
      usuarioId: 1,
      observaciones: 'Prueba de apertura'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Caja abierta exitosamente:', response.data);
  } catch (error) {
    console.error('❌ Error al abrir caja:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
};

testAbrirCaja();