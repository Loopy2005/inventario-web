// backend/controllers/categoryController.js
const dbPool = require('../config/db'); // Pool de conexiones a la BD

// --- Obtener Todas las Categorías ---
const getAllCategories = async (req, res, next) => {
    console.log("Solicitud GET a /api/v1/categories recibida");
    try {
        const query = `
            SELECT id, nombre, descripcion,
                   DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_creacion,
                   DATE_FORMAT(fecha_actualizacion, '%Y-%m-%d %H:%i:%s') as fecha_actualizacion
            FROM categories
            ORDER BY nombre ASC`;
        const [results] = await dbPool.query(query);
        console.log(`Encontradas ${results.length} categorías.`);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error en getAllCategories:", error);
        next(error); // Pasar al manejador de errores global
    }
};

// --- Crear Nueva Categoría ---
const createCategory = async (req, res, next) => {
    console.log("Solicitud POST a /api/v1/categories recibida");
    const { nombre, descripcion } = req.body;

    // Validación simple
    if (!nombre || nombre.trim() === '') {
        return res.status(400).json({ message: 'El nombre de la categoría es obligatorio.' });
    }

    try {
        const sql = `INSERT INTO categories (nombre, descripcion) VALUES (?, ?)`;
        const params = [nombre.trim(), descripcion ? descripcion.trim() : null];
        const [result] = await dbPool.query(sql, params);
        console.log(`Categoría creada con ID: ${result.insertId}`);
        res.status(201).json({
            message: 'Categoría creada exitosamente',
            categoryId: result.insertId
        });
    } catch (error) {
        console.error("Error en createCategory:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: `Error: Ya existe una categoría con el nombre '${nombre}'.` });
        }
        next(error);
    }
};

// --- Obtener Categoría por ID --- (Puede ser útil, aunque quizás no se use en la UI principal)
const getCategoryById = async (req, res, next) => {
    const categoryId = req.params.id;
    console.log(`Solicitud GET a /api/v1/categories/${categoryId}`);
    if (isNaN(categoryId)) { return res.status(400).json({ message: 'ID de categoría inválido.' }); }

    try {
        const query = `
            SELECT id, nombre, descripcion,
                   DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_creacion,
                   DATE_FORMAT(fecha_actualizacion, '%Y-%m-%d %H:%i:%s') as fecha_actualizacion
            FROM categories WHERE id = ?`;
        const [results] = await dbPool.query(query, [categoryId]);

        if (results.length === 0) {
            console.log(`Categoría con ID ${categoryId} no encontrada.`);
            return res.status(404).json({ message: `Categoría con ID ${categoryId} no encontrada.` });
        }
        console.log(`Categoría encontrada: ID=${results[0].id}`);
        res.status(200).json(results[0]);
    } catch (error) {
        console.error(`Error en getCategoryById (ID: ${categoryId}):`, error);
        next(error);
    }
};

// --- Actualizar Categoría ---
const updateCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    console.log(`Solicitud PUT a /api/v1/categories/${categoryId}`);
    if (isNaN(categoryId)) { return res.status(400).json({ message: 'ID de categoría inválido.' }); }

    const { nombre, descripcion } = req.body;
    if (!nombre || nombre.trim() === '') { // Validar nombre no vacío
         return res.status(400).json({ message: 'El nombre de la categoría es obligatorio.' });
    }

    try {
        const sql = `UPDATE categories SET nombre = ?, descripcion = ? WHERE id = ?`;
        const params = [nombre.trim(), descripcion ? descripcion.trim() : null, categoryId];
        const [result] = await dbPool.query(sql, params);

        if (result.affectedRows === 0) {
            console.log(`Categoría con ID ${categoryId} no encontrada para actualizar.`);
            return res.status(404).json({ message: `Categoría con ID ${categoryId} no encontrada.` });
        }
        console.log(`Categoría ID ${categoryId} actualizada.`);
        res.status(200).json({ message: `Categoría ID ${categoryId} actualizada.` });
    } catch (error) {
        console.error(`Error en updateCategory (ID: ${categoryId}):`, error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: `Error: Ya existe otra categoría con el nombre '${nombre}'.` });
        }
        next(error);
    }
};

// --- Eliminar Categoría ---
const deleteCategory = async (req, res, next) => {
    const categoryId = req.params.id;
    console.log(`Solicitud DELETE a /api/v1/categories/${categoryId}`);
    if (isNaN(categoryId)) { return res.status(400).json({ message: 'ID de categoría inválido.' }); }

    try {
        // OPCIONAL: Verificar si la categoría está en uso en la tabla 'products' antes de borrar.
        // Esto requeriría una consulta SELECT COUNT(*) FROM products WHERE categoria = (SELECT nombre FROM categories WHERE id = ?)
        // Si el conteo > 0, podríamos devolver un error 409 Conflict o 400 Bad Request.
        // Por simplicidad inicial, permitiremos borrar aunque esté en uso.

        const sql = `DELETE FROM categories WHERE id = ?`;
        const [result] = await dbPool.query(sql, [categoryId]);

        if (result.affectedRows === 0) {
            console.log(`Categoría con ID ${categoryId} no encontrada para eliminar.`);
            return res.status(404).json({ message: `Categoría con ID ${categoryId} no encontrada.` });
        }
        console.log(`Categoría ID ${categoryId} eliminada.`);
        res.status(200).json({ message: `Categoría ID ${categoryId} eliminada.` });
        // Podríamos usar res.status(204).send(); si no queremos cuerpo en la respuesta
    } catch (error) {
        console.error(`Error en deleteCategory (ID: ${categoryId}):`, error);
        // Podrían ocurrir errores si hubiera restricciones de Foreign Key en el futuro
        next(error);
    }
};

// Exportar todas las funciones
module.exports = {
    getAllCategories,
    createCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
};