// frontend/src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './App.css';
import ProductForm from './components/ProductForm';
import CategoryManager from './components/CategoryManager'; // Importar CategoryManager

const API_URL = 'http://localhost:5000/api/v1';

function App() {
  // --- Estados ---
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]); // <<<--- Estado para categorías
  const [error, setError] = useState(null);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true); // <<<--- Estado de carga para categorías
  const [feedbackMessage, setFeedbackMessage] = useState({ type: '', text: '' });
  const [editingProduct, setEditingProduct] = useState(null);

  // --- Función para mostrar feedback ---
  const showFeedback = (message, type = 'success', duration = 3000) => {
    setFeedbackMessage({ text: message, type: type });
    setTimeout(() => setFeedbackMessage({ text: '', type: '' }), duration);
  };

  // --- Función para obtener Productos ---
  const fetchProducts = useCallback(async () => {
    console.log("Fetching products...");
    setLoadingProducts(true);
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
       if (error && error.includes("productos")) setError(null); // Limpiar error específico si éxito
    } catch (err) {
      console.error("Error al obtener productos:", err);
      setError("No se pudieron cargar los productos.");
      setProducts([]);
    } finally {
      setLoadingProducts(false);
    }
  }, [error]); // Dependencia de error para limpiar

  // --- Función para obtener Categorías ---
  const fetchCategories = useCallback(async () => {
    console.log("Fetching categories...");
    setLoadingCategories(true);
    try {
      const response = await axios.get(`${API_URL}/categories`);
      setCategories(response.data);
       if (error && error.includes("categorías")) setError(null); // Limpiar error específico si éxito
    } catch (err) {
      console.error("Error al obtener categorías:", err);
      setError("No se pudieron cargar las categorías.");
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  }, [error]); // Dependencia de error para limpiar

  // --- Cargar Datos Iniciales ---
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // --- Manejadores CRUD Productos ---
  const handleProductAdded = () => { showFeedback('Producto añadido!', 'success'); fetchProducts(); };
  const handleProductUpdated = () => { showFeedback('Producto actualizado!', 'success'); setEditingProduct(null); fetchProducts(); };
  const handleEditClick = (product) => { setEditingProduct(product); setFeedbackMessage({ text: '', type: '' }); document.querySelector('.product-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };
  const handleCancelEdit = () => { setEditingProduct(null); setFeedbackMessage({ text: '', type: '' }); };
  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`¿Eliminar "${productName}"?`)) {
      try {
        await axios.delete(`${API_URL}/products/${productId}`);
        showFeedback(`Producto "${productName}" eliminado.`, 'success');
        if (editingProduct?.id === productId) handleCancelEdit(); // Cancelar edición si se borra el editado
        fetchProducts();
      } catch (err) {
        showFeedback(err.response?.data?.message || "Error al eliminar.", 'error');
      }
    }
  };

  // --- Renderizado ---
  const isLoading = loadingProducts || loadingCategories;
  const loadError = (!isLoading && (products.length === 0 || categories.length === 0) && error);

  return (
    <>
      <h1>Sistema de Inventario</h1>
      {feedbackMessage.text && ( <p style={{ /* estilos feedback */ }}> {feedbackMessage.text} </p> )}
      {loadError && <p style={{ color: 'red', fontWeight: 'bold' }}>{error}</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2em' }}>
        {/* --- Sección Lista de Productos --- */}
        <div className="product-list-section">
          <h2>Lista de Productos Activos</h2>
          {loadingProducts && <p>Cargando productos...</p>}
          {!loadingProducts && products.length > 0 && !loadError && (
            <table border="1" style={{ /* estilos tabla */ }}>
              <thead style={{ backgroundColor: '#e9ecef' }}>
                <tr>
                  <th style={{/* ID */}}>ID</th>
                  <th style={{/* Nombre */}}>Nombre</th>
                  <th style={{/* Cat */}}>Categoría</th>
                  <th style={{/* Unidad */}}>Unidad</th>
                  <th style={{/* Venta */}}>P. Venta</th>
                  <th style={{/* Stock */}}>Stock</th>
                  <th style={{/* Acciones */}}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} style={{ borderBottom: '1px solid #dee2e6'}}>
                    <td style={{/* ID */}}>{product.id}</td>
                    <td style={{/* Nombre */}}>{product.nombre}</td>
                    <td style={{/* Cat */}}>{product.categoria || '-'}</td>
                    <td style={{/* Unidad */}}>{product.unidad_medida}</td>
                    <td style={{/* Venta */}}>{product.precio_venta != null ? parseFloat(product.precio_venta).toFixed(2) : '-'}</td>
                    <td style={{/* Stock */}}>{product.stock_actual != null ? parseFloat(product.stock_actual).toFixed(3) : '-'}</td>
                    <td style={{/* Acciones */}}>
                      <button onClick={() => handleEditClick(product)} style={{ /* estilo editar */ }}> Editar </button>
                      <button onClick={() => handleDeleteProduct(product.id, product.nombre)} style={{ /* estilo eliminar */ }}> Eliminar </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loadingProducts && products.length === 0 && !loadError && ( <p>No hay productos activos.</p> )}
        </div>

        {/* --- Formulario Producto (ahora recibe categories) --- */}
        <ProductForm
          productToEdit={editingProduct}
          onProductAdded={handleProductAdded}
          onProductUpdated={handleProductUpdated}
          onCancelEdit={handleCancelEdit}
          categories={categories} // <-- PASAR CATEGORÍAS
        />

        {/* --- Gestor de Categorías --- */}
        <div className="category-manager-section" style={{ marginTop: '2em', borderTop: '2px solid #007bff', paddingTop: '1em' }}>
          <h2>Gestión de Categorías</h2>
          {loadingCategories && <p>Cargando categorías...</p>}
          {!loadingCategories && !loadError && (
             <CategoryManager
               categories={categories}
               onCategoryChange={fetchCategories}
               showFeedback={showFeedback}
               apiUrl={API_URL}
             />
          )}
        </div>
      </div>
    </>
  );
}

export default App;

// Nota: Reemplaza los comentarios /* estilos ... */ con los estilos que tenías antes
// o ajusta los estilos según necesites. He puesto algunos básicos.