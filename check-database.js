const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'gymcontrol360'
};

async function checkDatabase() {
  let connection;
  
  try {
    console.log('🔌 Conectando a la base de datos...');
    console.log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`);
    console.log(`🗄️  Database: ${dbConfig.database}`);
    
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Conexión exitosa!\n');

    // Verificar todas las tablas
    console.log('📋 Tablas en la base de datos:');
    const [tables] = await connection.execute('SHOW TABLES');
    tables.forEach((table, index) => {
      const tableName = Object.values(table)[0];
      console.log(`  ${index + 1}. ${tableName}`);
    });

    // Verificar específicamente las tablas de caja
    console.log('\n🔍 Verificando tablas de caja...');
    const [cajaTables] = await connection.execute("SHOW TABLES LIKE '%caja%'");
    
    if (cajaTables.length === 0) {
      console.log('❌ No se encontraron tablas de caja');
      console.log('\n🛠️  Creando tablas de caja...');
      await createCajaTables(connection);
    } else {
      console.log('✅ Tablas de caja encontradas:');
      cajaTables.forEach((table) => {
        const tableName = Object.values(table)[0];
        console.log(`  - ${tableName}`);
      });
    }

    // Verificar estructura de tabla caja si existe
    try {
      console.log('\n📊 Estructura de tabla caja:');
      const [cajaStructure] = await connection.execute('DESCRIBE caja');
      cajaStructure.forEach(column => {
        console.log(`  ${column.Field} - ${column.Type} ${column.Null === 'NO' ? '(NOT NULL)' : '(NULL)'}`);
      });
    } catch (error) {
      console.log('❌ Tabla caja no existe');
    }

    // Verificar estructura de tabla movimientos_caja si existe
    try {
      console.log('\n📊 Estructura de tabla movimientos_caja:');
      const [movStructure] = await connection.execute('DESCRIBE movimientos_caja');
      movStructure.forEach(column => {
        console.log(`  ${column.Field} - ${column.Type} ${column.Null === 'NO' ? '(NOT NULL)' : '(NULL)'}`);
      });
    } catch (error) {
      console.log('❌ Tabla movimientos_caja no existe');
    }

    // Verificar datos de ejemplo
    console.log('\n👥 Usuarios en la base de datos:');
    const [users] = await connection.execute('SELECT id, nombre, apellido, email, rol FROM usuarios LIMIT 5');
    users.forEach(user => {
      console.log(`  ID: ${user.id}, ${user.nombre} ${user.apellido} (${user.rol}) - ${user.email}`);
    });

    console.log('\n🏢 Empresas y sedes:');
    const [empresas] = await connection.execute(`
      SELECT e.id as empresa_id, e.nombre as empresa_nombre, 
             s.id as sede_id, s.nombre as sede_nombre 
      FROM empresas e 
      LEFT JOIN sedes s ON e.id = s.empresa_id 
      LIMIT 5
    `);
    empresas.forEach(item => {
      console.log(`  Empresa ${item.empresa_id}: ${item.empresa_nombre} | Sede ${item.sede_id}: ${item.sede_nombre}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Posibles soluciones:');
      console.log('  1. Verificar que MySQL esté ejecutándose');
      console.log('  2. Verificar las credenciales en el archivo .env');
      console.log('  3. Verificar que la base de datos existe');
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log('\n🔌 Conexión cerrada');
    }
  }
}

async function createCajaTables(connection) {
  try {
    // Crear tabla caja
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`caja\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`empresa_id\` int NOT NULL,
        \`sede_id\` int NULL,
        \`abierto_por\` int NULL,
        \`cerrado_por\` int NULL,
        \`fecha_apertura\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`fecha_cierre\` datetime NULL,
        \`monto_inicial\` decimal(10,2) NOT NULL DEFAULT '0.00',
        \`monto_final\` decimal(10,2) NOT NULL DEFAULT '0.00',
        \`diferencia\` decimal(10,2) NOT NULL DEFAULT '0.00',
        \`estado\` enum('ABIERTA','CERRADA') NOT NULL DEFAULT 'ABIERTA',
        \`creado_en\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`actualizado_en\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_caja_estado\` (\`empresa_id\`, \`sede_id\`, \`estado\`),
        CONSTRAINT \`FK_caja_empresa\` FOREIGN KEY (\`empresa_id\`) REFERENCES \`empresas\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`FK_caja_sede\` FOREIGN KEY (\`sede_id\`) REFERENCES \`sedes\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`FK_caja_abierto_por\` FOREIGN KEY (\`abierto_por\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`FK_caja_cerrado_por\` FOREIGN KEY (\`cerrado_por\`) REFERENCES \`usuarios\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Crear tabla movimientos_caja
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS \`movimientos_caja\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`empresa_id\` int NOT NULL,
        \`sede_id\` int NULL,
        \`caja_id\` int NOT NULL,
        \`tipo\` enum('INGRESO','EGRESO','AJUSTE') NOT NULL DEFAULT 'INGRESO',
        \`categoria\` varchar(100) NULL,
        \`monto\` decimal(10,2) NOT NULL,
        \`descripcion\` text NULL,
        \`fecha\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`creado_en\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`actualizado_en\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (\`id\`),
        INDEX \`idx_movcaja_fecha\` (\`fecha\`),
        INDEX \`idx_movcaja_tipo\` (\`tipo\`),
        CONSTRAINT \`FK_movimientos_caja_empresa\` FOREIGN KEY (\`empresa_id\`) REFERENCES \`empresas\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`FK_movimientos_caja_sede\` FOREIGN KEY (\`sede_id\`) REFERENCES \`sedes\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE,  
        CONSTRAINT \`FK_movimientos_caja_caja\` FOREIGN KEY (\`caja_id\`) REFERENCES \`caja\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    console.log('✅ Tablas de caja creadas exitosamente');
    
    // Verificar que se crearon
    const [cajaTables] = await connection.execute("SHOW TABLES LIKE '%caja%'");
    console.log('📋 Tablas creadas:');
    cajaTables.forEach((table) => {
      const tableName = Object.values(table)[0];
      console.log(`  - ${tableName}`);
    });
    
  } catch (error) {
    console.error('❌ Error creando tablas:', error.message);
  }
}

// Ejecutar el script
checkDatabase();