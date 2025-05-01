// backend/config/db.js

// Importar dotenv para cargar variables de entorno desde .env
require('dotenv').config();
// Importar el paquete mysql2 (promisificado para usar async/await)
const mysql = require('mysql2/promise');

// Crear un "pool" de conexiones a la base de datos MySQL
// Un pool gestiona eficientemente múltiples conexiones para mejorar el rendimiento
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost', // Usa variable de entorno o 'localhost' por defecto
    user: process.env.DB_USER || 'root',      // Usa variable de entorno o 'root' por defecto
    password: process.env.DB_PASSWORD,        // Usa la contraseña del archivo .env
    database: process.env.DB_NAME || 'inventario_db', // Usa variable de entorno o 'inventario_db'
    waitForConnections: true, // Esperar si todas las conexiones están en uso (recomendado)
    connectionLimit: 10,      // Número máximo de conexiones simultáneas en el pool
    queueLimit: 0             // Sin límite en la cola de espera de conexiones
});

// Función asíncrona para probar la conexión al crear el pool (opcional)
async function testDbConnection() {
    let connection;
    try {
        // Intenta obtener una conexión del pool
        connection = await pool.getConnection();
        console.log('MySQL DB Connected successfully using connection pool.');
    } catch (error) {
        console.error('MySQL DB Connection Error:', error.message);
        // Considerar terminar la aplicación si la conexión a la BD es crítica al inicio
        // process.exit(1);
    } finally {
        // Asegúrate de liberar la conexión de vuelta al pool si se obtuvo
        if (connection) {
            connection.release();
            console.log('MySQL DB Connection released back to pool.');
        }
    }
}

// Ejecutar la prueba de conexión una vez al iniciar este módulo
// testDbConnection(); // Puedes descomentar esto para probar la conexión cada vez que inicie el servidor

// Exportar el pool para que otras partes de la aplicación (ej: modelos)
// puedan usarlo para interactuar con la base de datos.
module.exports = pool;