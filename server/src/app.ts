import express from 'express'
import cors from 'cors'
import entriesRoutes from './routes/entries'
import authRoutes from './routes/auth'
const app = express()

app.use(cors())
// Increase payload limit to 50MB for large image uploads
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use('/api/entries', entriesRoutes)
app.use('/api/auth', authRoutes)

// basic health
app.get('/api/health', (_, res) => res.json({ ok: true }))

export default app
