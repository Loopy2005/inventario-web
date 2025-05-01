// frontend/src/components/ProductForm.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Asegúrate que esta URL es la correcta para tu backend
const API_URL = 'http://localhost:5000/api/v1';

function ProductForm({ productToEdit, onProductAdded, onProductUpdated, onCancelEdit }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [unidadMedida, setUnidadMedida] = useState('');
  const [precioVenta, setPrecioVenta] = useState('');
  const [precioCosto, setPrecioCosto] = useState('');
  const [stockActual, setStockActual] = useState('');
  const [stockMinimo, setStockMinimo] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Efecto para cargar datos cuando 'productToEdit' cambia
  useEffect(() => {
    if (productToEdit) {
      setIsEditing(true);
      setNombre(productToEdit.nombre || '');
      setDescripcion(productToEdit.descripcion || '');
      setCategoria(productToEdit.categoria || '');
      setUnidadMedida(productToEdit.unidad_medida || '');
      setPrecioVenta(productToEdit.precio_venta != null ? String(productToEdit.precio_venta) : '');
      setPrecioCosto(productToEdit.precio_costo != null ? String(productToEdit.precio_costo) : '');
      setStockActual(productToEdit.stock_actual != null ? String(productToEdit.stock_actual) : '');
      setStockMinimo(productToEdit.stock_minimo != null ? String(productToEdit.stock_minimo) : '');
      setError(null); setSuccess(null);
    } else {
      setIsEditing(false);
      setNombre(''); setDescripcion(''); setCategoria(''); setUnidadMedida('');
      setPrecioVenta(''); setPrecioCosto(''); setStockActual(''); setStockMinimo('');
      setError(null); setSuccess(null);
    }
  }, [productToEdit]);


  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); setSuccess(null);

    // Validaciones (sin cambios aquí)
    if (!nombre || !unidadMedida || !precioVenta || !stockActual) { setError("Campos obligatorios faltantes."); return; }
    const precioVentaNum = parseFloat(precioVenta);
    const stockActualNum = parseFloat(stockActual);
    const precioCostoNum = (precioCosto && !isNaN(parseFloat(precioCosto))) ? parseFloat(precioCosto) : null;
    const stockMinimoNum = (stockMinimo && !isNaN(parseFloat(stockMinimo))) ? parseFloat(stockMinimo) : null;
    if (isNaN(precioVentaNum) || isNaN(stockActualNum) || (precioCosto && isNaN(precioCostoNum)) || (stockMinimo && isNaN(stockMinimoNum)) ) { setError("Precios/Stocks deben ser números."); return; }
    if (precioVentaNum < 0 || stockActualNum < 0 || (precioCostoNum != null && precioCostoNum < 0) || (stockMinimoNum != null && stockMinimoNum < 0)) { setError("Precios/Stocks no negativos."); return; }

    const productData = {
      nombre, descripcion: descripcion || null, categoria: categoria || null,
      unidad_medida: unidadMedida, precio_venta: precioVentaNum, precio_costo: precioCostoNum,
      stock_actual: stockActualNum, stock_minimo: stockMinimoNum,
    };

    console.log("Datos a enviar:", productData);

    try {
      if (isEditing && productToEdit?.id) {
        // --- MODO EDICIÓN: Petición PUT ---
        // **** ESTA ES LA LÍNEA CORREGIDA ****
        const targetUrl = `${API_URL}/products/${productToEdit.id}`; // <-- CORREGIDO
        // **** ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^ ****
        console.log(`Enviando PUT a ${targetUrl}`);
        const response = await axios.put(targetUrl, productData); // Usar la variable construida
        console.log("Respuesta de actualización:", response.data);
        setSuccess(`¡Producto "${nombre}" (ID: ${productToEdit.id}) actualizado!`);
        if (onProductUpdated) onProductUpdated();

      } else {
        // --- MODO AÑADIR: Petición POST ---
        const targetUrl = `${API_URL}/products`;
        console.log(`Enviando POST a ${targetUrl}`);
        const response = await axios.post(targetUrl, productData);
        console.log("Respuesta de creación:", response.data);
        setSuccess(`¡Producto "${nombre}" añadido con ID: ${response.data.productId}!`);
        // Limpiar formulario solo al añadir
        setNombre(''); setDescripcion(''); setCategoria(''); setUnidadMedida('');
        setPrecioVenta(''); setPrecioCosto(''); setStockActual(''); setStockMinimo('');
        if (onProductAdded) onProductAdded();
      }
    } catch (err) {
      console.error("Error al guardar producto:", err);
      // Mostrar el error detallado en la consola del navegador también
      console.error("Detalle Error Axios:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || "Ocurrió un error al guardar el producto.";
      setError(errorMsg);
      setSuccess(null);
    }
  };

  // --- Renderizado del Formulario --- (Sin cambios estructurales)
  return (
    <div className="product-form-section" style={{ marginTop: '2em', borderTop: '1px solid #ccc', paddingTop: '1em', backgroundColor: isEditing ? '#f0f8ff' : 'transparent', padding: '1em', borderRadius: '8px' }}>
      <h2>{isEditing ? `Editando Producto ID: ${productToEdit?.id}` : 'Añadir Nuevo Producto'}</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px', margin: 'auto' }}>
        {error && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}
        {success && <p style={{ color: 'green', fontWeight: 'bold' }}>{success}</p>}
        <label>Nombre: * <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required /></label>
        <label>Descripción: <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} /></label>
        <label>Categoría: <input type="text" value={categoria} onChange={(e) => setCategoria(e.target.value)} /></label> {/* Cambiaremos esto después */}
        <label>Unidad Medida: * <input type="text" value={unidadMedida} onChange={(e) => setUnidadMedida(e.target.value)} required /></label>
        <label>Precio Venta: * <input type="number" step="0.01" min="0" value={precioVenta} onChange={(e) => setPrecioVenta(e.target.value)} required /></label>
        <label>Precio Costo: <input type="number" step="0.01" min="0" value={precioCosto} onChange={(e) => setPrecioCosto(e.target.value)} /></label>
        <label>Stock Actual: * <input type="number" step="0.001" min="0" value={stockActual} onChange={(e) => setStockActual(e.target.value)} required /></label>
        <label>Stock Mínimo: <input type="number" step="0.001" min="0" value={stockMinimo} onChange={(e) => setStockMinimo(e.target.value)} /></label>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <button type="submit">{isEditing ? 'Guardar Cambios' : 'Guardar Producto'}</button>
          {isEditing && (
            <button type="button" onClick={onCancelEdit} style={{ backgroundColor: '#6c757d', color: 'white' }}>
              Cancelar Edición
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
export default ProductForm;