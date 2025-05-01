// backend/routes/categoryRoutes.js
const express = require('express');
const categoryController = require('../controllers/categoryController'); // Importaremos el controlador
const router = express.Router();

// --- Definición de Rutas para Categorías ---

// GET /api/v1/categories -> Obtener todas las categorías
router.get('/', categoryController.getAllCategories);

// POST /api/v1/categories -> Crear una nueva categoría
router.post('/', categoryController.createCategory);

// GET /api/v1/categories/:id -> Obtener una categoría por ID (Quizás no sea necesaria, pero la definimos)
router.get('/:id', categoryController.getCategoryById);

// PUT /api/v1/categories/:id -> Actualizar una categoría por ID
router.put('/:id', categoryController.updateCategory);

// DELETE /api/v1/categories/:id -> Eliminar una categoría por ID
router.delete('/:id', categoryController.deleteCategory);

module.exports = router; // Exportar el router