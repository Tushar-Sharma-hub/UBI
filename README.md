# Dynamic Universal Basic Income Simulator

A real-time, AI-powered web application that calculates and visualizes Universal Basic Income (UBI) payouts based on dynamic economic conditions and sentiment analysis.

## 🎯 Project Overview

This application demonstrates how UBI programs could adapt to changing economic conditions using real-time data and machine learning algorithms. Government officials, policy makers, and researchers can simulate different economic scenarios to understand the impact of dynamic UBI policies.

## ✨ Key Features

- **Real-time Economic Data Integration**: Automatically updates economic indicators every 30 seconds
- **AI-Powered UBI Calculation**: Machine learning algorithm that calculates fair UBI payouts based on economic factors
- **Interactive Simulation Controls**: Adjust unemployment, inflation, cost of living, and other parameters
- **Scenario Library**: Pre-configured scenarios (Economic Crisis, Boom, Natural Disaster)
- **Dynamic Visualizations**: Real-time charts and graphs using Chart.js
- **Transparency & Explainability**: Shows how AI decisions are made
- **Export Functionality**: Generate reports in JSON and CSV formats

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd UBI
   npm run install-all
   ```

2. **Start the development servers**
   ```bash
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

### Alternative: One-Click Startup
```bash
./start.sh
```
This script will automatically install dependencies, start both servers, and provide helpful status information.

## 📊 User Stories

### Government Official
*"I want to simulate different economic situations so I can see how UBI payouts should change to help citizens."*

- Use scenario library to test crisis/boom conditions
- Adjust parameters in real-time
- Export reports for decision-making

### Policy Maker
*"I want to understand the impact of UBI on various groups."*

- View demographic breakdowns
- Analyze cost distributions
- Compare scenarios side-by-side

### Researcher/Student
*"I want to experiment with changing inputs and visualize economic outcomes for learning and presentations."*

- Interactive parameter controls
- Real-time visualizations
- Export data for further analysis

## 🏗 Technical Architecture

### Backend (Node.js/Express)
- **API Endpoints**:
  - `GET /api/economic-data` - Current economic indicators
  - `GET /api/ubi-calculation` - AI-calculated UBI recommendations
  - `POST /api/simulate` - Run custom simulations
  - `GET /api/scenarios` - Pre-configured scenarios
  - `GET /api/news-sentiment` - Sentiment analysis data

- **AI Calculation Engine**:
  - Considers unemployment rate, inflation, cost of living
  - Applies sentiment analysis adjustments
  - Calculates total program costs

### Frontend (React/Material-UI)
- **Components**:
  - Dashboard: Main visualization and metrics
  - SimulationControls: Interactive parameter adjustment
  - ScenarioLibrary: Preset scenario selection
  - TransparencyPanel: AI explanation and reporting

- **Visualizations**:
  - Economic indicators chart (Bar)
  - UBI calculation breakdown (Line)
  - Program impact distribution (Doughnut)
  - Real-time data status

## 📈 UBI Calculation Algorithm

The AI calculates UBI payouts using a weighted formula:

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

## 🎮 How to Demo the Application

### Live Demo Flow
1. **Start the application** using `./start.sh` or `npm run dev`
2. **Main Dashboard**: Shows real-time UBI calculation with live economic data
3. **Try Scenarios**: Click "Economic Crisis" in the Scenario Library to see how UBI adapts
4. **Manual Simulation**: Use sliders in Simulation Controls to adjust unemployment or inflation
5. **View Transparency**: Scroll down to see AI decision explanations and factor analysis
6. **Export Data**: Click "Export Report" to generate shareable reports

### Demo Talking Points
- **Real-time Adaptation**: Data updates every 30 seconds, UBI adjusts automatically
- **Crisis Response**: Crisis scenario shows UBI increasing from $2,279 to ~$4,200
- **AI Transparency**: Every decision is explained with clear factor breakdowns
- **Policy Impact**: Total program cost scales with population and economic conditions
- **Export Ready**: Generate reports for stakeholders and decision-makers

## 🎮 Demo Scenarios

### Economic Crisis
- Unemployment: 12.5%
- Inflation: 6.2%
- Cost of Living: 115
- News Sentiment: -60%

### Economic Boom  
- Unemployment: 3.2%
- Inflation: 2.1%
- Cost of Living: 95
- News Sentiment: +70%

### Natural Disaster
- Unemployment: 15.0%
- Inflation: 4.5%
- Cost of Living: 125
- News Sentiment: -80%

## 🔧 Development

### Project Structure
```
UBI/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main application
│   │   └── index.js       # Entry point
├── server/                 # Node.js backend
│   ├── index.js           # Express server
│   └── package.json       # Backend dependencies
├── package.json           # Root package.json
└── README.md
```

### Available Scripts
- `npm run dev` - Start both frontend and backend
- `npm run client` - Start only frontend
- `npm run server` - Start only backend
- `npm run build` - Build for production
- `npm run install-all` - Install all dependencies

### Key Dependencies
- **Backend**: Express, CORS, Node-Cron, ML-Regression, Sentiment
- **Frontend**: React, Material-UI, Chart.js, Axios

## 📊 API Reference

### Economic Data Endpoint
```
GET /api/economic-data
Response: {
  unemployment: 6.2,
  inflation: 3.1,
  costOfLiving: 100,
  population: 1000000,
  averageIncome: 45000,
  lastUpdated: "2023-10-16T..."
}
```

### UBI Calculation Endpoint
```
GET /api/ubi-calculation
Response: {
  basePayout: 450,
  adjustedPayout: 468,
  totalCost: 468000000,
  factors: {...},
  explanation: [...],
  lastUpdated: "2023-10-16T..."
}
```

## 🎯 Success Criteria

✅ **Real-time Data Integration**: App fetches and updates economic data automatically
✅ **Interactive Simulations**: Users can adjust parameters and see instant results  
✅ **Visual Dashboard**: Clean, responsive interface with dynamic charts
✅ **AI Transparency**: Clear explanations of how calculations are made
✅ **Scenario Testing**: Pre-configured scenarios demonstrate different conditions
✅ **Export Capabilities**: Generate reports for sharing and analysis

## 🚀 Future Enhancements

- Integration with real economic APIs (Bureau of Labor Statistics, Fed Economic Data)
- Machine learning model training on historical UBI pilot data
- Geographic mapping for regional UBI variations  
- Advanced sentiment analysis using natural language processing
- Multi-language support for international use
- Mobile-responsive design improvements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For questions or support, please open an issue on the GitHub repository.

---

**Built with ❤️ for better economic policy simulation**