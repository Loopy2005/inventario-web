// frontend/src/components/CategoryManager.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Asegúrate que esta URL es la correcta para tu backend
const API_URL = 'http://localhost:5000/api/v1'; // Reconfirmado

function CategoryManager({ categories, onCategoryChange, showFeedback, apiUrl }) {
  // Si apiUrl no se pasa, usa la constante local (fallback)
  const effectiveApiUrl = apiUrl || API_URL;

  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const [editingCategoryDesc, setEditingCategoryDesc] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null); // Considera si este estado local es necesario

  // Limpiar error local si las categorías cambian desde fuera
  useEffect(() => { setError(null); }, [categories]);

  const handleAddCategory = async (e) => {
    e.preventDefault(); setError(null); setSuccess(null);
    if (!newCategoryName.trim()) { setError("Nombre de categoría vacío."); return; }
    try {
      // Usar backticks y effectiveApiUrl
      await axios.post(`${effectiveApiUrl}/categories`, { nombre: newCategoryName, descripcion: newCategoryDesc });
      showFeedback(`Categoría "${newCategoryName}" añadida.`, 'success');
      setNewCategoryName(''); setNewCategoryDesc('');
      setError(null); // Limpiar error en éxito
      onCategoryChange(); // Refrescar lista en App.jsx
    } catch (err) {
      console.error("Error al añadir categoría:", err);
      const errorMsg = err.response?.data?.message || "Error al añadir la categoría.";
      setError(errorMsg); // Error específico del form
      showFeedback(errorMsg, 'error'); // Feedback general
      setSuccess(null);
    }
  };

  const handleEditClick = (category) => {
    setEditingCategoryId(category.id);
    setEditingCategoryName(category.nombre);
    setEditingCategoryDesc(category.descripcion || '');
    setError(null); setSuccess(null);
  };

  const handleCancelEdit = () => {
    setEditingCategoryId(null); setEditingCategoryName(''); setEditingCategoryDesc(''); setError(null); setSuccess(null);
  };

  const handleUpdateCategory = async (categoryId) => {
     setError(null); setSuccess(null);
    if (!editingCategoryName.trim()) { setError("Nombre de categoría vacío."); return; }
    try {
      // --- ¡¡CORRECCIÓN AQUÍ!! ---
      // Se eliminaron las etiquetas HTML incorrectas y se usó la sintaxis correcta de template literal
      const targetUrl = `${effectiveApiUrl}/categories/${categoryId}`;
      // --- ^^^^^^^^^^^^^^^^^^^^^^ ---
      console.log(`Enviando PUT a ${targetUrl} con:`, { nombre: editingCategoryName, descripcion: editingCategoryDesc });
      await axios.put(targetUrl, { nombre: editingCategoryName, descripcion: editingCategoryDesc }); //
      showFeedback(`Categoría ID ${categoryId} actualizada.`, 'success');
      setError(null);
      setEditingCategoryId(null);
      onCategoryChange();
    } catch (err) {
      console.error(`Error al actualizar categoría ID ${categoryId}:`, err);
      console.error("Detalle Error Axios:", err.response?.data || err.message);
      const errorMsg = err.response?.data?.message || "Error al actualizar la categoría.";
      setError(errorMsg); // Error específico del form
      showFeedback(errorMsg, 'error'); // Feedback general
      setSuccess(null);
    }
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
     setError(null); setSuccess(null);
    if (window.confirm(`¿Seguro de eliminar "${categoryName}" (ID: ${categoryId})?`)) {
      try {
        // --- ¡¡CORRECCIÓN AQUÍ!! ---
        // Se eliminaron las etiquetas HTML incorrectas y se usó la sintaxis correcta de template literal
        await axios.delete(`${effectiveApiUrl}/categories/${categoryId}`); //
        // --- ^^^^^^^^^^^^^^^^^^^^^^ ---
        showFeedback(`Categoría "${categoryName}" eliminada.`, 'success');
        setError(null);
        onCategoryChange();
      } catch (err) {
        console.error(`Error al eliminar categoría ID ${categoryId}:`, err);
        const errorMsg = err.response?.data?.message || "Error al eliminar la categoría.";
         setError(errorMsg);
         showFeedback(errorMsg, 'error'); setSuccess(null);
      }
    }
  };

  // --- Renderizado ---
  // (El resto del código de renderizado permanece igual que en el archivo original)
  // ... (copia aquí el return completo desde el archivo original) ...
  return (
    <div>
      {/* Formulario para añadir */}
      <form onSubmit={handleAddCategory} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
         <h4>Añadir Categoría</h4>
         {/* Mostrar errores/éxito de añadir aquí */}
         {error && !editingCategoryId && <p style={{color: 'red', fontWeight: 'bold', marginTop: 0}}>{error}</p>}
         {success && !editingCategoryId && <p style={{color: 'green', fontWeight: 'bold', marginTop: 0}}>{success}</p>}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
           <label htmlFor="newCatName" style={{ marginBottom: '0', marginRight: '5px'}}>Nombre*:</label>
          <input id="newCatName" type="text" placeholder="Nombre nueva categoría" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required style={{ flexGrow: 1, padding: '8px' }} />
           <label htmlFor="newCatDesc" style={{ marginBottom: '0', marginRight: '5px', marginLeft: '10px'}}>Desc:</label>
          <input id="newCatDesc" type="text" placeholder="Descripción (opcional)" value={newCategoryDesc} onChange={(e) => setNewCategoryDesc(e.target.value)} style={{ flexGrow: 2, padding: '8px' }} />
          <button type="submit" style={{ padding: '8px 15px', cursor:'pointer' }}>Añadir</button>
        </div>
      </form>

      {/* Tabla de categorías */}
      <h4>Categorías Actuales</h4>
      {categories.length === 0 ? (<p>No hay categorías definidas.</p>) : (
        <table border="1" style={{ margin: 'auto', width: '100%', maxWidth: '800px', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#e9ecef' }}>
            <tr>
              <th style={{ padding: '8px', width: '10%' }}>ID</th>
              <th style={{ padding: '8px', textAlign: 'left', width: '30%' }}>Nombre</th>
              <th style={{ padding: '8px', textAlign: 'left', width: '40%' }}>Descripción</th>
              <th style={{ padding: '8px', width: '20%' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(cat => (
              <tr key={cat.id} style={{ borderBottom: '1px solid #dee2e6', backgroundColor: editingCategoryId === cat.id ? '#f0f8ff' : 'transparent' }}>
                {editingCategoryId === cat.id ? (
                  // --- Modo Edición ---
                  <>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{cat.id}</td>
                    <td colSpan="2" style={{ padding: '5px' }}>
                       {/* Mostrar error de edición aquí */}
                       {error && <p style={{color: 'red', fontWeight: 'bold', margin: '0 0 5px 0'}}>{error}</p>}
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <label htmlFor={`editCatName-${cat.id}`} style={{flexBasis: '70px', textAlign: 'right'}}>Nombre*:</label>
                        <input id={`editCatName-${cat.id}`} type="text" value={editingCategoryName} onChange={(e) => setEditingCategoryName(e.target.value)} style={{ flexGrow: 1, padding: '4px' }}/>
                      </div>
                       <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginTop: '5px' }}>
                         <label htmlFor={`editCatDesc-${cat.id}`} style={{flexBasis: '70px', textAlign: 'right'}}>Desc:</label>
                        <input id={`editCatDesc-${cat.id}`} type="text" value={editingCategoryDesc} onChange={(e) => setEditingCategoryDesc(e.target.value)} style={{ flexGrow: 1, padding: '4px' }}/>
                       </div>
                    </td>
                    <td style={{ padding: '8px', textAlign: 'center', verticalAlign: 'middle'}}>
                      <button onClick={() => handleUpdateCategory(cat.id)} style={{ marginBottom: '5px', width: '80px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>Guardar</button>
                      <button onClick={handleCancelEdit} style={{ width: '80px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  // --- Modo Vista ---
                  <>
                    <td style={{ padding: '8px', textAlign: 'center' }}>{cat.id}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{cat.nombre}</td>
                    <td style={{ padding: '8px', textAlign: 'left' }}>{cat.descripcion || '-'}</td>
                    <td style={{ padding: '8px', textAlign: 'center' }}>
                      <button onClick={() => handleEditClick(cat)} style={{ marginRight: '5px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>Editar</button>
                      <button onClick={() => handleDeleteCategory(cat.id, cat.nombre)} style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer' }}>Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  ); //
}

export default CategoryManager;