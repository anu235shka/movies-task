import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { fetchEntries, deleteEntry } from '../api/entries'
import type { Entry } from '../api/entries'
import EntryForm from './EntryForm'
import Navbar from './Navbar'
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  IconButton,
  Tooltip,
  Typography,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  CardMedia,
} from '@mui/material'
import {
  Edit,
  Delete,
  Add,
  FilterList,
  Clear,
  Movie,
  Tv,
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

export default function EntriesTable() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'MOVIE' | 'TV_SHOW'>('ALL')
  const [showFilters, setShowFilters] = useState(false)
  const observerRef = useRef<HTMLDivElement | null>(null)

  const loadPage = useCallback(
    async (p = page) => {
      setLoading(true)
      try {
        const res = await fetchEntries(p, 20)
        if (res.data.length === 0 || entries.length + res.data.length >= res.total)
          setHasMore(false)
        setEntries((prev) => [...prev, ...res.data])
      } finally {
        setLoading(false)
      }
    },
    [page, entries.length]
  )

  useEffect(() => {
    loadPage(1)
    setPage(1)
  }, [])

  // intersection observer to load next page
  useEffect(() => {
    if (!hasMore) return
    const el = observerRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entriesObs) => {
        entriesObs.forEach((e) => {
          if (e.isIntersecting && !loading) {
            setPage((prev) => {
              const next = prev + 1
              loadPage(next)
              return next
            })
          }
        })
      },
      { rootMargin: '200px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [hasMore, loading, loadPage])

  // edit modal state
  const [editing, setEditing] = useState<Entry | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      const matchesSearch =
        searchQuery === '' ||
        entry.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.location?.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesType = typeFilter === 'ALL' || entry.type === typeFilter

      return matchesSearch && matchesType
    })
  }, [entries, searchQuery, typeFilter])

  const handleDelete = async (id?: number) => {
    if (!id) return
    if (!window.confirm('Delete this entry?')) return
    await deleteEntry(id)
    setEntries((prev) => prev.filter((e) => e.id !== id))
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setTypeFilter('ALL')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#141414',
        color: '#fff',
      }}
    >
      <Navbar onSearch={handleSearch} />

      <Box sx={{ padding: '2rem', maxWidth: '1600px', margin: '0 auto' }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#fff',
            }}
          >
            My Library
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                startIcon={<FilterList />}
                onClick={() => setShowFilters(!showFilters)}
                sx={{
                  color: '#fff',
                  borderColor: 'rgba(255, 255, 255, 0.3)',
                  '&:hover': {
                    borderColor: '#e50914',
                    backgroundColor: 'rgba(229, 9, 20, 0.1)',
                  },
                }}
                variant="outlined"
              >
                Filters
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => {
                  setEditing(null)
                  setShowForm(true)
                }}
                sx={{
                  backgroundColor: '#e50914',
                  color: '#fff',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    backgroundColor: '#f40612',
                    boxShadow: '0 4px 12px rgba(229, 9, 20, 0.4)',
                  },
                }}
              >
                Add Movie/Show
              </Button>
            </motion.div>
          </Box>
        </Box>

        {/* Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Paper
                sx={{
                  padding: '1.5rem',
                  marginBottom: '2rem',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    alignItems: 'center',
                    flexWrap: 'wrap',
                  }}
                >
                  <FormControl
                    sx={{
                      minWidth: 200,
                      '& .MuiOutlinedInput-root': {
                        color: '#fff',
                        '& fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#e50914',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }}
                  >
                    <InputLabel>Type</InputLabel>
                    <Select
                      value={typeFilter}
                      label="Type"
                      onChange={(e) =>
                        setTypeFilter(e.target.value as typeof typeFilter)
                      }
                    >
                      <MenuItem value="ALL">All</MenuItem>
                      <MenuItem value="MOVIE">Movies</MenuItem>
                      <MenuItem value="TV_SHOW">TV Shows</MenuItem>
                    </Select>
                  </FormControl>

                  {(searchQuery || typeFilter !== 'ALL') && (
                    <Button
                      startIcon={<Clear />}
                      onClick={handleClearFilters}
                      sx={{
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}
                </Box>
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        {filteredEntries.length > 0 && (
          <Typography
            variant="body2"
            sx={{ color: 'rgba(255, 255, 255, 0.7)', marginBottom: '1rem' }}
          >
            Showing {filteredEntries.length} of {entries.length} entries
          </Typography>
        )}

        {/* Table */}
        <Paper
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden',
          }}
        >
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                {/* <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                  Poster
                </TableCell> */}
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                  Title
                </TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                  Type
                </TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                  Director
                </TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                  Budget
                </TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                  Location
                </TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                  Duration
                </TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                  Year/Time
                </TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <AnimatePresence>
                {filteredEntries.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ padding: '4rem' }}>
                      <Typography variant="h6" sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
                        No entries found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
                {filteredEntries.map((row, index) => (
                  <TableRow
                    key={row.id}
                    component={motion.tr}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      },
                    }}
                  >
                    {/* <TableCell>
                      {row.posterUrl ? (
                        <CardMedia
                          component="img"
                          sx={{
                            width: 60,
                            height: 90,
                            objectFit: 'cover',
                            borderRadius: '4px',
                          }}
                          image={row.posterUrl}
                          alt={row.title}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 60,
                            height: 90,
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: '4px',
                          }}
                        >
                          {row.type === 'MOVIE' ? (
                            <Movie sx={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                          ) : (
                            <Tv sx={{ color: 'rgba(255, 255, 255, 0.3)' }} />
                          )}
                        </Box>
                      )}
                    </TableCell> */}
                    <TableCell sx={{ color: '#fff', fontWeight: 500 }}>
                      {row.title}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={row.type === 'MOVIE' ? 'Movie' : 'TV Show'}
                        size="small"
                        icon={
                          row.type === 'MOVIE' ? (
                            <Movie sx={{ fontSize: '1rem' }} />
                          ) : (
                            <Tv sx={{ fontSize: '1rem' }} />
                          )
                        }
                        sx={{
                          backgroundColor:
                            row.type === 'MOVIE'
                              ? 'rgba(229, 9, 20, 0.2)'
                              : 'rgba(100, 181, 246, 0.2)',
                          color: '#fff',
                          border:
                            row.type === 'MOVIE'
                              ? '1px solid #e50914'
                              : '1px solid #64b5f6',
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {row.director || '-'}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {row.budget ? `$${row.budget.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {row.location || '-'}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {row.duration || '-'}
                    </TableCell>
                    <TableCell sx={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                      {row.yearOrTime || '-'}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            size="small"
                            onClick={() => {
                              setEditing(row)
                              setShowForm(true)
                            }}
                            sx={{
                              color: '#64b5f6',
                              '&:hover': {
                                backgroundColor: 'rgba(100, 181, 246, 0.2)',
                              },
                            }}
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(row.id)}
                            sx={{
                              color: '#e50914',
                              '&:hover': {
                                backgroundColor: 'rgba(229, 9, 20, 0.2)',
                              },
                            }}
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        </Paper>

        {/* Loading indicator */}
        <div ref={observerRef} style={{ height: 1 }} />
        {loading && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              padding: '2rem',
            }}
          >
            <CircularProgress sx={{ color: '#e50914' }} />
          </Box>
        )}
        {!hasMore && entries.length > 0 && (
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: 'rgba(255, 255, 255, 0.5)',
              padding: '2rem',
            }}
          >
            No more entries
          </Typography>
        )}
      </Box>

      {/* Entry Form Dialog */}
      <Dialog
        open={showForm}
        onClose={() => setShowForm(false)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            backgroundColor: 'rgba(20, 20, 20, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <DialogTitle
          sx={{
            color: '#fff',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {editing ? 'Edit Entry' : 'Add New Entry'}
        </DialogTitle>
        <DialogContent sx={{ padding: '2rem' }}>
          <EntryForm
            initial={editing || {}}
            onDone={() => {
              setShowForm(false)
              setEntries([])
              setPage(1)
              setHasMore(true)
              loadPage(1)
            }}
          />
        </DialogContent>
      </Dialog>
    </Box>
  )
}
