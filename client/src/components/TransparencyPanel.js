import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Button,
  Grid,
  Divider,
  LinearProgress,
  Chip,
  Alert
} from '@mui/material';
import {
  Download,
  Visibility,
  Psychology,
  Calculate,
  TrendingUp
} from '@mui/icons-material';

const TransparencyPanel = ({ calculation, economicData }) => {
  if (!calculation || !economicData) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Loading calculation details...</Typography>
      </Box>
    );
  }

  const exportReport = () => {
    const reportData = {
      timestamp: new Date().toISOString(),
      calculation,
      economicData,
      summary: {
        recommendedPayout: calculation.adjustedPayout,
        totalProgramCost: calculation.totalCost,
        populationServed: economicData.population,
        lastUpdated: calculation.lastUpdated
      }
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ubi-calculation-report-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const csvData = [
      ['Metric', 'Value'],
      ['Recommended UBI Payout', `$${calculation.adjustedPayout}`],
      ['Base Calculation', `$${calculation.basePayout}`],
      ['Total Program Cost', `$${calculation.totalCost}`],
      ['Population', economicData.population],
      ['Unemployment Rate', `${economicData.unemployment}%`],
      ['Inflation Rate', `${economicData.inflation}%`],
      ['Cost of Living Index', economicData.costOfLiving],
      ['Average Income', `$${economicData.averageIncome}`],
      ['Last Updated', calculation.lastUpdated]
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ubi-report-${new Date().getTime()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate factor influence scores
  const getFactorInfluence = () => {
    const factors = [
      {
        name: 'Unemployment Rate',
        value: calculation.factors.unemployment,
        impact: calculation.factors.unemployment > 6 ? 'High' : calculation.factors.unemployment > 4 ? 'Medium' : 'Low',
        score: Math.min(100, (calculation.factors.unemployment / 10) * 100)
      },
      {
        name: 'Inflation',
        value: calculation.factors.inflation,
        impact: calculation.factors.inflation > 4 ? 'High' : calculation.factors.inflation > 2 ? 'Medium' : 'Low',
        score: Math.min(100, (calculation.factors.inflation / 6) * 100)
      },
      {
        name: 'Cost of Living',
        value: calculation.factors.costOfLiving,
        impact: calculation.factors.costOfLiving > 110 ? 'High' : calculation.factors.costOfLiving > 95 ? 'Medium' : 'Low',
        score: Math.abs(calculation.factors.costOfLiving - 100)
      },
      {
        name: 'News Sentiment',
        value: calculation.factors.sentiment,
        impact: Math.abs(calculation.factors.sentiment) > 0.5 ? 'High' : Math.abs(calculation.factors.sentiment) > 0.2 ? 'Medium' : 'Low',
        score: Math.abs(calculation.factors.sentiment) * 100
      }
    ];
    return factors;
  };

  const factorInfluences = getFactorInfluence();

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'error';
      case 'Medium': return 'warning';
      case 'Low': return 'success';
      default: return 'info';
    }
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5">
          AI Decision Transparency
        </Typography>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<Download />}
            onClick={exportCSV}
            size="small"
          >
            Export CSV
          </Button>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={exportReport}
            size="small"
          >
            Export Report
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* AI Explanation */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Psychology sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">
                  AI Decision Process
                </Typography>
              </Box>
              
              <List dense>
                {calculation.explanation && calculation.explanation.map((step, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={step}
                      secondary={`Step ${index + 1}`}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Factor Analysis */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Calculate sx={{ mr: 1, color: 'secondary.main' }} />
                <Typography variant="h6">
                  Factor Impact Analysis
                </Typography>
              </Box>
              
              {factorInfluences.map((factor, index) => (
                <Box key={index} mb={2}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="body2">
                      {factor.name}
                    </Typography>
                    <Chip 
                      label={factor.impact} 
                      size="small" 
                      color={getImpactColor(factor.impact)}
                    />
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={factor.score}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 4,
                      },
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Current value: {
                      factor.name === 'News Sentiment' 
                        ? factor.value > 0 ? `+${(factor.value * 100).toFixed(0)}%` : `${(factor.value * 100).toFixed(0)}%`
                        : factor.name.includes('Rate') 
                        ? `${factor.value}%` 
                        : factor.value
                    }
                  </Typography>
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Calculation Breakdown */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <TrendingUp sx={{ mr: 1, color: 'success.main' }} />
                <Typography variant="h6">
                  Calculation Breakdown
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Base UBI Amount
                </Typography>
                <Typography variant="h4" color="primary">
                  ${calculation.basePayout}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">
                  Sentiment Adjustment
                </Typography>
                <Typography variant="h5" color={calculation.adjustedPayout > calculation.basePayout ? 'success.main' : 'error.main'}>
                  {calculation.adjustedPayout > calculation.basePayout ? '+' : ''}${calculation.adjustedPayout - calculation.basePayout}
                </Typography>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Final Recommended Amount
                </Typography>
                <Typography variant="h3" color="primary">
                  ${calculation.adjustedPayout}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Data Sources & Reliability */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" mb={2}>
                <Visibility sx={{ mr: 1, color: 'info.main' }} />
                <Typography variant="h6">
                  Data Sources & Reliability
                </Typography>
              </Box>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                This simulation uses mock data for demonstration. In production, 
                this would connect to real economic APIs.
              </Alert>
              
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="Economic Indicators"
                    secondary="Simulated real-time data with ±5% variance"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="News Sentiment Analysis"
                    secondary="Mock sentiment scores (-1 to +1 scale)"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Population Data"
                    secondary="Static demographic information"
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Last Update"
                    secondary={new Date(calculation.lastUpdated).toLocaleString()}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TransparencyPanel;