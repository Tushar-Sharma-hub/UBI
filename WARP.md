# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Dynamic UBI (Universal Basic Income) Simulator - A real-time, AI-powered web application that calculates and visualizes UBI payouts based on dynamic economic conditions and sentiment analysis. The application demonstrates how UBI programs could adapt to changing economic conditions using real-time data and machine learning algorithms.

## Development Commands

### Quick Start
```bash
# One-click startup (recommended)
./start.sh

# Manual startup
npm run install-all    # Install all dependencies
npm run dev            # Start both frontend and backend concurrently
```

### Individual Services
```bash
npm run client         # Start React frontend only (port 3000)
npm run server         # Start Node.js backend only (port 5001)
npm run build          # Build React app for production
```

### Testing
```bash
# Frontend tests
cd client && npm test                    # Run React tests with Jest
cd client && npm test -- --coverage     # Run tests with coverage report
cd client && npm test -- --watchAll     # Run tests in watch mode

# No backend-specific test suite is configured
```

## Architecture Overview

### Full-Stack Structure
The application follows a **client-server architecture** with real-time data integration:

- **Frontend**: React SPA with Material-UI components and Chart.js visualizations
- **Backend**: Express.js REST API with real-time data fetching and UBI calculations
- **Data Sources**: Federal Reserve API (FRED), News API, Alpha Vantage for live economic data

### Key Architectural Patterns

#### Real-time Data Pipeline
- **DataService class** (`server/index.js`) handles all external API integrations
- **Cron jobs** update economic data every 5 minutes, news sentiment every 10 minutes
- **WebSocket-like updates** via polling every 30 seconds on frontend

#### UBI Calculation Engine
- **UBICalculator class** implements the core algorithm with weighted factors
- **Sentiment adjustment** modifies payouts based on news analysis
- **Simulation mode** allows parameter overrides without affecting live data

#### Component Architecture (React)
- **EnhancedDashboard**: Main metrics display with animated charts and CountUp effects
- **SimulationControls**: Interactive sliders for parameter adjustment
- **ScenarioLibrary**: Pre-configured economic scenarios (Crisis, Boom, Disaster)
- **TransparencyPanel**: AI decision explanations and export functionality
- **NewsPanel**: Real-time economic news with sentiment indicators

### Data Flow
1. External APIs → DataService → Global state variables
2. REST endpoints expose economic data and UBI calculations
3. Frontend polls for updates and manages simulation state
4. User interactions trigger simulations via POST /api/simulate

## Key Files and Components

### Backend (`server/`)
- `index.js`: Main server with API routes, data services, and UBI calculation engine
  - Contains API keys for FRED, News API, Alpha Vantage
  - Implements cron-based data fetching
  - UBI algorithm with unemployment, inflation, and sentiment factors

### Frontend (`client/src/`)
- `App.js`: Main application with theme configuration and data management
- `components/EnhancedDashboard.js`: Primary dashboard with animated metrics cards
- `components/SimulationControls.js`: Parameter adjustment interface
- `components/ScenarioLibrary.js`: Pre-configured scenario selection
- `components/TransparencyPanel.js`: AI explanations and reporting

### Configuration
- Root `package.json`: Uses concurrently for dev server orchestration
- `start.sh`: Comprehensive startup script with port cleanup and health checks
- No environment variables or config files - API keys are hardcoded in server

## API Endpoints

### Core Data Endpoints
```bash
GET  /api/economic-data      # Current economic indicators
GET  /api/ubi-calculation    # AI-calculated UBI recommendations  
GET  /api/news-sentiment     # Sentiment analysis data
GET  /api/scenarios          # Pre-configured scenarios
POST /api/simulate           # Run custom parameter simulation
POST /api/refresh-data       # Manual data refresh trigger
```

### UBI Calculation Formula
```javascript
// Base calculation factors
unemploymentFactor = max(0.5, unemployment / 10)
inflationFactor = max(0.8, inflation / 5)  
costOfLivingFactor = costOfLiving / 100

// Base payout calculation
basePayout = (averageIncome * 0.1) * unemploymentFactor * inflationFactor * costOfLivingFactor

// Sentiment adjustment
sentimentMultiplier = 1 + (sentimentScore * 0.1)
finalPayout = basePayout * sentimentMultiplier
```

## Development Guidelines

### Working with Real-time Data
- Economic data updates every 5 minutes via cron jobs
- Frontend polls every 30 seconds for UI updates
- Use `/api/refresh-data` endpoint to manually trigger updates during development
- Simulation mode preserves live data while allowing parameter testing

### Component Development
- Follow Material-UI theming patterns established in `App.js`
- Use Framer Motion for animations (see EnhancedDashboard components)
- Implement loading states with Skeleton components
- CountUp animations for numeric displays

### API Integration
- All external API keys are hardcoded in `server/index.js` (FRED_API_KEY, NEWS_API_KEY, ALPHA_VANTAGE_API_KEY)
- DataService class handles error recovery for failed API calls
- Fallback to previous data when APIs are unavailable

### State Management
- No Redux - uses React hooks and local component state
- Economic data and UBI calculations managed in App.js
- Simulation state separate from live data to prevent conflicts

## External Dependencies

### Critical APIs
- **Federal Reserve Economic Data (FRED)**: Unemployment, inflation, GDP, income data
- **News API**: Economic news articles for sentiment analysis  
- **Alpha Vantage**: Stock market data (S&P 500)

### Major Libraries
- **Frontend**: React, Material-UI, Chart.js, Framer Motion, CountUp
- **Backend**: Express, Sentiment analysis, Node-Cron, Axios
- **Charts**: react-chartjs-2 with Chart.js backend

## Debugging and Troubleshooting

### Common Issues
- Port conflicts: `start.sh` automatically kills processes on ports 3000/5001
- API rate limits: FRED API has request limits, data cached with cron jobs
- CORS issues: Backend has CORS enabled for localhost development

### Development Server Status
- Backend health check: `curl http://localhost:5001/api/economic-data`
- Frontend: React dev server provides hot reload
- Both servers must be running for full functionality

### Data Validation
- Economic data includes `lastUpdated` timestamps for debugging
- UBI calculations include `explanation` arrays for transparency
- Console logs in DataService methods show API fetch status