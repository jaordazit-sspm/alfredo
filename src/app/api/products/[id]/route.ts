import { NextResponse } from 'next/server'
//import { PrismaClient } from '@/generated/prisma/client';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(request: { json: () => any }, { params }: any) {
  try {
    const { id } = params
    const body = await request.json()
    const { name, description, price, stock, imageUrl } = body
    
    const product = await prisma.product.update({
      where: { id: parseInt(id) },
      data: { 
        name, 
        description, 
        price: parseFloat(price), 
        stock: parseInt(stock), 
        imageUrl 
      }
    })
    return NextResponse.json(product)
  } catch (error) {
    /*return NextResponse.json(
      { error: 'Error al actualizar producto' },
      { status: 500 }
    )*/
    console.error('Error en update /api/products:', error)
    return Response.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(request: any, { params }: any) {
  try {
    const { id } = params
    await prisma.product.delete({ 
      where: { id: parseInt(id) } 
    })
    return NextResponse.json({ message: 'Producto eliminado' })
  } catch (error) {
    /*return NextResponse.json(
      { error: 'Error al eliminar producto' },
      { status: 500 }
    )*/
    console.error('Error en delete /api/products:', error)
    return Response.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}