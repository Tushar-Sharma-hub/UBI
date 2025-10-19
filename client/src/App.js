import React, { useState, useEffect, useCallback } from 'react';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Snackbar,
  Alert,
  CircularProgress,
  Backdrop,
  Chip
} from '@mui/material';
import { motion } from 'framer-motion';
import EnhancedDashboard from './components/EnhancedDashboard';
import ErrorBoundary from './components/ErrorBoundary';
import SimulationControls from './components/SimulationControls';
import ScenarioLibrary from './components/ScenarioLibrary';
import TransparencyPanel from './components/TransparencyPanel';
import NewsPanel from './components/NewsPanel';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import axios from 'axios';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00d4ff',
      light: '#66e3ff',
      dark: '#0099cc',
      contrastText: '#000000',
    },
    secondary: {
      main: '#ff6b35',
      light: '#ff9a66',
      dark: '#cc5529',
    },
    success: {
      main: '#00e676',
      light: '#66ffa6',
      dark: '#00b248',
    },
    error: {
      main: '#ff3d71',
      light: '#ff7aa3',
      dark: '#cc2e5a',
    },
    warning: {
      main: '#ffb74d',
      light: '#ffcf7d',
      dark: '#cc933e',
    },
    background: {
      default: '#0a0e1a',
      paper: '#1a1d29',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a3a6b4',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1.125rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1d29 50%, #232740 100%)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
          boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
          '&:hover': {
            background: 'linear-gradient(135deg, #0099cc 0%, #007aa3 100%)',
            boxShadow: '0 6px 20px rgba(0, 212, 255, 0.4)',
          },
        },
      },
    },
  },
});

