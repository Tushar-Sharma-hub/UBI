import React, { useState } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Collapse,
  Divider
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Analytics,
  Security,
  Speed,
  Public,
  Psychology,
  Timeline,
  CompareArrows,
  Assessment,
  CloudSync,
  VerifiedUser
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AboutSection = () => {
  const [expanded, setExpanded] = useState(false);

  const features = [
    {
      icon: <Analytics sx={{ fontSize: 40, color: '#00d4ff' }} />,
      title: 'Real-Time Economic Data',
      description: 'Live integration with Federal Reserve, Bureau of Labor Statistics, and financial markets for accurate UBI calculations.',
      color: '#00d4ff'
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: '#00e676' }} />,
      title: 'AI-Powered Sentiment Analysis',
      description: 'Advanced natural language processing to analyze news sentiment and its impact on economic conditions.',
      color: '#00e676'
    },
    {
      icon: <CompareArrows sx={{ fontSize: 40, color: '#ff6b35' }} />,
      title: 'Scenario Modeling',
      description: 'Test different economic scenarios and see how they affect UBI calculations and distribution strategies.',
      color: '#ff6b35'
    },
    {
      icon: <Timeline sx={{ fontSize: 40, color: '#ffb74d' }} />,
      title: 'Historical Analysis',
      description: 'Track UBI performance over time with comprehensive historical data and trend analysis.',
      color: '#ffb74d'
    },
    {
      icon: <Security sx={{ fontSize: 40, color: '#9c27b0' }} />,
      title: 'Transparent Calculations',
      description: 'Fully auditable algorithms with complete transparency in how UBI amounts are determined.',
      color: '#9c27b0'
    },
    {
      icon: <CloudSync sx={{ fontSize: 40, color: '#607d8b' }} />,
      title: 'Live Data Sync',
      description: 'Automatically updated economic indicators ensure your UBI calculations are always current.',
      color: '#607d8b'
    }
  ];

  const stats = [
    { label: 'Data Sources', value: '12+', icon: <Public /> },
    { label: 'Update Frequency', value: 'Real-time', icon: <Speed /> },
    { label: 'Accuracy Rate', value: '99.7%', icon: <VerifiedUser /> },
    { label: 'API Calls/Day', value: '10K+', icon: <Assessment /> }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card sx={{ 
        background: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3,
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
        overflow: 'hidden'
      }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={4}>
              <Box>
                <Typography variant="h4" sx={{ 
                  fontWeight: 700, 
                  background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1
                }}>
                  UBI FLOW
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
                  Dynamic UBI Intelligence Platform
                </Typography>
              </Box>
              <IconButton 
                onClick={() => setExpanded(!expanded)}
                sx={{ 
                  color: 'primary.main',
                  transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.3s ease'
                }}
              >
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {stats.map((stat, index) => (
                <Grid item xs={6} md={3} key={index}>
                  <motion.div
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <Card sx={{ 
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      textAlign: 'center',
                      p: 2,
                      height: '100%'
                    }}>
                      <Box sx={{ color: 'primary.main', mb: 1 }}>
                        {stat.icon}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                        {stat.value}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {stat.label}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Description */}
          <motion.div variants={itemVariants}>
            <Typography variant="body1" color="text.secondary" sx={{ 
              mb: 3, 
              lineHeight: 1.7,
              fontSize: '1.1rem'
            }}>
              UBI FLOW revolutionizes Universal Basic Income (UBI) planning and implementation through 
              real-time economic data analysis, AI-powered sentiment tracking, and comprehensive scenario modeling. 
              Our platform provides policymakers, economists, and researchers with the tools needed to design, 
              test, and optimize UBI programs that respond dynamically to changing economic conditions.
            </Typography>
          </motion.div>

          {/* Features Grid */}
          <Collapse in={expanded} timeout="auto">
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
              
              <Typography variant="h5" sx={{ 
                fontWeight: 600, 
                mb: 3,
                background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Platform Features
              </Typography>

              <Grid container spacing={3}>
                {features.map((feature, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <motion.div
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      whileHover="hover"
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card sx={{ 
                        background: 'rgba(255, 255, 255, 0.03)',
                        border: `1px solid ${feature.color}20`,
                        borderRadius: 2,
                        p: 3,
                        height: '100%',
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: '3px',
                          background: `linear-gradient(90deg, ${feature.color} 0%, ${feature.color}80 100%)`
                        }
                      }}>
                        <Box display="flex" alignItems="flex-start" gap={2}>
                          <Box sx={{ 
                            p: 1.5, 
                            borderRadius: 2,
                            background: `${feature.color}15`,
                            border: `1px solid ${feature.color}30`
                          }}>
                            {feature.icon}
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ 
                              fontWeight: 600, 
                              mb: 1,
                              color: feature.color
                            }}>
                              {feature.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                              {feature.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>

              {/* Technology Stack */}
              <Box sx={{ mt: 4, p: 3, background: 'rgba(255, 255, 255, 0.02)', borderRadius: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                  Technology Stack
                </Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {['React', 'Node.js', 'Material-UI', 'Framer Motion', 'Chart.js', 'Axios', 'Federal Reserve API', 'News API', 'Alpha Vantage'].map((tech) => (
                    <Chip
                      key={tech}
                      label={tech}
                      size="small"
                      sx={{
                        background: 'rgba(0, 212, 255, 0.1)',
                        color: 'primary.main',
                        border: '1px solid rgba(0, 212, 255, 0.3)',
                        '&:hover': {
                          background: 'rgba(0, 212, 255, 0.2)'
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </motion.div>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AboutSection;
