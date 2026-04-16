import { useState, useEffect } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import ProductCard from '../../components/productcard'
import Cart from '../../components/Cart'
import AdminPanel from '../../components/AdminPanel'

export default function Home() {
  const [products, setProducts] = useState([])
  const [cart, setCart] = useState([])
  const [showAdmin, setShowAdmin] = useState(false)
  const [isAdminAuth, setIsAdminAuth] = useState(false)
  const [adminPassword, setAdminPassword] = useState('')

  useEffect(() => {
    fetchProducts()
    loadCartFromStorage()
  }, [])

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products')
      const data = await response.json()
      setProducts(data)
    } catch (error) {
      toast.error('Error al cargar productos')
    }
  }

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCart(JSON.parse(savedCart))
    }
  }

  const saveCartToStorage = (newCart) => {
    localStorage.setItem('cart', JSON.stringify(newCart))
  }

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id)
    const currentQuantity = existingItem ? existingItem.quantity : 0
    
    if (currentQuantity < product.stock) {
      let newCart
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
      toast.success('Producto agregado al carrito')
    } else {
      toast.error('No hay suficiente stock')
    }
  }

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId)
    if (newQuantity <= product.stock && newQuantity > 0) {
      const newCart = cart.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
      setCart(newCart)
      saveCartToStorage(newCart)
    } else if (newQuantity > product.stock) {
      toast.error('Stock insuficiente')
    }
  }

  const removeFromCart = (productId) => {
    const newCart = cart.filter(item => item.id !== productId)
    setCart(newCart)
    saveCartToStorage(newCart)
    toast.success('Producto eliminado del carrito')
  }

  const clearCart = () => {
    setCart([])
    saveCartToStorage([])
  }

  const handleAdminLogin = () => {
    if (adminPassword === 'admin123') {
      setIsAdminAuth(true)
      setAdminPassword('')
    } else {
      toast.error('Contraseña incorrecta')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Toaster position="top-right" />
      
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">Mi Tienda</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowAdmin(!showAdmin)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            >
              {showAdmin ? 'Ver Catálogo' : 'Admin'}
            </button>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto p-4">
        {showAdmin ? (
          !isAdminAuth ? (
            <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded shadow">
              <h2 className="text-xl font-bold mb-4">Acceso Admin</h2>
              <input
                type="password"
                placeholder="Contraseña"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded mb-4"
              />
              <button
                onClick={handleAdminLogin}
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Ingresar
              </button>
            </div>
          ) : (
            <AdminPanel products={products} onProductUpdate={fetchProducts} />
          )
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-4 sticky top-4">
                <h2 className="text-xl font-bold mb-4">Carrito de Compras</h2>
                <Cart
                  cart={cart}
                  updateQuantity={updateQuantity}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}