import React, { useState, useEffect } from 'react';
import {
  Typography,
  Box,
  Slider,
  TextField,
  Button,
  FormControl,
  Chip,
  Divider,
  CircularProgress
} from '@mui/material';
import { PlayArrow, Refresh } from '@mui/icons-material';

const SimulationControls = ({ economicData, onSimulate, isSimulating }) => {
  const [simulationParams, setSimulationParams] = useState({
    unemployment: 6.2,
    inflation: 3.1,
    costOfLiving: 100,
    population: 1000000,
    averageIncome: 45000
  });
  const [isRunning, setIsRunning] = useState(false);

  // Update simulation params when economic data changes
  useEffect(() => {
    if (economicData) {
      setSimulationParams({
        unemployment: economicData.unemployment,
        inflation: economicData.inflation,
        costOfLiving: economicData.costOfLiving,
        population: economicData.population,
        averageIncome: economicData.averageIncome
      });
    }
  }, [economicData]);

  const handleSliderChange = (param) => (event, value) => {
    setSimulationParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const handleInputChange = (param) => (event) => {
    const value = parseFloat(event.target.value) || 0;
    setSimulationParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const handleSimulate = async () => {
    setIsRunning(true);
    try {
      await onSimulate(simulationParams);
    } finally {
      setIsRunning(false);
    }
  };

  const resetToCurrentData = () => {
    if (economicData) {
      setSimulationParams({
        unemployment: economicData.unemployment,
        inflation: economicData.inflation,
        costOfLiving: economicData.costOfLiving,
        population: economicData.population,
        averageIncome: economicData.averageIncome
      });
    }
  };

  if (!economicData) {
    return (
      <Box display="flex" justifyContent="center" p={3}>
        <Typography>Loading controls...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">
          Simulation Controls
        </Typography>
        {isSimulating && (
          <Chip label="Simulation Active" color="warning" size="small" />
        )}
      </Box>
      
      <Typography variant="body2" color="text.secondary" mb={3}>
        Adjust economic parameters to see how UBI payouts would change in different scenarios.
      </Typography>

      {/* Unemployment Rate */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2">
            Unemployment Rate
          </Typography>
          <TextField
            size="small"
            value={simulationParams.unemployment.toFixed(1)}
            onChange={handleInputChange('unemployment')}
            sx={{ width: 80 }}
            inputProps={{ 
              step: 0.1, 
              min: 0, 
              max: 30, 
              type: 'number',
              style: { fontSize: '0.875rem' }
            }}
          />
        </Box>
        <Slider
          value={simulationParams.unemployment}
          onChange={handleSliderChange('unemployment')}
          min={0}
          max={30}
          step={0.1}
          marks={[
            { value: 0, label: '0%' },
            { value: 5, label: '5%' },
            { value: 10, label: '10%' },
            { value: 20, label: '20%' },
            { value: 30, label: '30%' }
          ]}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value.toFixed(1)}%`}
        />
      </Box>

      {/* Inflation Rate */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2">
            Inflation Rate
          </Typography>
          <TextField
            size="small"
            value={simulationParams.inflation.toFixed(1)}
            onChange={handleInputChange('inflation')}
            sx={{ width: 80 }}
            inputProps={{ 
              step: 0.1, 
              min: -2, 
              max: 15, 
              type: 'number',
              style: { fontSize: '0.875rem' }
            }}
          />
        </Box>
        <Slider
          value={simulationParams.inflation}
          onChange={handleSliderChange('inflation')}
          min={-2}
          max={15}
          step={0.1}
          marks={[
            { value: -2, label: '-2%' },
            { value: 2, label: '2%' },
            { value: 5, label: '5%' },
            { value: 10, label: '10%' },
            { value: 15, label: '15%' }
          ]}
          valueLabelDisplay="auto"
          valueLabelFormat={(value) => `${value.toFixed(1)}%`}
        />
      </Box>

      {/* Cost of Living Index */}
      <Box mb={3}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle2">
            Cost of Living Index
          </Typography>
          <TextField
            size="small"
            value={simulationParams.costOfLiving.toFixed(0)}
            onChange={handleInputChange('costOfLiving')}
            sx={{ width: 80 }}
            inputProps={{ 
              step: 1, 
              min: 50, 
              max: 200, 
              type: 'number',
              style: { fontSize: '0.875rem' }
            }}
          />
        </Box>
        <Slider
          value={simulationParams.costOfLiving}
          onChange={handleSliderChange('costOfLiving')}
          min={50}
          max={200}
          step={1}
          marks={[
            { value: 50, label: '50' },
            { value: 100, label: '100' },
            { value: 150, label: '150' },
            { value: 200, label: '200' }
          ]}
          valueLabelDisplay="auto"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Advanced Controls */}
      <Typography variant="subtitle2" mb={2}>
        Advanced Parameters
      </Typography>

      {/* Population */}
      <FormControl fullWidth margin="dense">
        <TextField
          label="Population"
          type="number"
          value={simulationParams.population}
          onChange={handleInputChange('population')}
          inputProps={{ min: 100000, max: 10000000, step: 10000 }}
          helperText="Total population for UBI program"
        />
      </FormControl>

      {/* Average Income */}
      <FormControl fullWidth margin="dense">
        <TextField
          label="Average Income ($)"
          type="number"
          value={simulationParams.averageIncome}
          onChange={handleInputChange('averageIncome')}
          inputProps={{ min: 20000, max: 100000, step: 1000 }}
          helperText="Average annual household income"
        />
      </FormControl>

      {/* Action Buttons */}
      <Box display="flex" gap={2} mt={3} flexDirection={{ xs: 'column', sm: 'row' }}>
        <Button
          variant="contained"
          startIcon={isRunning ? <CircularProgress size={16} color="inherit" /> : <PlayArrow />}
          onClick={handleSimulate}
          disabled={isRunning}
          sx={{ 
            flex: 1,
            background: 'linear-gradient(135deg, #00d4ff 0%, #0099cc 100%)',
            '&:hover': {
              background: 'linear-gradient(135deg, #0099cc 0%, #007aa3 100%)',
            },
            '&:disabled': {
              background: 'rgba(0, 212, 255, 0.3)',
            }
          }}
        >
          {isRunning ? 'Running...' : 'Run Simulation'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={resetToCurrentData}
          disabled={isRunning}
          sx={{
            flex: 1,
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'text.primary',
            '&:hover': {
              borderColor: 'primary.main',
              background: 'rgba(0, 212, 255, 0.1)',
            }
          }}
        >
          Reset to Current
        </Button>
      </Box>

      <Typography variant="caption" display="block" mt={2} color="text.secondary">
        * Simulations show potential outcomes based on current AI model
      </Typography>
    </Box>
  );
};

export default SimulationControls;