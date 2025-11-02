import express from 'express'
import { createEntry, getEntries, updateEntry, deleteEntry } from '../controllers/entriesController'
import { authMiddleware } from '../middleware/auth'
const router = express.Router()

router.use(authMiddleware)
router.get('/', getEntries)        // GET /api/entries?page=1&limit=20
router.post('/', createEntry)      // POST /api/entries
router.put('/:id', updateEntry)    // PUT /api/entries/:id
router.delete('/:id', deleteEntry) // DELETE /api/entries/:id

export default router
