// backend/controllers/productController.js
const dbPool = require('../config/db');

const getAllProducts = async (req, res, next) => {
    console.log("Solicitud GET a /api/v1/products recibida");
    try {
        const query = `
            SELECT id, nombre, descripcion, categoria, unidad_medida, precio_venta,
                   precio_costo, stock_actual, stock_minimo, activo,
                   DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_creacion,
                   DATE_FORMAT(fecha_actualizacion, '%Y-%m-%d %H:%i:%s') as fecha_actualizacion
            FROM products WHERE activo = TRUE ORDER BY nombre ASC
        `;
        const [results] = await dbPool.query(query);
        console.log(`Encontrados ${results.length} productos activos.`);
        res.status(200).json(results);
    } catch (error) {
        console.error("Error en getAllProducts:", error);
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    console.log("Solicitud POST a /api/v1/products recibida");
    const { nombre, descripcion, categoria, unidad_medida, precio_venta, precio_costo, stock_actual, stock_minimo } = req.body;
    if (!nombre || !unidad_medida || precio_venta === undefined || stock_actual === undefined) {
         return res.status(400).json({ message: 'Faltan campos requeridos: nombre, unidad_medida, precio_venta, stock_actual' });
    }
    if (typeof precio_venta !== 'number' || typeof stock_actual !== 'number') {
         return res.status(400).json({ message: 'precio_venta y stock_actual deben ser números.' });
    }
    if (precio_venta < 0 || stock_actual < 0 || (precio_costo != null && precio_costo < 0) || (stock_minimo != null && stock_minimo < 0)) {
         return res.status(400).json({ message: 'Precios y stocks no pueden ser negativos.' });
    }
    try {
        const sql = `INSERT INTO products (nombre, descripcion, categoria, unidad_medida, precio_venta, precio_costo, stock_actual, stock_minimo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        const params = [ nombre, descripcion || null, categoria || null, unidad_medida, precio_venta, precio_costo === '' || precio_costo === null ? null : precio_costo, stock_actual, stock_minimo === '' || stock_minimo === null ? null : stock_minimo ];
        const [result] = await dbPool.query(sql, params);
        console.log(`Producto creado con ID: ${result.insertId}`);
        res.status(201).json({ message: 'Producto creado exitosamente', productId: result.insertId });
    } catch (error) {
        console.error("Error en createProduct:", error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: `Error: Ya existe un producto con el nombre '${nombre}'.` });
        }
        next(error);
    }
};

const getProductById = async (req, res, next) => {
    const productId = req.params.id;
    console.log(`Solicitud GET a /api/v1/products/${productId}`);
    if (isNaN(productId)) { return res.status(400).json({ message: 'ID de producto inválido.' }); }
    try {
        const query = `
            SELECT id, nombre, descripcion, categoria, unidad_medida, precio_venta,
                   precio_costo, stock_actual, stock_minimo, activo,
                   DATE_FORMAT(fecha_creacion, '%Y-%m-%d %H:%i:%s') as fecha_creacion,
                   DATE_FORMAT(fecha_actualizacion, '%Y-%m-%d %H:%i:%s') as fecha_actualizacion
            FROM products WHERE id = ? AND activo = TRUE
        `;
        const [results] = await dbPool.query(query, [productId]);
        if (results.length === 0) {
            return res.status(404).json({ message: `Producto con ID ${productId} no encontrado o no está activo.` });
        }
        res.status(200).json(results[0]);
    } catch (error) {
        console.error(`Error en getProductById (ID: ${productId}):`, error);
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    const productId = req.params.id;
    console.log(`Solicitud PUT a /api/v1/products/${productId}`);
    if (isNaN(productId)) { return res.status(400).json({ message: 'ID de producto inválido.' }); }
    const { nombre, descripcion, categoria, unidad_medida, precio_venta, precio_costo, stock_actual, stock_minimo } = req.body;
    if (!nombre || !unidad_medida || precio_venta === undefined || stock_actual === undefined) { return res.status(400).json({ message: 'Faltan campos requeridos.' }); }
    if (typeof precio_venta !== 'number' || typeof stock_actual !== 'number') { return res.status(400).json({ message: 'precio_venta y stock_actual deben ser números.' }); }
    if (precio_venta < 0 || stock_actual < 0 || (precio_costo != null && precio_costo < 0) || (stock_minimo != null && stock_minimo < 0)) { return res.status(400).json({ message: 'Precios y stocks no negativos.' }); }
    try {
        const sql = `UPDATE products SET nombre = ?, descripcion = ?, categoria = ?, unidad_medida = ?, precio_venta = ?, precio_costo = ?, stock_actual = ?, stock_minimo = ? WHERE id = ?`;
        const params = [ nombre, descripcion || null, categoria || null, unidad_medida, precio_venta, precio_costo === '' || precio_costo === null ? null : precio_costo, stock_actual, stock_minimo === '' || stock_minimo === null ? null : stock_minimo, productId ];
        const [result] = await dbPool.query(sql, params);
        if (result.affectedRows === 0) { return res.status(404).json({ message: `Producto con ID ${productId} no encontrado.` }); }
        res.status(200).json({ message: `Producto ID ${productId} actualizado exitosamente.` });
    } catch (error) {
        console.error(`Error en updateProduct (ID: ${productId}):`, error);
        if (error.code === 'ER_DUP_ENTRY') { return res.status(409).json({ message: `Error: Ya existe un producto con el nombre '${nombre}'.` }); }
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    const productId = req.params.id;
    console.log(`Solicitud DELETE a /api/v1/products/${productId}`);
    if (isNaN(productId)) { return res.status(400).json({ message: 'ID de producto inválido.' }); }
    try {
        const sql = `UPDATE products SET activo = FALSE WHERE id = ?`;
        const [result] = await dbPool.query(sql, [productId]);
        if (result.affectedRows === 0) { return res.status(404).json({ message: `Producto con ID ${productId} no encontrado.` }); }
        res.status(200).json({ message: `Producto ID ${productId} marcado como inactivo.` });
    } catch (error) {
        console.error(`Error en deleteProduct (ID: ${productId}):`, error);
        next(error);
    }
};

module.exports = {
    getAllProducts,
    createProduct,
    getProductById,
    updateProduct,
    deleteProduct,
};