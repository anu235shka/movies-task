import { prisma } from '../prismaClient'
import { Request, Response } from 'express'
import { entryCreateSchema, entryUpdateSchema } from '../validators/entrySchemas'
import { z } from 'zod'

export const createEntry = async (req: Request, res: Response) => {
  try {
    console.log('Creating entry with data:', req.body)
    const parsed = entryCreateSchema.parse(req.body)
    console.log('Validation passed, parsed data:', parsed)
    const entry = await prisma.entry.create({ data: parsed })
    console.log('Entry created:', entry)
    return res.status(201).json(entry)
  } catch (err) {
    console.error('Create entry error:', err)
    if (err instanceof z.ZodError) {
      const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
      console.error('Validation errors:', messages)
      return res.status(400).json({ error: 'Validation failed: ' + messages })
    }
    return res.status(400).json({ error: err instanceof Error ? err.message : String(err) })
  }
}

export const getEntries = async (req: Request, res: Response) => {
  const page = parseInt((req.query.page as string) || "1", 10)
  const limit = parseInt((req.query.limit as string) || "20", 10)
  const skip = (page - 1) * limit

  try {
    const [total, entries] = await Promise.all([
      prisma.entry.count(),
      prisma.entry.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      })
    ])
    return res.json({ page, limit, total, data: entries })
  } catch (err) {
    console.error('Get entries error:', err)
    return res.status(500).json({ error: 'Server error' })
  }
}

export const updateEntry = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  try {
    console.log('Updating entry', id, 'with data:', req.body)
    const parsed = entryUpdateSchema.parse(req.body)
    console.log('Validation passed, parsed data:', parsed)
    const updated = await prisma.entry.update({
      where: { id },
      data: parsed
    })
    console.log('Entry updated:', updated)
    return res.json(updated)
  } catch (err) {
    console.error('Update entry error:', err)
    if (err instanceof z.ZodError) {
      const messages = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ')
      console.error('Validation errors:', messages)
      return res.status(400).json({ error: 'Validation failed: ' + messages })
    }
    return res.status(400).json({ error: err instanceof Error ? err.message : String(err) })
  }
}

export const deleteEntry = async (req: Request, res: Response) => {
  const id = Number(req.params.id)
  try {
    await prisma.entry.delete({ where: { id } })
    return res.json({ success: true })
  } catch (err) {
    console.error('Delete entry error:', err)
    return res.status(500).json({ error: 'Delete failed' })
  }
}
