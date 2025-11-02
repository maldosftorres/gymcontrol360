const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'gymcontrol360'
};

async function testCajaFunctionality() {
  let connection;
  
  try {
    console.log('🔌 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión exitosa!\n');

    // 1. Verificar si hay caja abierta
    console.log('🔍 Verificando caja activa...');
    const [cajaActiva] = await connection.execute(`
      SELECT c.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido 
      FROM caja c 
      LEFT JOIN usuarios u ON c.abierto_por = u.id 
      WHERE c.sede_id = 1 AND c.estado = 'ABIERTA'
    `);

    if (cajaActiva.length > 0) {
      console.log('⚠️  Ya hay una caja abierta:');
      const caja = cajaActiva[0];
      console.log(`  ID: ${caja.id}`);
      console.log(`  Abierta por: ${caja.usuario_nombre} ${caja.usuario_apellido}`);
      console.log(`  Fecha apertura: ${caja.fecha_apertura}`);
      console.log(`  Monto inicial: ${caja.monto_inicial}`);
      console.log(`  Estado: ${caja.estado}`);
      
      console.log('\n🗑️  Cerrando caja para poder abrir una nueva...');
      await connection.execute(`
        UPDATE caja 
        SET estado = 'CERRADA', fecha_cierre = NOW(), monto_final = monto_inicial 
        WHERE id = ?
      `, [caja.id]);
      console.log('✅ Caja cerrada');
    } else {
      console.log('✅ No hay caja abierta, se puede abrir una nueva');
    }

    // 2. Intentar abrir una nueva caja
    console.log('\n💰 Intentando abrir nueva caja...');
    
    const abrirCajaData = {
      empresaId: 1,
      sedeId: 1,
      usuarioId: 1,
      montoInicial: 100000,
      observaciones: 'Prueba de apertura desde script'
    };

    console.log('📤 Datos para abrir caja:', abrirCajaData);

    // Simular el proceso del backend
    try {
      // Insertar nueva caja
      const [result] = await connection.execute(`
        INSERT INTO caja (empresa_id, sede_id, abierto_por, monto_inicial, estado, fecha_apertura)
        VALUES (?, ?, ?, ?, 'ABIERTA', NOW())
      `, [abrirCajaData.empresaId, abrirCajaData.sedeId, abrirCajaData.usuarioId, abrirCajaData.montoInicial]);

      const cajaId = result.insertId;
      console.log(`✅ Caja creada con ID: ${cajaId}`);

      // Crear movimiento inicial
      await connection.execute(`
        INSERT INTO movimientos_caja (empresa_id, sede_id, caja_id, tipo, monto, descripcion, fecha)
        VALUES (?, ?, ?, 'INGRESO', ?, 'Apertura de caja', NOW())
      `, [abrirCajaData.empresaId, abrirCajaData.sedeId, cajaId, abrirCajaData.montoInicial]);

      console.log('✅ Movimiento inicial creado');

      // Verificar la caja creada
      const [cajaCreada] = await connection.execute(`
        SELECT c.*, u.nombre as usuario_nombre, u.apellido as usuario_apellido 
        FROM caja c 
        LEFT JOIN usuarios u ON c.abierto_por = u.id 
        WHERE c.id = ?
      `, [cajaId]);

      if (cajaCreada.length > 0) {
        const caja = cajaCreada[0];
        console.log('\n🎉 Caja abierta exitosamente:');
        console.log(`  ID: ${caja.id}`);
        console.log(`  Empresa ID: ${caja.empresa_id}`);
        console.log(`  Sede ID: ${caja.sede_id}`);
        console.log(`  Abierta por: ${caja.usuario_nombre} ${caja.usuario_apellido} (ID: ${caja.abierto_por})`);
        console.log(`  Fecha apertura: ${caja.fecha_apertura}`);
        console.log(`  Monto inicial: ${caja.monto_inicial}`);
        console.log(`  Estado: ${caja.estado}`);
      }

      // Verificar movimientos
      const [movimientos] = await connection.execute(`
        SELECT * FROM movimientos_caja WHERE caja_id = ?
      `, [cajaId]);

      console.log(`\n📋 Movimientos de caja (${movimientos.length}):`);
      movimientos.forEach((mov, index) => {
        console.log(`  ${index + 1}. ${mov.tipo} - ${mov.monto} - ${mov.descripcion} (${mov.fecha})`);
      });

    } catch (error) {
      console.error('❌ Error en el proceso de apertura:', error.message);
      
      // Verificar si es un error de FK
      if (error.code === 'ER_NO_REFERENCED_ROW_2') {
        console.log('\n🔍 Verificando claves foráneas...');
        
        // Verificar empresa
        const [empresa] = await connection.execute('SELECT id, nombre FROM empresas WHERE id = ?', [abrirCajaData.empresaId]);
        console.log(`  Empresa ID ${abrirCajaData.empresaId}:`, empresa.length > 0 ? `✅ ${empresa[0].nombre}` : '❌ No existe');
        
        // Verificar sede
        const [sede] = await connection.execute('SELECT id, nombre FROM sedes WHERE id = ?', [abrirCajaData.sedeId]);
        console.log(`  Sede ID ${abrirCajaData.sedeId}:`, sede.length > 0 ? `✅ ${sede[0].nombre}` : '❌ No existe');
        
        // Verificar usuario
        const [usuario] = await connection.execute('SELECT id, nombre, apellido FROM usuarios WHERE id = ?', [abrirCajaData.usuarioId]);
        console.log(`  Usuario ID ${abrirCajaData.usuarioId}:`, usuario.length > 0 ? `✅ ${usuario[0].nombre} ${usuario[0].apellido}` : '❌ No existe');
      }
    }

  } catch (error) {
    console.error('❌ Error general:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Ejecutar el test
testCajaFunctionality();