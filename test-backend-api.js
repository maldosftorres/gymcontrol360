const axios = require('axios');

async function testBackendAPI() {
  const baseURL = 'http://localhost:3000';
  
  try {
    console.log('🚀 Probando API de caja...');
    
    // 1. Probar obtener caja activa (debería devolver la que acabamos de crear)
    console.log('\n1️⃣ Obteniendo caja activa para sede 1...');
    try {
      const response = await axios.get(`${baseURL}/caja/activa/1`);
      console.log('✅ Caja activa encontrada:');
      console.log(`   ID: ${response.data.id}`);
      console.log(`   Monto inicial: ${response.data.montoInicial}`);
      console.log(`   Estado: ${response.data.estado}`);
      console.log(`   Fecha apertura: ${response.data.fechaApertura}`);
      
      if (response.data.usuarioAbierto) {
        console.log(`   Abierta por: ${response.data.usuarioAbierto.nombre} ${response.data.usuarioAbierto.apellido}`);
      }
      
      // Cerrar esta caja para poder abrir una nueva
      console.log('\n🔄 Cerrando caja actual para poder probar apertura...');
      await axios.patch(`${baseURL}/caja/${response.data.id}/cerrar`, {
        montoFinal: response.data.montoInicial,
        observaciones: 'Cerrado para prueba'
      });
      console.log('✅ Caja cerrada');
      
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('ℹ️  No hay caja activa (normal para primera ejecución)');
      } else {
        console.log('❌ Error obteniendo caja activa:', error.message);
      }
    }
    
    // 2. Probar abrir nueva caja
    console.log('\n2️⃣ Abriendo nueva caja...');
    const abrirCajaData = {
      montoInicial: 150000,
      empresaId: 1,
      sedeId: 1,
      usuarioId: 1,
      observaciones: 'Prueba desde API'
    };
    
    try {
      const response = await axios.post(`${baseURL}/caja/abrir`, abrirCajaData);
      console.log('✅ Caja abierta exitosamente:');
      console.log(`   ID: ${response.data.id}`);
      console.log(`   Monto inicial: ${response.data.montoInicial}`);
      console.log(`   Estado: ${response.data.estado}`);
      console.log(`   Empresa ID: ${response.data.empresaId}`);
      console.log(`   Sede ID: ${response.data.sedeId}`);
      
      const cajaId = response.data.id;
      
      // 3. Probar crear movimiento
      console.log('\n3️⃣ Creando movimiento de prueba...');
      const movimientoData = {
        tipo: 'INGRESO',
        monto: 25000,
        concepto: 'Venta de membresía',
        cajaId: cajaId,
        observaciones: 'Movimiento de prueba'
      };
      
      const movResponse = await axios.post(`${baseURL}/caja/movimiento`, movimientoData);
      console.log('✅ Movimiento creado:');
      console.log(`   ID: ${movResponse.data.id}`);
      console.log(`   Tipo: ${movResponse.data.tipo}`);
      console.log(`   Monto: ${movResponse.data.monto}`);
      console.log(`   Descripción: ${movResponse.data.descripcion}`);
      
      // 4. Obtener movimientos de la caja
      console.log('\n4️⃣ Obteniendo movimientos de la caja...');
      const movimientosResponse = await axios.get(`${baseURL}/caja/${cajaId}/movimientos`);
      console.log(`✅ Movimientos encontrados: ${movimientosResponse.data.length}`);
      movimientosResponse.data.forEach((mov, index) => {
        console.log(`   ${index + 1}. ${mov.tipo} - $${mov.monto} - ${mov.descripcion}`);
      });
      
      // 5. Obtener resumen de caja
      console.log('\n5️⃣ Obteniendo resumen de caja...');
      const resumenResponse = await axios.get(`${baseURL}/caja/${cajaId}/resumen`);
      console.log('✅ Resumen de caja:');
      console.log(`   Monto inicial: $${resumenResponse.data.montoInicial}`);
      console.log(`   Total ingresos: $${resumenResponse.data.totalIngresos}`);
      console.log(`   Total egresos: $${resumenResponse.data.totalEgresos}`);
      console.log(`   Monto calculado: $${resumenResponse.data.montoCalculado}`);
      console.log(`   Cantidad movimientos: ${resumenResponse.data.cantidadMovimientos}`);
      
    } catch (error) {
      console.log('❌ Error en API de caja:', error.response?.data || error.message);
      if (error.response?.data?.message) {
        console.log('   Mensaje del servidor:', error.response.data.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Error general:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Asegúrate de que el servidor NestJS esté ejecutándose en http://localhost:3000');
    }
  }
}

testBackendAPI();