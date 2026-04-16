import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Cart({ cart, updateQuantity, removeFromCart, clearCart }) {
  const [email, setEmail] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)

  const handleCheckout = async () => {
    setIsProcessing(true)
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart,
          total,
          email
        })
      })
      
      if (response.ok) {
        toast.success('¡Pedido realizado con éxito!')
        clearCart()
        setEmail('')
      } else {
        toast.error('Error al realizar el pedido')
      }
    } catch (error) {
      toast.error('Error de conexión')
    } finally {
      setIsProcessing(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        El carrito está vacío
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {cart.map((item) => (
        <div key={item.id} className="flex items-center justify-between border-b pb-4">
          <div className="flex-1">
            <h4 className="font-semibold">{item.name}</h4>
            <p className="text-sm text-gray-600">${item.price.toFixed(2)} c/u</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min="1"
              max={item.stock}
              value={item.quantity}
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
              className="w-16 px-2 py-1 border rounded"
            />
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-red-600 hover:text-red-800"
            >
              Eliminar
            </button>
          </div>
          
          <div className="text-right min-w-[80px]">
            <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
          </div>
        </div>
      ))}
      
      <div className="pt-4 border-t">
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        
        <div className="mb-4">
          <input
            type="email"
            placeholder="Tu email (opcional)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border rounded"
          />
        </div>
        
        <button
          onClick={handleCheckout}
          disabled={isProcessing}
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition disabled:bg-gray-400"
        >
          {isProcessing ? 'Procesando...' : 'Confirmar Pedido'}
        </button>
      </div>
    </div>
  )
}