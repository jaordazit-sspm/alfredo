import { NextRequest, NextResponse } from 'next/server'
//import { PrismaClient } from '@/generated/prisma/client';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const product = await prisma.product.update({ where: { id: parseInt(id) }, data: body })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Error en update /api/products/[id]:', error)
    return Response.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await prisma.product.delete({ where: { id: parseInt(id) } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error en delete /api/products/[id]:', error)
    return Response.json(
      { error: String(error) },
      { status: 500 }
    )
  }
}