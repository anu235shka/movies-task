import { PrismaClient } from './generated/prisma/client'

console.log('📦 Creating PrismaClient with DATABASE_URL:', process.env.DATABASE_URL)

export const prisma = new PrismaClient({
  log: ['error', 'warn'],
})
