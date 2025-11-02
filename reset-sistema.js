const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'gymcontrol360'
};

async function resetearSistemaCompleto() {
  let connection;
  
  try {
    console.log('🔌 Conectando a la base de datos...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión exitosa!\n');

    console.log('⚠️  ADVERTENCIA: Este script eliminará TODOS los datos del sistema');
    console.log('📋 Se limpiará TODO y se creará:');
    console.log('   - Un usuario administrador maestro');
    console.log('   - Una empresa base');
    console.log('   - Membresías por defecto');
    console.log('');

    // Esperar 3 segundos
    console.log('⏳ Iniciando reset completo en 3 segundos...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Desactivar checks de foreign keys
    console.log('🔧 Desactivando checks de foreign keys...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');

    // Obtener todas las tablas
    const [tables] = await connection.execute('SHOW TABLES');
    
    console.log('\n🧹 Limpiando todas las tablas...');
    for (const tableRow of tables) {
      const tableName = Object.values(tableRow)[0];
      try {
        await connection.execute(`TRUNCATE TABLE ${tableName}`);
        console.log(`   ✅ ${tableName} limpiada`);
      } catch (error) {
        console.log(`   ⚠️  Error en ${tableName}: ${error.message}`);
      }
    }

    // Reactivar checks de foreign keys
    console.log('\n🔧 Reactivando checks de foreign keys...');
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');

    // Crear empresa base
    console.log('\n🏢 Creando empresa base...');
    await connection.execute(`
      INSERT INTO empresas (id, nombre, razon_social, email, activa) 
      VALUES (1, 'GYM CONTROL 360', 'Gym Control 360 S.A.', 'admin@gymcontrol360.com', 1)
    `);
    console.log('✅ Empresa base creada');

    // Crear usuario administrador maestro
    console.log('\n👤 Creando usuario administrador maestro...');
    const passwordHash = await bcrypt.hash('admin123', 10);
    
    await connection.execute(`
      INSERT INTO usuarios (
        id, empresa_id, sede_id, nombre, apellido, email, telefono,
        documento_tipo, documento_numero, password_hash, rol, estado, activo
      ) VALUES (
        1, 1, NULL, 'Administrador', 'Maestro', 'admin@gymcontrol360.com', '021-000-000',
        'CI', '00000000', ?, 'ADMINISTRADOR', 'ACTIVO', 1
      )
    `, [passwordHash]);
    console.log('✅ Usuario administrador maestro creado');
    console.log('   📧 Email: admin@gymcontrol360.com');
    console.log('   🔑 Password: admin123');

    // Crear membresías por defecto
    console.log('\n💳 Creando membresías por defecto...');
    const membresias = [
      ['Pase Diario', 'Acceso por un día completo', 1, 25000, 1],
      ['Semanal', 'Acceso por una semana', 7, 150000, 1],
      ['Mensual Básica', 'Acceso completo por 30 días', 30, 180000, 1],
      ['Mensual Premium', 'Acceso completo + clases grupales por 30 días', 30, 250000, 1],
      ['Trimestral', 'Acceso completo por 90 días con descuento', 90, 450000, 1],
      ['Semestral', 'Acceso completo por 180 días con descuento', 180, 850000, 1],
      ['Anual', 'Acceso completo por 365 días con máximo descuento', 365, 1500000, 1]
    ];

    for (let i = 0; i < membresias.length; i++) {
      const [nombre, descripcion, duracion, precio, activa] = membresias[i];
      await connection.execute(`
        INSERT INTO membresias (id, empresa_id, sede_id, nombre, descripcion, duracion_dias, precio, activa) 
        VALUES (?, 1, NULL, ?, ?, ?, ?, ?)
      `, [i + 1, nombre, descripcion, duracion, precio, activa]);
    }
    console.log(`✅ ${membresias.length} membresías creadas`);

    // Resetear AUTO_INCREMENT
    console.log('\n🔄 Reseteando AUTO_INCREMENT...');
    const tablasConAutoIncrement = [
      'usuarios', 'empresas', 'sedes', 'membresias', 'socios', 'pagos', 
      'caja', 'movimientos_caja', 'visitas', 'socios_membresias', 'dispositivos'
    ];
    
    for (const tabla of tablasConAutoIncrement) {
      try {
        // Obtener el máximo ID actual
        const [maxResult] = await connection.execute(`SELECT COALESCE(MAX(id), 0) + 1 as next_id FROM ${tabla}`);
        const nextId = maxResult[0].next_id;
        
        await connection.execute(`ALTER TABLE ${tabla} AUTO_INCREMENT = ${nextId}`);
        console.log(`   ✅ ${tabla} AUTO_INCREMENT = ${nextId}`);
      } catch (error) {
        console.log(`   ⚠️  Error en ${tabla}: ${error.message}`);
      }
    }

    // Verificar resultados
    console.log('\n📊 Verificando sistema resetado...');
    
    const [empresas] = await connection.execute('SELECT COUNT(*) as count FROM empresas');
    console.log(`   🏢 Empresas: ${empresas[0].count}`);
    
    const [usuarios] = await connection.execute('SELECT COUNT(*) as count FROM usuarios');
    console.log(`   👤 Usuarios: ${usuarios[0].count}`);
    
    const [sedes] = await connection.execute('SELECT COUNT(*) as count FROM sedes');
    console.log(`   🏪 Sedes: ${sedes[0].count}`);
    
    const [membresiaCount] = await connection.execute('SELECT COUNT(*) as count FROM membresias');
    console.log(`   💳 Membresías: ${membresiaCount[0].count}`);

    console.log('\n🎉 Sistema completamente reseteado!');
    console.log('');
    console.log('📋 Estado del sistema:');
    console.log('   ✅ Base de datos completamente limpia');
    console.log('   ✅ Usuario administrador maestro creado');
    console.log('   ✅ Empresa base configurada');
    console.log('   ✅ Membresías por defecto disponibles');
    console.log('   ✅ Sistema listo para configurar sedes');
    console.log('');
    console.log('🚀 Próximos pasos:');
    console.log('   1. Ingresar al sistema con admin@gymcontrol360.com / admin123');
    console.log('   2. Crear sedes desde el nuevo módulo de gestión');
    console.log('   3. Crear usuarios para cada sede');
    console.log('   4. Comenzar operaciones');

  } catch (error) {
    console.error('❌ Error durante el reset:', error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

// Ejecutar el reset
resetearSistemaCompleto();