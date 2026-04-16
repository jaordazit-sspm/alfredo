import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  const { id } = req.query

  if (req.method === 'PUT') {
    try {
      const { name, description, price, stock, imageUrl } = req.body
      const product = await prisma.product.update({
        where: { id: parseInt(id) },
        data: { name, description, price: parseFloat(price), stock: parseInt(stock), imageUrl }
      })
      res.status(200).json(product)
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar producto' })
    }
  } 
  else if (req.method === 'DELETE') {
    try {
      await prisma.product.delete({ where: { id: parseInt(id) } })
      res.status(200).json({ message: 'Producto eliminado' })
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar producto' })
    }
  }
  else {
    res.status(405).json({ error: 'Método no permitido' })
  }
}