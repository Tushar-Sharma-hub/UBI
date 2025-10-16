import React, { useState, useEffect } from 'react';
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
  Paper
} from '@mui/material';
import EnhancedDashboard from './components/EnhancedDashboard';
import SimulationControls from './components/SimulationControls';
import ScenarioLibrary from './components/ScenarioLibrary';
import TransparencyPanel from './components/TransparencyPanel';
import NewsPanel from './components/NewsPanel';
import Footer from './components/Footer';
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

  const API_BASE = 'http://localhost:5001/api';

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        await Promise.all([
          fetchEconomicData(),
          fetchUbiCalculation(),
          fetchScenarios()
        ]);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };
    
    fetchInitialData();
    const interval = setInterval(fetchEconomicData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);


  const fetchEconomicData = async () => {
    try {
      const response = await axios.get(`${API_BASE}/economic-data`);
      setEconomicData(response.data);
    } catch (error) {
      console.error('Failed to fetch economic data:', error);
    }
  };

  const fetchUbiCalculation = async () => {
    try {
      const response = await axios.get(`${API_BASE}/ubi-calculation`);
      setUbiCalculation(response.data);
    } catch (error) {
      console.error('Failed to fetch UBI calculation:', error);
    }
  };

  const fetchScenarios = async () => {
    try {
      const response = await axios.get(`${API_BASE}/scenarios`);
      setScenarios(response.data);
    } catch (error) {
      console.error('Failed to fetch scenarios:', error);
    }
  };

  const handleSimulation = async (data) => {
    try {
      const response = await axios.post(`${API_BASE}/simulate`, data);
      setSimulationData(response.data);
    } catch (error) {
      console.error('Failed to run simulation:', error);
    }
  };

  const handleScenarioSelect = (scenario) => {
    setSelectedScenario(scenario);
    handleSimulation(scenario.data);
  };

  const resetSimulation = () => {
    setSimulationData(null);
    setSelectedScenario(null);
    fetchUbiCalculation();
  };

  const refreshData = async () => {
    try {
      await axios.post(`${API_BASE}/refresh-data`);
      // Refresh all data after manual update
      setTimeout(() => {
        fetchEconomicData();
        fetchUbiCalculation();
      }, 2000);
    } catch (error) {
      console.error('Failed to refresh data:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
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
                  EconoFlow
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                  Dynamic UBI Intelligence Platform
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Button
                variant="outlined"
                size="small"
                onClick={refreshData}
                sx={{ color: 'primary.main', borderColor: 'primary.main' }}
              >
                Refresh Data
              </Button>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body2" sx={{ color: 'success.main', fontWeight: 600 }}>
                  ● LIVE DATA
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Federal Reserve • BLS • NewsAPI
                </Typography>
              </Box>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
          <Grid container spacing={3}>
            {/* Main Dashboard */}
            <Grid item xs={12} lg={8}>
              <Paper sx={{ p: 2, height: 'fit-content' }}>
                <EnhancedDashboard 
                  economicData={economicData}
                  ubiCalculation={simulationData || ubiCalculation}
                  isSimulation={!!simulationData}
                  selectedScenario={selectedScenario}
                  onResetSimulation={resetSimulation}
                />
              </Paper>
            </Grid>
            
            {/* Controls Panel */}
            <Grid item xs={12} lg={4}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <ScenarioLibrary 
                      scenarios={scenarios}
                      selectedScenario={selectedScenario}
                      onScenarioSelect={handleScenarioSelect}
                    />
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <SimulationControls 
                      economicData={economicData}
                      onSimulate={handleSimulation}
                      isSimulating={!!simulationData}
                    />
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <NewsPanel apiBase={API_BASE} />
                </Grid>
              </Grid>
            </Grid>
            
            {/* Transparency Panel */}
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }}>
                <TransparencyPanel 
                  calculation={simulationData || ubiCalculation}
                  economicData={economicData}
                />
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;
