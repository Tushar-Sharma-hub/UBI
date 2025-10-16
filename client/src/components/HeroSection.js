import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  TrendingUp,
  Psychology,
  Analytics,
  PlayArrow
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const HeroSection = ({ economicData, onGetStarted }) => {
  const [currentStatIndex, setCurrentStatIndex] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const dynamicStats = [
    {
      label: 'Current Unemployment',
      value: economicData?.unemployment ? `${economicData.unemployment}%` : '4.3%',
      change: '-0.2%',
      positive: true,
      icon: <TrendingUp />
    },
    {
      label: 'Inflation Rate',
      value: economicData?.inflation ? `${economicData.inflation.toFixed(2)}%` : '2.34%',
      change: '-0.1%',
      positive: true,
      icon: <Analytics />
    },
    {
      label: 'GDP Growth',
      value: economicData?.gdp ? `$${(economicData.gdp / 1000).toFixed(1)}T` : '$30.5T',
      change: '+2.1%',
      positive: true,
      icon: <TrendingUp />
    },
    {
      label: 'Market Sentiment',
      value: 'Positive',
      change: '+15%',
      positive: true,
      icon: <Psychology />
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStatIndex((prev) => (prev + 1) % dynamicStats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [dynamicStats.length]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <Box sx={{ 
      background: `
        linear-gradient(135deg, #0a0e1a 0%, #1a1d29 50%, #232740 100%),
        radial-gradient(circle at 30% 20%, rgba(0, 212, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 70% 80%, rgba(0, 230, 118, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(255, 107, 53, 0.08) 0%, transparent 70%)
      `,
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          linear-gradient(45deg, transparent 48%, rgba(0, 212, 255, 0.03) 49%, rgba(0, 212, 255, 0.03) 51%, transparent 52%),
          linear-gradient(-45deg, transparent 48%, rgba(0, 230, 118, 0.02) 49%, rgba(0, 230, 118, 0.02) 51%, transparent 52%)
        `,
        backgroundSize: '60px 60px',
        animation: 'gridMove 20s linear infinite',
        zIndex: 0
      }
    }}>
      {/* Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 20%, rgba(0, 212, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(0, 230, 118, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 60%, rgba(255, 107, 53, 0.1) 0%, transparent 50%)
        `,
        zIndex: 0
      }} />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: '100%', position: 'relative', zIndex: 1 }}
      >
        <Box sx={{ maxWidth: 1400, mx: 'auto', px: 3, py: 8 }}>
          <Grid container spacing={6} alignItems="center">
            {/* Left Content */}
            <Grid item xs={12} lg={6}>
              <motion.div variants={itemVariants}>
                <Chip
                  label="Live Economic Data"
                  sx={{
                    background: 'rgba(0, 212, 255, 0.1)',
                    color: 'primary.main',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    mb: 3,
                    fontWeight: 600
                  }}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography variant="h1" sx={{
                  fontSize: isMobile ? '2.5rem' : '4.5rem',
                  fontWeight: 900,
                  lineHeight: 1.1,
                  mb: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #00d4ff 30%, #0099cc 60%, #ffffff 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textShadow: '0 0 30px rgba(0, 212, 255, 0.5)',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(135deg, #00e676 0%, #66ffa6 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    opacity: 0.7,
                    filter: 'blur(1px)',
                    zIndex: -1
                  }
                }}>
                  The Future of
                  <br />
                  <span style={{ 
                    background: 'linear-gradient(135deg, #00e676 0%, #66ffa6 50%, #00d4ff 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 10px rgba(0, 230, 118, 0.5))'
                  }}>
                    UBI Intelligence
                  </span>
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Typography variant="h5" color="text.secondary" sx={{
                  mb: 4,
                  lineHeight: 1.6,
                  fontWeight: 400,
                  maxWidth: '90%'
                }}>
                  Revolutionary platform that combines real-time economic data, 
                  AI-powered sentiment analysis, and advanced scenario modeling 
                  to optimize Universal Basic Income programs.
                </Typography>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<PlayArrow />}
                    onClick={onGetStarted}
                    sx={{
                      background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                      boxShadow: '0 8px 30px rgba(0, 212, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                      px: 5,
                      py: 2,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      borderRadius: '50px',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        transition: 'left 0.5s'
                      },
                      '&:hover': {
                        background: 'linear-gradient(135deg, #0099cc 0%, #007aa3 100%)',
                        boxShadow: '0 12px 40px rgba(0, 212, 255, 0.6), 0 0 20px rgba(0, 212, 255, 0.3)',
                        transform: 'translateY(-3px) scale(1.05)',
                        '&::before': {
                          left: '100%'
                        }
                      },
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                  >
                    Explore Platform
                  </Button>
                </Box>
              </motion.div>

              {/* Dynamic Stats */}
              <motion.div variants={itemVariants}>
                <Box sx={{ mt: 6 }}>
                  <Typography variant="h6" sx={{ mb: 2, opacity: 0.8 }}>
                    Live Economic Indicators
                  </Typography>
                  <Box sx={{ position: 'relative', height: 80 }}>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentStatIndex}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        transition={{ duration: 0.5 }}
                        style={{ position: 'absolute', width: '100%' }}
                      >
                        <Card sx={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                          backdropFilter: 'blur(10px)',
                          p: 3
                        }}>
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box>
                              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {dynamicStats[currentStatIndex].value}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {dynamicStats[currentStatIndex].label}
                              </Typography>
                            </Box>
                            <Box textAlign="right">
                              <Chip
                                label={dynamicStats[currentStatIndex].change}
                                size="small"
                                sx={{
                                  background: dynamicStats[currentStatIndex].positive 
                                    ? 'rgba(0, 230, 118, 0.2)' 
                                    : 'rgba(255, 61, 113, 0.2)',
                                  color: dynamicStats[currentStatIndex].positive 
                                    ? '#00e676' 
                                    : '#ff3d71',
                                  fontWeight: 600
                                }}
                              />
                              <Box sx={{ color: 'primary.main', mt: 1 }}>
                                {dynamicStats[currentStatIndex].icon}
                              </Box>
                            </Box>
                          </Box>
                        </Card>
                      </motion.div>
                    </AnimatePresence>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* Right Content - Floating Cards */}
            <Grid item xs={12} lg={6}>
              <Box sx={{ position: 'relative', height: 600 }}>
                {/* Main Dashboard Preview */}
                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  style={{
                    position: 'absolute',
                    top: 50,
                    left: 50,
                    zIndex: 3
                  }}
                >
                  <Card sx={{
                    background: 'linear-gradient(135deg, rgba(26, 29, 41, 0.9) 0%, rgba(35, 39, 64, 0.9) 100%)',
                    border: '1px solid rgba(0, 212, 255, 0.4)',
                    borderRadius: 4,
                    p: 3,
                    boxShadow: '0 25px 80px rgba(0, 0, 0, 0.5), 0 0 30px rgba(0, 212, 255, 0.2)',
                    backdropFilter: 'blur(15px)',
                    width: 320,
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '2px',
                      background: 'linear-gradient(90deg, transparent, #00d4ff, transparent)'
                    }
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                        UBI Calculator
                      </Typography>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body2">Monthly UBI</Typography>
                        <Typography variant="h6" color="success.main">
                          $1,200
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="body2">Coverage</Typography>
                        <Typography variant="body2" color="text.secondary">
                          95.2%
                        </Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="body2">Cost Efficiency</Typography>
                        <Typography variant="body2" color="warning.main">
                          High
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Sentiment Analysis Card */}
                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  style={{
                    position: 'absolute',
                    top: 200,
                    right: 20,
                    zIndex: 2
                  }}
                >
                  <Card sx={{
                    background: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)',
                    border: '1px solid rgba(0, 230, 118, 0.3)',
                    borderRadius: 3,
                    p: 2,
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    width: 250
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'success.main' }}>
                        Market Sentiment
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Psychology sx={{ color: 'success.main' }} />
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                          Positive
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        +0.15 sentiment score
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Analytics Card */}
                <motion.div
                  variants={floatingVariants}
                  animate="animate"
                  style={{
                    position: 'absolute',
                    bottom: 100,
                    left: 20,
                    zIndex: 1
                  }}
                >
                  <Card sx={{
                    background: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)',
                    border: '1px solid rgba(255, 107, 53, 0.3)',
                    borderRadius: 3,
                    p: 2,
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
                    backdropFilter: 'blur(10px)',
                    width: 280
                  }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ mb: 2, color: 'secondary.main' }}>
                        Economic Trends
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <TrendingUp sx={{ color: 'success.main' }} />
                        <Typography variant="body1">
                          Unemployment ↓ 4.3%
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1} mt={1}>
                        <Analytics sx={{ color: 'primary.main' }} />
                        <Typography variant="body1">
                          GDP Growth ↑ 2.1%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </motion.div>
      
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>
    </Box>
  );
};

export default HeroSection;
