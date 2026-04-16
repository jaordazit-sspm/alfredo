import { NextResponse } from 'next/server'
//import { PrismaClient } from '@/generated/prisma/client';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { created_at: 'desc' }
    })
    
    // Asegurar que los tipos sean correctos
    const formattedProducts = products.map(product => ({
      ...product,
      price: Number(product.price),
      stock: Number(product.stock)
    }))

    return NextResponse.json(formattedProducts)
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al obtener productos' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, price, stock, imageUrl } = body
    
    if (!name || !price || stock === undefined) {
      return NextResponse.json(
        { error: 'Faltan campos requeridos' },
        { status: 400 }
      )
    }
    
    const product = await prisma.product.create({
      data: {
        name,
        description: description || '',
        price: parseFloat(String(price)),  // Asegurar que es número
        stock: parseInt(String(stock)),     // Asegurar que es entero
        imageUrl: imageUrl || null
      }
    })
     return NextResponse.json({
      ...product,
      price: Number(product.price),
      stock: Number(product.stock)
    }, { status: 201 })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error al crear producto' },
      { status: 500 }
    )
  }
}