function App() {
  const [economicData, setEconomicData] = useState(null);
  const [ubiCalculation, setUbiCalculation] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [simulationData, setSimulationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [currentView, setCurrentView] = useState('hero'); // 'hero', 'dashboard'

  const API_BASE = process.env.REACT_APP_API_URL || 'https://ubi-xvpw.onrender.com/api';

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      setConnectionStatus('connecting');
      try {
        const [economicResponse, ubiResponse, scenariosResponse] = await Promise.all([
          axios.get(`${API_BASE}/economic-data`),
          axios.get(`${API_BASE}/ubi-calculation`),
          axios.get(`${API_BASE}/scenarios`)
        ]);
        
        setEconomicData(economicResponse.data.data || economicResponse.data);
        setUbiCalculation(ubiResponse.data.data || ubiResponse.data);
        setScenarios(scenariosResponse.data.data || scenariosResponse.data);
        
        setConnectionStatus('connected');
        setNotification({
          open: true,
          message: 'Successfully connected to real-time data sources',
          severity: 'success'
        });
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
        setConnectionStatus('error');
        setNotification({
          open: true,
          message: 'Failed to connect to data sources',
          severity: 'error'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInitialData();
    
    // Set up polling interval
    const interval = setInterval(async () => {
      try {
        const [economicResponse, ubiResponse] = await Promise.all([
          axios.get(`${API_BASE}/economic-data`),
          axios.get(`${API_BASE}/ubi-calculation`)
        ]);
        
        setEconomicData(economicResponse.data.data || economicResponse.data);
        setUbiCalculation(ubiResponse.data.data || ubiResponse.data);
      } catch (error) {
        console.error('Failed to update data:', error);
      }
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [API_BASE]);


  const fetchEconomicData = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/economic-data`);
      setEconomicData(response.data.data || response.data);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Failed to fetch economic data:', error);
      setConnectionStatus('error');
    }
  }, [API_BASE]);

  const fetchUbiCalculation = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE}/ubi-calculation`);
      setUbiCalculation(response.data.data || response.data);
    } catch (error) {
      console.error('Failed to fetch UBI calculation:', error);
    }
  }, [API_BASE]);

  const handleSimulation = async (data) => {
    try {
      setNotification({ open: true, message: 'Running simulation...', severity: 'info' });
      const response = await axios.post(`${API_BASE}/simulate`, data);
      // API returns { success, data, meta }; dashboard expects fields at root
      const result = response.data?.data || response.data;
      setSimulationData(result);
      setNotification({ 
        open: true, 
        message: 'Simulation completed successfully!', 
        severity: 'success' 
      });
    } catch (error) {
      console.error('Failed to run simulation:', error);
      setNotification({ 
        open: true, 
        message: `Simulation failed: ${error.response?.data?.message || error.message}`, 
        severity: 'error' 
      });
    }
  };

  const handleScenarioSelect = async (scenario) => {
    setSelectedScenario(scenario);
    setNotification({ 
      open: true, 
      message: `Applying ${scenario.name} scenario...`, 
      severity: 'info' 
    });
    await handleSimulation(scenario.data);
  };

  const resetSimulation = () => {
    setSimulationData(null);
    setSelectedScenario(null);
    fetchUbiCalculation();
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    try {
      await axios.post(`${API_BASE}/refresh-data`);
      setNotification({
        open: true,
        message: 'Data refresh initiated. Updates will appear shortly.',
        severity: 'info'
      });
      // Refresh all data after manual update
      setTimeout(() => {
        fetchEconomicData();
        fetchUbiCalculation();
        setNotification({
          open: true,
          message: 'Data successfully refreshed from live sources',
          severity: 'success'
        });
      }, 2000);
    } catch (error) {
      console.error('Failed to refresh data:', error);
      setNotification({
        open: true,
        message: 'Failed to refresh data from external sources',
        severity: 'error'
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  const handleGetStarted = () => {
    setCurrentView('dashboard');
    // Smooth scroll to dashboard
    setTimeout(() => {
      const dashboardElement = document.getElementById('dashboard-section');
      if (dashboardElement) {
        dashboardElement.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  const handleBackToHome = () => {
    setCurrentView('hero');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      
      {/* Loading Backdrop */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress color="primary" size={60} />
          <Typography variant="h6" sx={{ mt: 2, color: 'primary.main' }}>
            Connecting to Live Data Sources...
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Federal Reserve • News API • Alpha Vantage
          </Typography>
        </Box>
      </Backdrop>

      {/* Notification System */}
      <Snackbar
        open={notification.open}
        autoHideDuration={8000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
      
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={0}>
          <Toolbar sx={{ py: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  boxShadow: '0 4px 15px rgba(0, 212, 255, 0.3)',
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#000' }}>
                  Ξ
                </Typography>
              </Box>
              <Box>
                <Typography variant="h5" component="div" sx={{ fontWeight: 700, mb: -0.5 }}>
                  UBI FLOW
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  Dynamic UBI Intelligence Platform
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {currentView === 'dashboard' && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    size="medium"
                    onClick={handleBackToHome}
                    sx={{ 
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      color: 'text.primary',
                      '&:hover': {
                        borderColor: 'primary.main',
                        background: 'rgba(0, 212, 255, 0.1)',
                      }
                    }}
                  >
                    Back to Home
                  </Button>
                </motion.div>
              )}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="medium"
                  onClick={refreshData}
                  disabled={isRefreshing}
                  startIcon={isRefreshing ? <CircularProgress size={16} color="inherit" /> : undefined}
                  sx={{ 
                    background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0099cc 0%, #007aa3 100%)',
                    },
                    '&:disabled': {
                      background: 'rgba(0, 212, 255, 0.3)',
                    }
                  }}
                >
                  {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
                </Button>
              </motion.div>
              <Box sx={{ textAlign: 'right' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Chip
                    label={connectionStatus === 'connected' ? 'LIVE DATA' : connectionStatus === 'connecting' ? 'CONNECTING' : 'OFFLINE'}
                    size="small"
                    color={connectionStatus === 'connected' ? 'success' : connectionStatus === 'connecting' ? 'warning' : 'error'}
                    sx={{ 
                      fontWeight: 600,
                      '& .MuiChip-label': {
                        fontSize: '0.75rem'
                      }
                    }}
                  />
                  {economicData?.lastUpdated && (
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Updated: {new Date(economicData.lastUpdated).toLocaleTimeString()}
                    </Typography>
                  )}
                </Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                  Federal Reserve • News API • Alpha Vantage
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        
        {/* Hero Section */}
        {currentView === 'hero' && (
          <HeroSection 
            economicData={economicData}
            onGetStarted={handleGetStarted}
          />
        )}

        {/* About Section */}
        {currentView === 'hero' && (
          <Container maxWidth="xl" sx={{ mt: 8, mb: 4 }}>
            <AboutSection />
          </Container>
        )}

        {/* Dashboard Section */}
        {currentView === 'dashboard' && (
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }} id="dashboard-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, staggerChildren: 0.1 }}
          >
            <ErrorBoundary>
            <Grid container spacing={3}>
              {/* Main Dashboard */}
              <Grid item xs={12} lg={8}>
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Paper 
                    sx={{ 
                      p: 2, 
                      height: 'fit-content',
                      background: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)',
                      border: '1px solid rgba(0, 212, 255, 0.2)',
                      borderRadius: 2,
                      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <EnhancedDashboard 
                      economicData={economicData}
                      ubiCalculation={simulationData || ubiCalculation}
                      isSimulation={!!simulationData}
                      selectedScenario={selectedScenario}
                      onResetSimulation={resetSimulation}
                    />
                  </Paper>
                </motion.div>
              </Grid>
            
            {/* Controls Panel */}
            <Grid item xs={12} lg={4}>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                    >
                      <Paper 
                        sx={{ 
                          p: 3,
                          background: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)',
                          border: '1px solid rgba(255, 107, 53, 0.2)',
                          borderRadius: 2,
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        <ScenarioLibrary 
                          scenarios={scenarios}
                          selectedScenario={selectedScenario}
                          onScenarioSelect={handleScenarioSelect}
                          isSimulating={!!simulationData}
                        />
                      </Paper>
                    </motion.div>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.4 }}
                    >
                      <Paper 
                        sx={{ 
                          p: 3,
                          background: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)',
                          border: '1px solid rgba(0, 230, 118, 0.2)',
                          borderRadius: 2,
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}
                      >
                        <SimulationControls 
                          economicData={economicData}
                          onSimulate={handleSimulation}
                          isSimulating={!!simulationData}
                        />
                      </Paper>
                    </motion.div>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 }}
                    >
                      <NewsPanel apiBase={API_BASE} />
                    </motion.div>
                  </Grid>
                </Grid>
              </motion.div>
            </Grid>
            
            {/* Transparency Panel */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Paper 
                  sx={{ 
                    p: 3,
                    background: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)',
                    border: '1px solid rgba(255, 184, 77, 0.2)',
                    borderRadius: 2,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                  }}
                >
                  <TransparencyPanel 
                    calculation={simulationData || ubiCalculation}
                    economicData={economicData}
                  />
                </Paper>
              </motion.div>
            </Grid>
            </Grid>
            </ErrorBoundary>
          </motion.div>
          </Container>
        )}
        
        {/* Footer */}
        <Footer />
      </Box>
    </ThemeProvider>
  );
}

export default App;
