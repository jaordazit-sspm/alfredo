import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany({
        orderBy: { created_at: 'desc' }
      })
      res.status(200).json(products)
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener productos' })
    }
  } 
  else if (req.method === 'POST') {
    try {
      const { name, description, price, stock, imageUrl } = req.body
      
      if (!name || !price || stock === undefined) {
        return res.status(400).json({ error: 'Faltan campos requeridos' })
      }
      
      const product = await prisma.product.create({
        data: { name, description, price: parseFloat(price), stock: parseInt(stock), imageUrl }
      })
      res.status(201).json(product)
    } catch (error) {
      res.status(500).json({ error: 'Error al crear producto' })
    }
  }
  else {
    res.status(405).json({ error: 'Método no permitido' })
  }
}