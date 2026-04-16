import { useState } from 'react'
import toast from 'react-hot-toast'

export default function AdminPanel({ products, onProductUpdate }) {
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    imageUrl: ''
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const url = editingProduct 
      ? `/api/products/${editingProduct.id}`
      : '/api/products'
    
    const method = editingProduct ? 'PUT' : 'POST'
    
    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (response.ok) {
        toast.success(editingProduct ? 'Producto actualizado' : 'Producto creado')
        onProductUpdate()
        resetForm()
      } else {
        toast.error('Error al guardar producto')
      }
    } catch (error) {
      toast.error('Error de conexión')
    }
  }

  const handleDelete = async (id) => {
    if (confirm('¿Eliminar este producto?')) {
      try {
        const response = await fetch(`/api/products/${id}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          toast.success('Producto eliminado')
          onProductUpdate()
        }
      } catch (error) {
        toast.error('Error al eliminar')
      }
    }
  }

  const resetForm = () => {
    setEditingProduct(null)
    setFormData({ name: '', description: '', price: '', stock: '', imageUrl: '' })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Administrar Productos</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded">
        <input
          type="text"
          placeholder="Nombre"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <textarea
          placeholder="Descripción"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          className="w-full px-3 py-2 border rounded"
        />
        <input
          type="number"
          placeholder="Precio"
          value={formData.price}
          onChange={(e) => setFormData({...formData, price: e.target.value})}
          className="w-full px-3 py-2 border rounded"
          required
          step="0.01"
        />
        <input
          type="number"
          placeholder="Stock"
          value={formData.stock}
          onChange={(e) => setFormData({...formData, stock: e.target.value})}
          className="w-full px-3 py-2 border rounded"
          required
        />
        <input
          type="url"
          placeholder="URL de imagen"
          value={formData.imageUrl}
          onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
          className="w-full px-3 py-2 border rounded"
        />
        
        <div className="flex space-x-2">
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            {editingProduct ? 'Actualizar' : 'Crear Producto'}
          </button>
          {editingProduct && (
            <button type="button" onClick={resetForm} className="bg-gray-500 text-white px-4 py-2 rounded">
              Cancelar
            </button>
          )}
        </div>
      </form>
      
      <div className="grid gap-4">
        {products.map((product) => (
          <div key={product.id} className="border rounded p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">Stock: {product.stock} | ${product.price}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setEditingProduct(product)
                  setFormData(product)
                }}
                className="text-blue-600"
              >
                Editar
              </button>
              <button onClick={() => handleDelete(product.id)} className="text-red-600">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}