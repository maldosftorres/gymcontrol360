const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'gymcontrol360'
};

async function limpiarDatosOperacionales() {
  let connection;
  
  try {
    console.log('🔌 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión exitosa!\n');

    console.log('⚠️  ADVERTENCIA: Este script eliminará todos los datos operacionales');
    console.log('📋 Tablas que se van a limpiar:');
    console.log('   - movimientos_caja (movimientos de caja)');
    console.log('   - caja (cajas abiertas/cerradas)');
    console.log('   - pagos (pagos de socios)');
    console.log('   - visitas (registros de acceso)');
    console.log('   - socios_membresias (membresías activas de socios)');
    console.log('   - socios (datos de socios)');
    console.log('   - auditoria (logs de auditoría)');
    console.log('   - gastos (gastos registrados)');
    console.log('   - respaldos (respaldos del sistema)');
    console.log('');
    console.log('✅ Tablas que se mantienen:');
    console.log('   - usuarios (usuarios del sistema)');
    console.log('   - empresas (empresas)');
    console.log('   - sedes (sedes/sucursales)');
    console.log('   - membresias (tipos de membresías)');
    console.log('   - dispositivos (dispositivos configurados)');
    console.log('');

    // Esperar 3 segundos para que el usuario pueda leer
    console.log('⏳ Iniciando limpieza en 3 segundos...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Desactivar checks de foreign keys temporalmente
    console.log('🔧 Desactivando checks de foreign keys...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Contar registros antes de limpiar
    console.log('\n📊 Contando registros antes de la limpieza...');
    const tablasALimpiar = [
      'movimientos_caja',
      'caja', 
      'pagos',
      'visitas',
      'socios_membresias',
      'socios',
      'auditoria',
      'gastos',
      'respaldos'
    ];

    const conteoAntes = {};
    for (const tabla of tablasALimpiar) {
      try {
        const [result] = await connection.execute(`SELECT COUNT(*) as count FROM ${tabla}`);
        conteoAntes[tabla] = result[0].count;
        console.log(`   ${tabla}: ${result[0].count} registros`);
      } catch (error) {
        conteoAntes[tabla] = 'Error/No existe';
        console.log(`   ${tabla}: Error o no existe`);
      }
    }

    // Limpiar las tablas en orden correcto (respetando foreign keys)
    console.log('\n🧹 Iniciando limpieza...');

    // 1. Limpiar movimientos de caja (depende de caja)
    console.log('   🗑️  Limpiando movimientos_caja...');
    try {
      await connection.execute('TRUNCATE TABLE movimientos_caja');
      console.log('   ✅ movimientos_caja limpiada');
    } catch (error) {
      console.log(`   ⚠️  Error en movimientos_caja: ${error.message}`);
    }

    // 2. Limpiar caja
    console.log('   🗑️  Limpiando caja...');
    try {
      await connection.execute('TRUNCATE TABLE caja');
      console.log('   ✅ caja limpiada');
    } catch (error) {
      console.log(`   ⚠️  Error en caja: ${error.message}`);
    }

    // 3. Limpiar pagos
    console.log('   🗑️  Limpiando pagos...');
    try {
      await connection.execute('TRUNCATE TABLE pagos');
      console.log('   ✅ pagos limpiada');
    } catch (error) {
      console.log(`   ⚠️  Error en pagos: ${error.message}`);
    }

    // 4. Limpiar visitas
    console.log('   🗑️  Limpiando visitas...');
    try {
      await connection.execute('TRUNCATE TABLE visitas');
      console.log('   ✅ visitas limpiada');
    } catch (error) {
      console.log(`   ⚠️  Error en visitas: ${error.message}`);
    }

    // 5. Limpiar socios_membresias (depende de socios)
    console.log('   🗑️  Limpiando socios_membresias...');
    try {
      await connection.execute('TRUNCATE TABLE socios_membresias');
      console.log('   ✅ socios_membresias limpiada');
    } catch (error) {
      console.log(`   ⚠️  Error en socios_membresias: ${error.message}`);
    }

    // 6. Limpiar socios (esto también limpiará usuarios con rol SOCIO)
    console.log('   🗑️  Limpiando socios...');
    try {
      // Primero obtenemos los IDs de usuarios que son socios
      const [sociosUsuarios] = await connection.execute('SELECT usuario_id FROM socios');
      const usuarioIds = sociosUsuarios.map(s => s.usuario_id);
      
      // Limpiar tabla socios
      await connection.execute('TRUNCATE TABLE socios');
      
      // Eliminar usuarios que eran socios (excepto administradores)
      if (usuarioIds.length > 0) {
        const placeholders = usuarioIds.map(() => '?').join(',');
        await connection.execute(
          `DELETE FROM usuarios WHERE id IN (${placeholders}) AND rol != 'ADMINISTRADOR'`, 
          usuarioIds
        );
        console.log(`   ✅ socios limpiada (eliminados ${usuarioIds.length} usuarios-socio)`);
      } else {
        console.log('   ✅ socios limpiada (no había socios)');
      }
    } catch (error) {
      console.log(`   ⚠️  Error en socios: ${error.message}`);
    }

    // 7. Limpiar auditoría
    console.log('   🗑️  Limpiando auditoria...');
    try {
      await connection.execute('TRUNCATE TABLE auditoria');
      console.log('   ✅ auditoria limpiada');
    } catch (error) {
      console.log(`   ⚠️  Error en auditoria: ${error.message}`);
    }

    // 8. Limpiar gastos
    console.log('   🗑️  Limpiando gastos...');
    try {
      await connection.execute('TRUNCATE TABLE gastos');
      console.log('   ✅ gastos limpiada');
    } catch (error) {
      console.log(`   ⚠️  Error en gastos: ${error.message}`);
    }

    // 9. Limpiar respaldos
    console.log('   🗑️  Limpiando respaldos...');
    try {
      await connection.execute('TRUNCATE TABLE respaldos');
      console.log('   ✅ respaldos limpiada');
    } catch (error) {
      console.log(`   ⚠️  Error en respaldos: ${error.message}`);
    }

    // Reactivar checks de foreign keys
    console.log('\n🔧 Reactivando checks de foreign keys...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    // Resetear AUTO_INCREMENT en las tablas limpiadas
    console.log('\n🔄 Reseteando AUTO_INCREMENT...');
    const tablasConAutoIncrement = ['caja', 'movimientos_caja', 'pagos', 'visitas', 'socios_membresias', 'socios'];
    for (const tabla of tablasConAutoIncrement) {
      try {
        await connection.execute(`ALTER TABLE ${tabla} AUTO_INCREMENT = 1`);
        console.log(`   ✅ ${tabla} AUTO_INCREMENT reseteado`);
      } catch (error) {
        console.log(`   ⚠️  Error reseteando ${tabla}: ${error.message}`);
      }
    }

    // Verificar qué tablas mantienen datos
    console.log('\n📊 Verificando tablas que mantienen datos...');
    const tablasConservadas = ['usuarios', 'empresas', 'sedes', 'membresias', 'dispositivos'];
    
    for (const tabla of tablasConservadas) {
      try {
        const [result] = await connection.execute(`SELECT COUNT(*) as count FROM ${tabla}`);
        console.log(`   ✅ ${tabla}: ${result[0].count} registros conservados`);
      } catch (error) {
        console.log(`   ⚠️  Error verificando ${tabla}: ${error.message}`);
      }
    }

    console.log('\n🎉 Limpieza completada exitosamente!');
    console.log('');
    console.log('📋 Resumen:');
    console.log('   ✅ Datos operacionales eliminados');
    console.log('   ✅ Usuarios, empresas, sedes y membresías conservados');
    console.log('   ✅ Sistema listo para operar con datos limpios');
    console.log('');
    console.log('💡 Ahora puedes:');
    console.log('   - Crear nuevos socios');
    console.log('   - Abrir cajas sin conflictos');
    console.log('   - Registrar pagos frescos');
    console.log('   - Probar todas las funcionalidades');

  } catch (error) {
    console.error('❌ Error durante la limpieza:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Ejecutar el script
limpiarDatosOperacionales();