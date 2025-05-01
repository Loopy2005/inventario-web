// backend/server.js

// Cargar variables de entorno desde el archivo .env
require('dotenv').config();

// Importar los módulos necesarios
const express = require('express');
const cors = require('cors');
const dbPool = require('./config/db'); // Importar el pool de conexiones a la BD

// Crear la instancia de la aplicación Express
const app = express();

// --- Middlewares Esenciales ---
// Habilitar CORS (Cross-Origin Resource Sharing) para permitir peticiones
// desde el frontend (que correrá en un puerto diferente)
app.use(cors());

// Habilitar el parseo de cuerpos de petición en formato JSON
app.use(express.json());

// --- Rutas de la API ---
// Ruta raíz de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.status(200).json({ message: 'API del Sistema de Inventario v1.0 Funcionando!' });
});

// TODO: Aquí se definirán y usarán las rutas para las diferentes funcionalidades
// Ejemplo:
// const productRoutes = require('./routes/productRoutes');
// app.use('/api/v1/products', productRoutes); // Rutas para productos bajo /api/v1/products

// --- Manejo de Errores Básico (Ejemplo simple) ---
// Middleware para capturar rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Middleware para manejo de errores generales (debe ir al final)
app.use((err, req, res, next) => {
    console.error("Error no manejado:", err.stack);
    res.status(500).json({ message: 'Error interno del servidor' });
});


// --- Iniciar el Servidor ---
const PORT = process.env.PORT || 5000; // Usar puerto de .env o 5000 por defecto

app.listen(PORT, () => {
    console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    // Probar conexión a la BD al iniciar (opcional pero útil)
    dbPool.query('SELECT 1')
        .then(() => console.log('Conexión a MySQL verificada.'))
        .catch(err => console.error('Error al verificar conexión MySQL:', err));
});

module.exports = app; // Exportar app puede ser útil para pruebas