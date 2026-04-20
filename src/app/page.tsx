// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'

// Definición de tipos
interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  imageUrl: string | null
  created_at?: string
  updated_at?: string
}

interface CartItem extends Product {
  quantity: number
}

export default function HomePage() {
  // Estados
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showCart, setShowCart] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('todos')

  // Cargar productos y carrito al inicio
  useEffect(() => {
    fetchProducts()
    loadCartFromStorage()
  }, [])

  // Obtener productos de la API
  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('Error al cargar productos')
      const data = await response.json()
      
      // Convertir tipos de datos
      const formattedProducts = data.map((product: any) => ({
        ...product,
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        stock: typeof product.stock === 'string' ? parseInt(product.stock) : product.stock
      }))
      
      setProducts(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  // Cargar carrito desde localStorage
  const loadCartFromStorage = () => {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        setCart(JSON.parse(savedCart))
      }
    } catch (error) {
      console.error('Error al cargar carrito:', error)
    }
  }

  // Guardar carrito en localStorage
  const saveCartToStorage = (newCart: CartItem[]) => {
    try {
      localStorage.setItem('cart', JSON.stringify(newCart))
    } catch (error) {
      console.error('Error al guardar carrito:', error)
    }
  }

  // Agregar producto al carrito
  const addToCart = (product: Product) => {
    const safeStock = typeof product.stock === 'number' ? product.stock : Number(product.stock)
    const existingItem = cart.find(item => item.id === product.id)
    const currentQuantity = existingItem ? existingItem.quantity : 0
    
    if (currentQuantity < safeStock) {
      let newCart: CartItem[]
      if (existingItem) {
        newCart = cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      } else {
        newCart = [...cart, { ...product, quantity: 1 }]
      }
      setCart(newCart)
      saveCartToStorage(newCart)
      toast.success(`${product.name} agregado al carrito`)
    } else {
      toast.error(`No hay suficiente stock de ${product.name}`)
    }
  }

  // Actualizar cantidad de un producto en el carrito
  const updateQuantity = (productId: number, newQuantity: number) => {
    const product = products.find(p => p.id === productId)
    if (!product) return

    if (newQuantity > product.stock) {
      toast.error(`Solo hay ${product.stock} unidades disponibles`)
      return
    }

    if (newQuantity < 1) {
      removeFromCart(productId)
      return
    }

    const newCart = cart.map(item =>
      item.id === productId ? { ...item, quantity: newQuantity } : item
    )
    setCart(newCart)
    saveCartToStorage(newCart)
  }

  // Eliminar producto del carrito
  const removeFromCart = (productId: number) => {
    const product = cart.find(item => item.id === productId)
    const newCart = cart.filter(item => item.id !== productId)
    setCart(newCart)
    saveCartToStorage(newCart)
    if (product) {
      toast.success(`${product.name} eliminado del carrito`)
    }
  }

  // Vaciar carrito completo
  const clearCart = () => {
    setCart([])
    saveCartToStorage([])
    toast.success('Carrito vaciado')
  }

  // Calcular total del carrito
  const getCartTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  // Obtener número total de items en el carrito
  const getCartItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  // Filtrar productos por búsqueda
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  // Componente de ProductCard
  const ProductCard = ({ product }: { product: Product }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 bg-gray-200">
        {
        product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-300">
            <span className="text-gray-500">Sin imagen</span>
          </div>
        )}
        {product.stock === 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
            Agotado
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description || 'Sin descripción'}
        </p>
        <div className="flex justify-between items-center mb-3">
          <span className="text-2xl font-bold text-green-600">
            ${typeof product.price === 'number' ? product.price.toFixed(2) : Number(product.price).toFixed(2)}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {typeof product.stock === 'number' ? product.stock : Number(product.stock)}
          </span>
        </div>
        <button
          onClick={() => addToCart(product)}
          disabled={(typeof product.stock === 'number' ? product.stock : Number(product.stock)) === 0}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {(typeof product.stock === 'number' ? product.stock : Number(product.stock)) === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )

  // Componente del Carrito
  const CartSidebar = () => (
    <div className={`fixed inset-y-0 right-0 w-full md:w-96 bg-white shadow-2xl transform transition-transform duration-300 z-50 ${showCart ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="h-full flex flex-col">
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
          <h2 className="text-xl font-bold">Mi Carrito</h2>
          <button
            onClick={() => setShowCart(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-4xl mb-2">🛒</p>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 border-b pb-3">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden shrink-0">
                    {item.imageUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        🛍️
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800">{item.name}</h4>
                    <p className="text-green-600 font-bold">${typeof item.price === 'number' ? item.price.toFixed(2) : Number(item.price).toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 bg-gray-200 rounded hover:bg-gray-300"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-2 text-red-500 hover:text-red-700 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-between mb-3 text-lg font-bold">
            <span>Total:</span>
            <span className="text-green-600">${getCartTotal().toFixed(2)}</span>
          </div>
          <button
            onClick={clearCart}
            disabled={cart.length === 0}
            className="w-full bg-red-500 text-white py-2 rounded-lg mb-2 hover:bg-red-600 disabled:bg-gray-400"
          >
            Vaciar Carrito
          </button>
          <button
            onClick={() => {
              if (cart.length > 0) {
                toast.success('Pedido realizado con éxito')
                setCart([])
                saveCartToStorage([])
                setShowCart(false)
              }
            }}
            disabled={cart.length === 0}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
          >
            Confirmar Pedido
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 2000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 3000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-blue-600">
              Tienda SSPM
            </h1>
            
            <button
              onClick={() => setShowCart(true)}
              className="relative p-2 hover:bg-gray-100 rounded-full"
            >
              🛒
              {getCartItemCount() > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCartItemCount()}
                </span>
              )}
            </button>
          </div>
          
          {/* Barra de búsqueda */}
          <div className="mt-4 text-fuchsia-400">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </header>
      
      {/* Hero Banner */}
      <div className="bg-linear-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¡Ofertas Especiales!
          </h2>
          <p className="text-lg md:text-xl mb-6">
            Los mejores productos con los mejores precios
          </p>
          <div className="inline-flex gap-4">
            <div className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold">
              Envío Gratis
            </div>
            <div className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold">
              30 días de garantía
            </div>
          </div>
        </div>
      </div>
      
      {/* Productos */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">
          Nuestros Productos
          {searchTerm && ` - Resultados para "${searchTerm}"`}
        </h2>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No se encontraron productos' : 'No hay productos disponibles'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      
      {/* Carrito Sidebar */}
      <CartSidebar />
      
      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 Mi Tienda. Todos los derechos reservados.</p>
          <p className="text-sm text-gray-400 mt-2">
            Los pedidos son simulados - Sin pasarela de pago real
          </p>
        </div>
      </footer>
    </div>
  )
}