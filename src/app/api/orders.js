import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { user_id, items, total } = req.body
      
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
      
      res.status(201).json(order)
    } catch (error) {
      res.status(500).json({ error: 'Error al crear pedido' })
    }
  }
  else {
    res.status(405).json({ error: 'Método no permitido' })
  }
}