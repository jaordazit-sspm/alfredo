'use client'

import Image from 'next/image'

interface Product {
  id: number
  name: string
  description: string
  price: number | string
  stock: number
  imageUrl: string | null
}

interface Props {
  product: Product
  onAddToCart: (product: Product) => void
}

export default function ProductCard({ product, onAddToCart }: Props) {
    // Convertir a número seguro
  const price = typeof product.price === 'number' ? product.price : parseFloat(product.price)
  const stock = typeof product.stock === 'number' ? product.stock : parseInt(product.stock as string)

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {product.imageUrl && (
        <div className="relative h-48">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
        <p className="text-2xl font-bold text-green-600 mb-2">
          ${price.toFixed(2)}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Stock: {stock} unidades
        </p>
        <button
          onClick={() => onAddToCart(product)}
          disabled={stock === 0}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {stock === 0 ? 'Sin stock' : 'Agregar al carrito'}
        </button>
      </div>
    </div>
  )
}