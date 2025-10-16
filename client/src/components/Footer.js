import React from 'react';
import { Box, Typography, Container, Divider, Chip } from '@mui/material';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1, duration: 0.5 }}
    >
      <Box
        component="footer"
        sx={{
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1d29 50%, #232740 100%)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          mt: 6,
          py: 4
        }}
      >
        <Container maxWidth="xl">
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, color: 'primary.main' }}>
                EconoFlow
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400 }}>
                Dynamic UBI Intelligence Platform powered by real-time economic data and AI analysis.
                Built for policy makers, researchers, and government officials.
              </Typography>
            </Box>
            
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={1}>
              <Typography variant="subtitle2" color="text.primary">
                Real-Time Data Sources
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap" justifyContent="flex-end">
                <Chip 
                  label="Federal Reserve (FRED)"
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(0, 212, 255, 0.1)',
                    color: 'primary.main',
                    border: '1px solid rgba(0, 212, 255, 0.3)'
                  }}
                />
                <Chip 
                  label="Bureau of Labor Statistics"
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(0, 230, 118, 0.1)',
                    color: 'success.main',
                    border: '1px solid rgba(0, 230, 118, 0.3)'
                  }}
                />
                <Chip 
                  label="NewsAPI"
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255, 107, 53, 0.1)',
                    color: 'secondary.main',
                    border: '1px solid rgba(255, 107, 53, 0.3)'
                  }}
                />
                <Chip 
                  label="Alpha Vantage"
                  size="small"
                  sx={{ 
                    backgroundColor: 'rgba(255, 183, 77, 0.1)',
                    color: 'warning.main',
                    border: '1px solid rgba(255, 183, 77, 0.3)'
                  }}
                />
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
            <Typography variant="caption" color="text.secondary">
              © 2024 EconoFlow. Built with React, Node.js, and Material-UI. 
              Hackathon-ready dynamic UBI simulation platform.
            </Typography>
            
            <Box display="flex" alignItems="center" gap={1}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: 'success.main',
                  animation: 'pulse 2s infinite'
                }}
              />
              <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                LIVE DATA ACTIVE
              </Typography>
            </Box>
          </Box>
        </Container>
        
        <style jsx>{`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.7; transform: scale(1.2); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}</style>
      </Box>
    </motion.div>
  );
};

export default Footer;