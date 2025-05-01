// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const dbPool = require('./config/db');

// Importar Rutas
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes'); // <<<--- AÑADIR ESTA LÍNEA

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta Raíz
app.get('/', (req, res) => {
  res.status(200).json({ message: 'API del Sistema de Inventario v1.0 Funcionando!' });
});

// Usar Rutas de la API
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/categories', categoryRoutes); // <<<--- AÑADIR ESTA LÍNEA

// TODO: Añadir otras rutas (ventas, stock, usuarios, etc.)

// Manejo de Errores (404 y 500)
app.use((req, res, next) => {
  res.status(404).json({ message: 'Ruta no encontrada' });
});
app.use((err, req, res, next) => {
  console.error("Error no manejado:", err.stack);
  res.status(500).json({ message: 'Error interno del servidor' });
});

// Iniciar Servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
  // Verificar conexión BD
  dbPool.query('SELECT 1')
    .then(() => console.log('Conexión a MySQL verificada.'))
    .catch(err => console.error('Error al verificar conexión MySQL:', err));
});

module.exports = app; // Para posibles pruebas