import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button, TextField, InputAdornment, IconButton, Box, Typography, Container, CircularProgress } from '@mui/material'
import { Visibility, VisibilityOff, Email, VpnKey } from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'

export default function Signup() {
  const { signup, verifyOtp, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [stage, setStage] = useState<'signup' | 'otp'>('signup')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const nav = useNavigate()

  useEffect(() => {
    if (user) {
      nav('/', { replace: true })
    }
  }, [user, nav])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signup(email, password, name)
      setStage('otp')
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || err.response?.data?.error || 'Signup failed')
    } finally {
      setLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
    await verifyOtp(email, otp)
    nav('/')
    } catch (err: any) {
      setError(err.message || err.response?.data?.message || err.response?.data?.error || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #141414 0%, #1a1a1a 50%, #000 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.1 }}
        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 50% 50%, #e50914 0%, transparent 70%)',
        }}
      />

      <Container maxWidth="xs">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          key={stage}
        >
          <Box
            sx={{
              position: 'relative',
              zIndex: 1,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              style={{ textAlign: 'center', marginBottom: '2rem' }}
            >
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontFamily: "'Bebas Neue', cursive",
                  fontWeight: 'bold',
                  color: '#e50914',
                  letterSpacing: '2px',
                  textShadow: '0 0 20px rgba(229, 9, 20, 0.5)',
                }}
              >
                NETFLIX
              </Typography>
            </motion.div>

            <Box
              component="form"
              onSubmit={stage === 'signup' ? handleSignup : handleVerify}
              sx={{
                backgroundColor: 'rgba(0, 0, 0, 0.85)',
                padding: '3rem',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <AnimatePresence mode="wait">
        {stage === 'signup' ? (
                  <motion.div
                    key="signup"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography
                      variant="h4"
                      component="h2"
                      sx={{
                        color: '#fff',
                        fontWeight: 'bold',
                        marginBottom: '2rem',
                        textAlign: 'center',
                      }}
                    >
                      Sign Up
                    </Typography>

                    {error && (
                      <Box
                        component={motion.div}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        sx={{
                          backgroundColor: 'rgba(229, 9, 20, 0.2)',
                          color: '#e50914',
                          padding: '0.75rem',
                          borderRadius: '4px',
                          marginBottom: '1rem',
                          border: '1px solid #e50914',
                        }}
                      >
                        {error}
                      </Box>
                    )}

                    <TextField
                      label="Name"
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      sx={{
                        marginBottom: '1.5rem',
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#333',
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#555',
                          },
                          '&:hover fieldset': {
                            borderColor: '#777',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#e50914',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#999',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#e50914',
                        },
                      }}
                    />

                    <TextField
                      label="Email"
                      type="email"
                      fullWidth
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      sx={{
                        marginBottom: '1.5rem',
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#333',
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#555',
                          },
                          '&:hover fieldset': {
                            borderColor: '#777',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#e50914',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#999',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#e50914',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email sx={{ color: '#999' }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <TextField
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      sx={{
                        marginBottom: '2rem',
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#333',
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#555',
                          },
                          '&:hover fieldset': {
                            borderColor: '#777',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#e50914',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#999',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#e50914',
                        },
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                              sx={{ color: '#999' }}
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{
                          backgroundColor: '#e50914',
                          color: '#fff',
                          padding: '0.875rem',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          borderRadius: '4px',
                          textTransform: 'none',
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
                        {loading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} sx={{ color: '#fff' }} />
                            Signing Up...
                          </Box>
                        ) : (
                          'Sign Up'
                        )}
                      </Button>
                    </motion.div>

                    <Typography
                      sx={{
                        color: '#999',
                        textAlign: 'center',
                        marginTop: '2rem',
                        fontSize: '0.9rem',
                      }}
                    >
                      Already have account?{' '}
                      <Link
                        to="/login"
                        style={{
                          color: '#fff',
                          textDecoration: 'none',
                          fontWeight: 'bold',
                        }}
                      >
                        Sign in now
                      </Link>
                    </Typography>
                  </motion.div>
                ) : (
                  <motion.div
                    key="verify"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Typography
                      variant="h4"
                      component="h2"
                      sx={{
                        color: '#fff',
                        fontWeight: 'bold',
                        marginBottom: '1rem',
                        textAlign: 'center',
                      }}
                    >
                      Verify OTP
                    </Typography>

                    <Typography
                      sx={{
                        color: '#999',
                        textAlign: 'center',
                        marginBottom: '1rem',
                        fontSize: '0.9rem',
                      }}
                    >
                      We've sent a verification code to {email}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#64b5f6',
                        textAlign: 'center',
                        marginBottom: '2rem',
                        fontSize: '0.85rem',
                        fontStyle: 'italic',
                      }}
                    >
                      Check the backend server console for the OTP code
                    </Typography>

                    {error && (
                      <Box
                        component={motion.div}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        sx={{
                          backgroundColor: 'rgba(229, 9, 20, 0.2)',
                          color: '#e50914',
                          padding: '0.75rem',
                          borderRadius: '4px',
                          marginBottom: '1rem',
                          border: '1px solid #e50914',
                        }}
                      >
                        {error}
                      </Box>
                    )}

                    <TextField
                      label="Enter OTP"
                      fullWidth
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      sx={{
                        marginBottom: '2rem',
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#333',
                          color: '#fff',
                          '& fieldset': {
                            borderColor: '#555',
                          },
                          '&:hover fieldset': {
                            borderColor: '#777',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#e50914',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: '#999',
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#e50914',
                        },
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <VpnKey sx={{ color: '#999' }} />
                          </InputAdornment>
                        ),
                      }}
                    />

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={loading}
                        sx={{
                          backgroundColor: '#e50914',
                          color: '#fff',
                          padding: '0.875rem',
                          fontSize: '1rem',
                          fontWeight: 'bold',
                          borderRadius: '4px',
                          textTransform: 'none',
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
                        {loading ? (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <CircularProgress size={20} sx={{ color: '#fff' }} />
                            Verifying...
                          </Box>
                        ) : (
                          'Verify OTP'
                        )}
                      </Button>
                    </motion.div>

                    <Button
                      fullWidth
                      onClick={() => setStage('signup')}
                      sx={{
                        color: '#999',
                        marginTop: '1rem',
                        textTransform: 'none',
                        '&:hover': {
                          color: '#fff',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      Back to Sign Up
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  )
}
