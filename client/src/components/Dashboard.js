import React from 'react';
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
  Alert
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
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import { TrendingUp, TrendingDown, AttachMoney, People } from '@mui/icons-material';

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

const Dashboard = ({ 
  economicData, 
  ubiCalculation, 
  isSimulation, 
  selectedScenario,
  onResetSimulation 
}) => {
  if (!economicData || !ubiCalculation) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <Typography>Loading dashboard data...</Typography>
      </Box>
    );
  }

  const formatCurrency = (amount) => `$${amount.toLocaleString()}`;
  
  // Economic indicators chart data
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
        backgroundColor: ['#ff6b6b', '#4ecdc4', '#45b7d1'],
        borderColor: ['#ff5252', '#26a69a', '#2196f3'],
        borderWidth: 2
      }
    ]
  };

  // UBI payout breakdown
  const payoutChartData = {
    labels: ['Base Calculation', 'Sentiment Adjustment', 'Final Payout'],
    datasets: [
      {
        label: 'UBI Amount ($)',
        data: [
          ubiCalculation.basePayout,
          ubiCalculation.adjustedPayout - ubiCalculation.basePayout,
          ubiCalculation.adjustedPayout
        ],
        backgroundColor: ['#96c93f', '#ffa726', '#42a5f5'],
        borderColor: ['#8bc34a', '#ff9800', '#2196f3'],
        borderWidth: 2
      }
    ]
  };

  // Impact distribution pie chart
  const impactData = {
    labels: ['Direct Payments', 'Administrative Costs', 'Economic Multiplier'],
    datasets: [
      {
        data: [70, 15, 15],
        backgroundColor: ['#42a5f5', '#ff7043', '#66bb6a'],
        borderColor: ['#1976d2', '#d84315', '#388e3c'],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <Box>
      {/* Header with simulation status */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          UBI Dashboard
        </Typography>
        {isSimulation && (
          <Box display="flex" alignItems="center" gap={2}>
            <Alert severity="info">
              Simulating: {selectedScenario?.name}
            </Alert>
            <Button 
              variant="outlined" 
              onClick={onResetSimulation}
              size="small"
            >
              Reset to Live Data
            </Button>
          </Box>
        )}
      </Box>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <AttachMoney sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
              <Typography variant="h4" component="div" color="primary">
                {formatCurrency(ubiCalculation.adjustedPayout)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monthly UBI Payout
              </Typography>
              <Chip 
                label={`${isSimulation ? 'Simulated' : 'Live'}`}
                size="small"
                color={isSimulation ? 'warning' : 'success'}
                sx={{ mt: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <People sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
              <Typography variant="h4" component="div" color="secondary">
                {economicData.population.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Population
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Box display="flex" justifyContent="center" alignItems="center" mb={1}>
                {economicData.unemployment > 6 ? (
                  <TrendingUp sx={{ fontSize: 40, color: 'error.main' }} />
                ) : (
                  <TrendingDown sx={{ fontSize: 40, color: 'success.main' }} />
                )}
              </Box>
              <Typography variant="h4" component="div">
                {economicData.unemployment.toFixed(1)}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Unemployment Rate
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography variant="h4" component="div" color="success.main">
                {formatCurrency(ubiCalculation.totalCost)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Program Cost
              </Typography>
              <Typography variant="caption" display="block">
                Per Month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Economic Indicators
              </Typography>
              <Bar data={economicChartData} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                UBI Calculation Breakdown
              </Typography>
              <Line data={payoutChartData} options={chartOptions} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Program Impact Distribution
              </Typography>
              <Box sx={{ maxWidth: 300, margin: '0 auto' }}>
                <Doughnut data={impactData} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Real-Time Data Status
              </Typography>
              <Box>
                <Typography variant="body2" gutterBottom>
                  Last Updated: {new Date(economicData.lastUpdated).toLocaleTimeString()}
                </Typography>
                <Box mt={2}>
                  <Typography variant="body2">
                    <strong>Inflation:</strong> {economicData.inflation.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2">
                    <strong>Cost of Living Index:</strong> {economicData.costOfLiving.toFixed(0)}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Average Income:</strong> {formatCurrency(economicData.averageIncome)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;