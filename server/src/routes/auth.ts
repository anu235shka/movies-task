import express from 'express'
import { prisma } from '../prismaClient'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET || 'secret'

router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: 'Email already registered' })
    const hashed = await bcrypt.hash(password, 10)
    const otp = Math.floor(100000 + Math.random() * 900000).toString()
    await prisma.user.create({ data: { email, password: hashed, otp, name: name || 'User' } })
    console.log(`OTP for ${email}: ${otp}`)
    res.json({ message: 'OTP sent to your email (simulated)' })
  } catch (error: any) {
    console.error('Signup error:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body
    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required' })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || user.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' })
    const updated = await prisma.user.update({ where: { email }, data: { verified: true, otp: null } })
    const token = jwt.sign({ id: updated.id, email: updated.email }, JWT_SECRET)
    res.json({ user: { id: updated.id, email: updated.email, name: updated.name }, token })
  } catch (error: any) {
    console.error('Verify OTP error:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) return res.status(400).json({ error: 'Invalid credentials' })
    if (!user.verified) return res.status(400).json({ error: 'User not verified. Please verify your email first.' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ error: 'Invalid credentials' })
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET)
    res.json({ user: { id: user.id, email: user.email, name: user.name }, token })
  } catch (error: any) {
    console.error('Login error:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

export default router
