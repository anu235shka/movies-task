import React, { useState } from 'react'
import { createEntry, updateEntry } from '../api/entries'
import type { Entry } from '../api/entries'
import { Box, Button, TextField, MenuItem, Alert, FormHelperText } from '@mui/material'
import { CloudUpload } from '@mui/icons-material'
import { motion } from 'framer-motion'

type Props = {
  initial?: Partial<Entry>
  onDone?: (entry?: Entry) => void
}

export default function EntryForm({ initial = {}, onDone }: Props) {
  const [form, setForm] = useState<Partial<Entry>>({
    type: 'MOVIE',
    ...initial,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [posterPreview, setPosterPreview] = useState<string | null>(initial?.posterUrl || null)

  const handleChange = (k: keyof Entry, v: any) =>
    setForm((prev) => ({ ...prev, [k]: v }))

  const handlePosterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Compress and preview image
      const reader = new FileReader()
      reader.onload = () => {
        const img = new Image()
        img.onload = () => {
          // Create canvas and compress
          const canvas = document.createElement('canvas')
          let width = img.width
          let height = img.height
          
          // Reduce size if too large
          if (width > 600) {
            height = Math.round((height * 600) / width)
            width = 600
          }
          
          canvas.width = width
          canvas.height = height
          const ctx = canvas.getContext('2d')
          ctx?.drawImage(img, 0, 0, width, height)
          
          // Convert to base64 with aggressive compression
          const compressed = canvas.toDataURL('image/jpeg', 0.6)
          setPosterPreview(compressed)
          handleChange('posterUrl', compressed)
          console.log(`📸 Image compressed: ${(compressed.length / 1024).toFixed(2)}KB`)
        }
        img.src = reader.result as string
      }
      reader.readAsDataURL(file)
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    console.log('📝 Submitting form with data:', form)
    try {
      if (form.id) {
        // On update, only send changed fields to minimize payload
        const updatePayload: Partial<Entry> = {}
        if (initial.title !== form.title) updatePayload.title = form.title
        if (initial.type !== form.type) updatePayload.type = form.type
        if (initial.director !== form.director) updatePayload.director = form.director
        if (initial.budget !== form.budget) updatePayload.budget = form.budget
        if (initial.location !== form.location) updatePayload.location = form.location
        if (initial.duration !== form.duration) updatePayload.duration = form.duration
        if (initial.yearOrTime !== form.yearOrTime) updatePayload.yearOrTime = form.yearOrTime
        if (initial.posterUrl !== form.posterUrl) updatePayload.posterUrl = form.posterUrl
        
        console.log('📤 Sending update payload:', updatePayload)
        await updateEntry(form.id, updatePayload)
      } else {
        await createEntry(form as Entry)
      }
      console.log('✅ Entry saved successfully')
      onDone && onDone()
    } catch (err: any) {
      console.error('❌ Error saving entry:', err)
      const errorMsg = err.response?.data?.error || err.message || 'Error saving entry'
      setError(errorMsg)
      alert('❌ ' + errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={onSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        paddingTop: 2,
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Title"
        fullWidth
        value={form.title || ''}
        onChange={(e) => handleChange('title', e.target.value)}
        required
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#e50914',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#e50914',
          },
        }}
      />

      <TextField
        select
        label="Type"
        fullWidth
        value={form.type}
        onChange={(e) => handleChange('type', e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#e50914',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#e50914',
          },
        }}
      >
        <MenuItem value="MOVIE">Movie</MenuItem>
        <MenuItem value="TV_SHOW">TV Show</MenuItem>
      </TextField>

      <TextField
        label="Director"
        fullWidth
        value={form.director || ''}
        onChange={(e) => handleChange('director', e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#e50914',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#e50914',
          },
        }}
      />

      <TextField
        label="Budget"
        type="number"
        fullWidth
        value={form.budget ?? ''}
        onChange={(e) => handleChange('budget', e.target.value ? Number(e.target.value) : '')}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#e50914',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#e50914',
          },
        }}
      />

      <TextField
        label="Location"
        fullWidth
        value={form.location || ''}
        onChange={(e) => handleChange('location', e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#e50914',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#e50914',
          },
        }}
      />

      <TextField
        label="Duration"
        fullWidth
        value={form.duration || ''}
        onChange={(e) => handleChange('duration', e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#e50914',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#e50914',
          },
        }}
      />

      <TextField
        label="Year/Time"
        fullWidth
        value={form.yearOrTime || ''}
        onChange={(e) => handleChange('yearOrTime', e.target.value)}
        sx={{
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            color: '#fff',
            '& fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(255, 255, 255, 0.3)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#e50914',
            },
          },
          '& .MuiInputLabel-root': {
            color: 'rgba(255, 255, 255, 0.7)',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#e50914',
          },
        }}
      />

      {/* <Box>
        <input
          type="file"
          id="poster-upload"
          accept="image/*"
          onChange={handlePosterUpload}
          style={{ display: 'none' }}
        />
        <Button
          component="label"
          htmlFor="poster-upload"
          variant="outlined"
          startIcon={<CloudUpload />}
          fullWidth
          sx={{
            color: '#fff',
            borderColor: '#e50914',
            '&:hover': {
              borderColor: '#f40612',
              backgroundColor: 'rgba(229, 9, 20, 0.1)',
            },
          }}
        >
          Upload Poster Image
        </Button>
        <FormHelperText sx={{ color: 'rgba(255, 255, 255, 0.5)', textAlign: 'center', mt: 1 }}>
          Click to upload a poster image (optional)
        </FormHelperText>
      </Box>

      {posterPreview && (
        <Box
          component="img"
          src={posterPreview}
          alt="Poster Preview"
          sx={{
            width: '100%',
            maxHeight: '300px',
            objectFit: 'cover',
            borderRadius: '8px',
            border: '2px solid #e50914',
            marginTop: '1rem',
          }}
        />
      )} */}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, marginTop: 2 }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant="contained"
            type="submit"
            disabled={loading}
            sx={{
              backgroundColor: '#e50914',
              color: '#fff',
              fontWeight: 'bold',
              textTransform: 'none',
              paddingX: 3,
              '&:hover': {
                backgroundColor: '#f40612',
                boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
              },
              '&:disabled': {
                backgroundColor: '#555',
                color: '#999',
              },
            }}
          >
            {loading ? 'Saving...' : form.id ? 'Update' : 'Add'}
          </Button>
        </motion.div>
      </Box>
    </Box>
  )
}
