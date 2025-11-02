import express from 'express'
import { createEntry, getEntries, updateEntry, deleteEntry } from '../controllers/entriesController'
import { authMiddleware } from '../middleware/auth'
const router = express.Router()

router.use(authMiddleware)
router.get('/', getEntries)        
router.post('/', createEntry)      
router.put('/:id', updateEntry)    
router.delete('/:id', deleteEntry) 

export default router
