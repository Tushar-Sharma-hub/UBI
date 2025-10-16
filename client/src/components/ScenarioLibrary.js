import React from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  Chip,
  Divider
} from '@mui/material';
import {
  TrendingDown,
  TrendingUp,
  Warning,
  CheckCircle
} from '@mui/icons-material';

const ScenarioLibrary = ({ scenarios, selectedScenario, onScenarioSelect }) => {
  const getScenarioIcon = (scenarioId) => {
    switch (scenarioId) {
      case 'crisis':
        return <TrendingDown sx={{ color: 'error.main' }} />;
      case 'boom':
        return <TrendingUp sx={{ color: 'success.main' }} />;
      case 'disaster':
        return <Warning sx={{ color: 'warning.main' }} />;
      default:
        return <CheckCircle sx={{ color: 'info.main' }} />;
    }
  };

  const getScenarioColor = (scenarioId) => {
    switch (scenarioId) {
      case 'crisis':
        return 'error';
      case 'boom':
        return 'success';
      case 'disaster':
        return 'warning';
      default:
        return 'info';
    }
  };

  const formatParameter = (key, value) => {
    switch (key) {
      case 'unemployment':
      case 'inflation':
        return `${value}%`;
      case 'costOfLiving':
        return `${value}`;
      case 'sentiment':
        return value > 0 ? `+${(value * 100).toFixed(0)}%` : `${(value * 100).toFixed(0)}%`;
      default:
        return value;
    }
  };

  const getParameterLabel = (key) => {
    switch (key) {
      case 'unemployment':
        return 'Unemployment';
      case 'inflation':
        return 'Inflation';
      case 'costOfLiving':
        return 'Cost of Living';
      case 'sentiment':
        return 'News Sentiment';
      default:
        return key;
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>
        Scenario Library
      </Typography>
      
      <Typography variant="body2" color="text.secondary" mb={3}>
        Select a preset scenario to instantly see how UBI payouts would adapt to different economic conditions.
      </Typography>

      <Grid container spacing={2}>
        {scenarios.map((scenario) => (
          <Grid item xs={12} key={scenario.id}>
            <Card 
              variant={selectedScenario?.id === scenario.id ? "elevation" : "outlined"}
              sx={{
                border: selectedScenario?.id === scenario.id ? 2 : 1,
                borderColor: selectedScenario?.id === scenario.id ? 
                  `${getScenarioColor(scenario.id)}.main` : 'divider',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  boxShadow: 2
                }
              }}
            >
              <CardContent sx={{ pb: 1 }}>
                <Box display="flex" alignItems="center" mb={1}>
                  {getScenarioIcon(scenario.id)}
                  <Typography variant="h6" sx={{ ml: 1, flexGrow: 1 }}>
                    {scenario.name}
                  </Typography>
                  {selectedScenario?.id === scenario.id && (
                    <Chip 
                      label="Active" 
                      size="small" 
                      color={getScenarioColor(scenario.id)}
                    />
                  )}
                </Box>
                
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {scenario.description}
                </Typography>

                <Divider sx={{ mb: 2 }} />

                {/* Scenario Parameters */}
                <Grid container spacing={1}>
                  {Object.entries(scenario.data).map(([key, value]) => (
                    <Grid item xs={6} key={key}>
                      <Box 
                        sx={{ 
                          p: 1, 
                          bgcolor: 'background.paper', 
                          borderRadius: 1,
                          border: '1px solid',
                          borderColor: 'divider'
                        }}
                      >
                        <Typography variant="caption" color="text.secondary">
                          {getParameterLabel(key)}
                        </Typography>
                        <Typography variant="body2" fontWeight="medium">
                          {formatParameter(key, value)}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>

              <CardActions>
                <Button
                  fullWidth
                  variant={selectedScenario?.id === scenario.id ? "outlined" : "contained"}
                  color={getScenarioColor(scenario.id)}
                  onClick={() => onScenarioSelect(scenario)}
                  size="small"
                >
                  {selectedScenario?.id === scenario.id ? "Active Scenario" : "Apply Scenario"}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {scenarios.length === 0 && (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          p={4}
          sx={{ 
            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 1,
            bgcolor: 'background.paper'
          }}
        >
          <Typography color="text.secondary">
            Loading scenarios...
          </Typography>
        </Box>
      )}

      <Box mt={3}>
        <Typography variant="caption" color="text.secondary">
          💡 <strong>Pro tip:</strong> Try switching between scenarios to see how dynamic UBI 
          responds to different economic conditions. Each scenario simulates real-world 
          situations that might affect your community.
        </Typography>
      </Box>
    </Box>
  );
};

export default ScenarioLibrary;