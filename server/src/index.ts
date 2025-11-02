import 'dotenv/config'
console.log('✅ Environment loaded:', { DATABASE_URL: process.env.DATABASE_URL ? '✓' : '✗', PORT: process.env.PORT })

import app from './app'

const port = process.env.PORT || 4000
app.listen(port, () => console.log(`🚀 Server listening on port ${port}`))
