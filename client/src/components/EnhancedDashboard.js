import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Alert,
  LinearProgress,
  Skeleton
} from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
import { 
  TrendingUp, 
  TrendingDown, 
  AttachMoney, 
  People,
  ShowChart,
  Assessment,
  Refresh
} from '@mui/icons-material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const MetricCard = ({ title, value, subtitle, icon, color, trend, isLoading, prefix = '', suffix = '' }) => {
  const trendColor = trend > 0 ? 'success.main' : trend < 0 ? 'error.main' : 'text.secondary';
  
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        sx={{ 
          height: '100%',
          background: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          position: 'relative',
          overflow: 'visible'
        }}
      >
        <CardContent sx={{ p: 3 }}>
          {/* Glowing border effect */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
              borderRadius: '12px 12px 0 0'
            }}
          />
          
          <Box display="flex" alignItems="flex-start" justifyContent="space-between">
            <Box flex={1}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {title}
              </Typography>
              
              {isLoading ? (
                <Skeleton variant="text" width="60%" height={40} />
              ) : (
                <Typography variant="h3" component="div" sx={{ fontWeight: 700, color }}>
                  {prefix}
                  <CountUp
                    end={typeof value === 'number' ? value : 0}
                    duration={1.5}
                    separator=","
                    decimals={typeof value === 'number' && value % 1 !== 0 ? 1 : 0}
                  />
                  {suffix}
                </Typography>
              )}
              
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
              
              {trend !== undefined && (
                <Box display="flex" alignItems="center" mt={1}>
                  {trend > 0 ? (
                    <TrendingUp sx={{ fontSize: 16, color: trendColor, mr: 0.5 }} />
                  ) : trend < 0 ? (
                    <TrendingDown sx={{ fontSize: 16, color: trendColor, mr: 0.5 }} />
                  ) : null}
                  <Typography variant="caption" sx={{ color: trendColor, fontWeight: 600 }}>
                    {trend > 0 ? '+' : ''}{trend?.toFixed(1)}%
                  </Typography>
                </Box>
              )}
            </Box>
            
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${color}20 0%, ${color}10 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${color}30`
              }}
            >
              {React.cloneElement(icon, { sx: { color, fontSize: 24 } })}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const ProfessionalChart = ({ title, children, actions }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <Card 
      sx={{ 
        background: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        height: '100%'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
            {title}
          </Typography>
          {actions && (
            <Box display="flex" gap={1}>
              {actions}
            </Box>
          )}
        </Box>
        {children}
      </CardContent>
    </Card>
  </motion.div>
);

const EnhancedDashboard = ({ 
  economicData, 
  ubiCalculation, 
  isSimulation, 
  selectedScenario,
  onResetSimulation 
}) => {
  if (!economicData || !ubiCalculation) {
    return (
      <Box p={4}>
        <Grid container spacing={3}>
          {[...Array(4)].map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={20} width="60%" />
                  <Skeleton variant="text" height={40} width="80%" />
                  <Skeleton variant="text" height={16} width="40%" />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  
  // Enhanced chart configurations with professional styling
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20,
          color: '#ffffff',
          font: {
            family: 'Inter',
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(26, 29, 41, 0.95)',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: 'rgba(0, 212, 255, 0.3)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          family: 'Inter',
          weight: 'bold'
        },
        bodyFont: {
          family: 'Inter'
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#a3a6b4',
          font: {
            family: 'Inter'
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
          drawBorder: false
        },
        ticks: {
          color: '#a3a6b4',
          font: {
            family: 'Inter'
          }
        },
        beginAtZero: true
      }
    }
  };

  // Economic indicators with gradient backgrounds
  const economicChartData = {
    labels: ['Unemployment', 'Inflation', 'Cost of Living'],
    datasets: [
      {
        label: 'Current Values',
        data: [
          economicData.unemployment,
          economicData.inflation,
          economicData.costOfLiving
        ],
        backgroundColor: [
          'rgba(255, 107, 113, 0.8)',
          'rgba(78, 205, 196, 0.8)',
          'rgba(69, 183, 209, 0.8)'
        ],
        borderColor: [
          '#ff6b71',
          '#4ecdc4',
          '#45b7d1'
        ],
        borderWidth: 2,
        borderRadius: 8
      }
    ]
  };

  // UBI calculation trend line
  const ubiTrendData = {
    labels: ['Base Amount', 'Economic Factors', 'Sentiment Adj.', 'Final Payout'],
    datasets: [
      {
        label: 'UBI Calculation Flow',
        data: [
          ubiCalculation.basePayout * 0.7,
          ubiCalculation.basePayout,
          ubiCalculation.basePayout + ((ubiCalculation.adjustedPayout - ubiCalculation.basePayout) * 0.5),
          ubiCalculation.adjustedPayout
        ],
        borderColor: '#00d4ff',
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#00d4ff',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8
      }
    ]
  };

  return (
    <Box>
      {/* Header with status */}
      <AnimatePresence>
        {isSimulation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Alert 
              severity="warning" 
              sx={{ 
                mb: 3,
                background: 'linear-gradient(135deg, rgba(255, 183, 77, 0.1) 0%, rgba(255, 183, 77, 0.05) 100%)',
                border: '1px solid rgba(255, 183, 77, 0.3)',
                borderRadius: '12px'
              }}
              action={
                <Button 
                  onClick={onResetSimulation}
                  size="small"
                  variant="outlined"
                  startIcon={<Refresh />}
                  sx={{ color: 'warning.main', borderColor: 'warning.main' }}
                >
                  Reset to Live Data
                </Button>
              }
            >
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Simulation Mode: {selectedScenario?.name}
                </Typography>
                <Typography variant="caption">
                  Showing projected UBI calculations based on {selectedScenario?.description?.toLowerCase()}
                </Typography>
              </Box>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Key Metrics */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Monthly UBI Payout"
            value={ubiCalculation.adjustedPayout}
            subtitle={`${isSimulation ? 'Simulated' : 'Live Calculation'}`}
            icon={<AttachMoney />}
            color="#00d4ff"
            prefix="$"
            trend={isSimulation ? 15.2 : undefined}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Program Cost"
            value={ubiCalculation.totalCost / 1000000}
            subtitle="Monthly (Millions)"
            icon={<Assessment />}
            color="#ff6b35"
            prefix="$"
            suffix="M"
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Unemployment Rate"
            value={economicData.unemployment}
            subtitle="Federal Reserve Data"
            icon={<ShowChart />}
            color={economicData.unemployment > 6 ? '#ff3d71' : '#00e676'}
            suffix="%"
            trend={economicData.unemployment > 6 ? 2.1 : -0.8}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Population Served"
            value={economicData.population / 1000000}
            subtitle="US Population"
            icon={<People />}
            color="#00e676"
            suffix="M"
          />
        </Grid>
      </Grid>

      {/* Professional Charts */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={6}>
          <ProfessionalChart title="Economic Indicators">
            <Box height={300}>
              <Bar data={economicChartData} options={chartOptions} />
            </Box>
          </ProfessionalChart>
        </Grid>

        <Grid item xs={12} lg={6}>
          <ProfessionalChart title="UBI Calculation Flow">
            <Box height={300}>
              <Line data={ubiTrendData} options={chartOptions} />
            </Box>
          </ProfessionalChart>
        </Grid>
      </Grid>

      {/* Real-time Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Card sx={{ background: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)', border: '1px solid rgba(0, 212, 255, 0.2)' }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Real-Time Data Status
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Last updated: {new Date(economicData.lastUpdated).toLocaleTimeString()}
                </Typography>
              </Box>
              
              <Box display="flex" alignItems="center" gap={2}>
                <Chip 
                  label="LIVE" 
                  size="small" 
                  sx={{ 
                    background: 'linear-gradient(135deg, #00e676 0%, #00b248 100%)',
                    color: '#000',
                    fontWeight: 'bold',
                    animation: 'pulse 2s infinite'
                  }} 
                />
                <Box sx={{ minWidth: 100 }}>
                  <LinearProgress 
                    variant="indeterminate" 
                    sx={{
                      backgroundColor: 'rgba(0, 212, 255, 0.2)',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#00d4ff'
                      }
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.7; }
          100% { opacity: 1; }
        }
      `}</style>
    </Box>
  );
};

export default EnhancedDashboard;