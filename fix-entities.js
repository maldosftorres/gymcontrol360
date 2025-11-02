const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'gymcontrol360'
};

async function checkEntities() {
  let connection;
  
  try {
    connection = await mysql.createConnection(dbConfig);
    
    console.log('🏢 Empresas en la base de datos:');
    const [empresas] = await connection.execute('SELECT * FROM empresas');
    if (empresas.length === 0) {
      console.log('❌ No hay empresas registradas');
    } else {
      empresas.forEach(emp => {
        console.log(`  ID: ${emp.id} | ${emp.nombre} | Activa: ${emp.activa ? 'Sí' : 'No'}`);
      });
    }

    console.log('\n🏢 Sedes en la base de datos:');
    const [sedes] = await connection.execute('SELECT s.*, e.nombre as empresa_nombre FROM sedes s LEFT JOIN empresas e ON s.empresa_id = e.id');
    if (sedes.length === 0) {
      console.log('❌ No hay sedes registradas');
    } else {
      sedes.forEach(sede => {
        console.log(`  ID: ${sede.id} | ${sede.nombre} | Empresa: ${sede.empresa_nombre || 'N/A'} (ID: ${sede.empresa_id}) | Activa: ${sede.activa ? 'Sí' : 'No'}`);
      });
    }

    console.log('\n👥 Usuarios en la base de datos:');
    const [usuarios] = await connection.execute('SELECT u.*, e.nombre as empresa_nombre, s.nombre as sede_nombre FROM usuarios u LEFT JOIN empresas e ON u.empresa_id = e.id LEFT JOIN sedes s ON u.sede_id = s.id LIMIT 10');
    if (usuarios.length === 0) {
      console.log('❌ No hay usuarios registrados');
    } else {
      usuarios.forEach(user => {
        console.log(`  ID: ${user.id} | ${user.nombre} ${user.apellido} | ${user.rol} | Empresa: ${user.empresa_nombre || 'N/A'} (ID: ${user.empresa_id}) | Sede: ${user.sede_nombre || 'N/A'} (ID: ${user.sede_id})`);
      });
    }

    // Si no hay empresa, vamos a crearla
    if (empresas.length === 0) {
      console.log('\n🛠️  Creando empresa por defecto...');
      await connection.execute(`
        INSERT INTO empresas (nombre, razon_social, email, activa) 
        VALUES ('FÉNIX GYM', 'Fénix Gym S.A.', 'admin@fenixgym.com', 1)
      `);
      console.log('✅ Empresa creada con ID 1');

      // Actualizar usuarios para que tengan empresa_id = 1
      await connection.execute('UPDATE usuarios SET empresa_id = 1 WHERE empresa_id IS NULL OR empresa_id = 0');
      console.log('✅ Usuarios actualizados con empresa_id = 1');

      // Actualizar sedes para que tengan empresa_id = 1
      await connection.execute('UPDATE sedes SET empresa_id = 1 WHERE empresa_id IS NULL OR empresa_id = 0');
      console.log('✅ Sedes actualizadas con empresa_id = 1');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

checkEntities();