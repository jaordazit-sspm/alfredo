import { NextResponse } from 'next/server'
//import { PrismaClient } from '@/generated/prisma/client';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id,items, total } = body
    
    const order = await prisma.order.create({
      data: {
        user_id: parseInt(user_id),
        items: JSON.parse(JSON.stringify(items)),
        total: parseFloat(total)
      }
    })
    
    // Actualizar stock
    for (const item of items) {
      await prisma.product.update({
        where: { id: item.id },
        data: { stock: { decrement: item.quantity } }
      })
    }
    
    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Error al crear pedido' },
      { status: 500 }
    )
  }
}