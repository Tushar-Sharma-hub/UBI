const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const axios = require('axios');
const Sentiment = require('sentiment');

const app = express();
const PORT = process.env.PORT || 5001;
const sentiment = new Sentiment();

// API Keys
const FRED_API_KEY = 'e26ae0090bffd64bf880af4dfd3fd64b';
const NEWS_API_KEY = 'f415d9bfde984661b543c1de809deeaa';
const ALPHA_VANTAGE_API_KEY = 'VAXW46GMQF6Y2US8';

// Middleware
app.use(cors());
app.use(express.json());

// Real-time data storage
let economicData = {
  unemployment: 0,
  costOfLiving: 100,
  population: 333000000, // US population
  inflation: 0,
  averageIncome: 0,
  gdp: 0,
  sp500: 0,
  lastUpdated: new Date().toISOString()
};

let newsData = {
  sentiment: 0,
  articles: [],
  newsCount: 0,
  lastUpdated: new Date().toISOString()
};

// Real-time data fetching services
class DataService {
  static async fetchFREDData(seriesId) {
    try {
      const response = await axios.get(
        `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&limit=1&sort_order=desc`
      );
      return response.data.observations[0]?.value;
    } catch (error) {
      console.error(`FRED API error for ${seriesId}:`, error.message);
      return null;
    }
  }

  static async fetchAlphaVantageData(symbol) {
    try {
      const response = await axios.get(
        `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`
      );
      return response.data['Global Quote']?.['05. price'];
    } catch (error) {
      console.error(`Alpha Vantage API error for ${symbol}:`, error.message);
      return null;
    }
  }

  static async fetchEconomicNews() {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/everything?q=unemployment+OR+inflation+OR+economy+OR+"federal+reserve"&language=en&sortBy=publishedAt&pageSize=20&apiKey=${NEWS_API_KEY}`
      );
      return response.data.articles;
    } catch (error) {
      console.error('News API error:', error.message);
      return [];
    }
  }

  static async updateEconomicData() {
    console.log('Fetching real-time economic data...');
    
    try {
      // Fetch unemployment rate (UNRATE)
      const unemployment = await this.fetchFREDData('UNRATE');
      if (unemployment) economicData.unemployment = parseFloat(unemployment);
      
      // Fetch inflation rate (CPIAUCSL - Consumer Price Index)
      const cpi = await this.fetchFREDData('CPIAUCSL');
      if (cpi) {
        // Calculate year-over-year inflation (simplified)
        economicData.inflation = Math.max(0, parseFloat(cpi) * 0.01); // Simplified calculation
      }
      
      // Fetch median household income (MEHOINUSA646N)
      const income = await this.fetchFREDData('MEHOINUSA646N');
      if (income) economicData.averageIncome = parseFloat(income);
      
      // Fetch GDP (GDP)
      const gdp = await this.fetchFREDData('GDP');
      if (gdp) economicData.gdp = parseFloat(gdp);
      
      // Fetch S&P 500 from Alpha Vantage
      const sp500 = await this.fetchAlphaVantageData('SPY');
      if (sp500) economicData.sp500 = parseFloat(sp500);
      
      // Calculate cost of living index based on CPI
      if (cpi) {
        economicData.costOfLiving = Math.max(80, Math.min(150, parseFloat(cpi) * 0.04));
      }
      
      economicData.lastUpdated = new Date().toISOString();
      console.log('Economic data updated:', {
        unemployment: economicData.unemployment,
        inflation: economicData.inflation,
        gdp: economicData.gdp
      });
      
    } catch (error) {
      console.error('Error updating economic data:', error);
    }
  }

  static async updateNewsData() {
    console.log('Fetching economic news and sentiment...');
    
    try {
      const articles = await this.fetchEconomicNews();
      
      if (articles && articles.length > 0) {
        // Analyze sentiment of headlines and descriptions
        let totalSentiment = 0;
        const relevantArticles = [];
        
        articles.forEach(article => {
          if (article.title && article.description) {
            const titleSentiment = sentiment.analyze(article.title);
            const descSentiment = sentiment.analyze(article.description);
            const avgSentiment = (titleSentiment.score + descSentiment.score) / 2;
            
            totalSentiment += avgSentiment;
            relevantArticles.push({
              title: article.title,
              description: article.description,
              sentiment: avgSentiment,
              publishedAt: article.publishedAt,
              source: article.source.name
            });
          }
        });
        
        // Normalize sentiment to -1 to 1 scale
        newsData.sentiment = Math.max(-1, Math.min(1, totalSentiment / Math.max(articles.length, 1) / 10));
        newsData.articles = relevantArticles.slice(0, 5);
        newsData.newsCount = articles.length;
        newsData.lastUpdated = new Date().toISOString();
        
        console.log('News sentiment updated:', newsData.sentiment);
      }
    } catch (error) {
      console.error('Error updating news data:', error);
    }
  }
}

// UBI calculation engine
class UBICalculator {
  static calculateBasePayout(data) {
    const {
      unemployment,
      costOfLiving,
      inflation,
      averageIncome,
      population
    } = data;
    
    // Base UBI calculation using weighted factors
    const unemploymentFactor = Math.max(0.5, unemployment / 10);
    const inflationFactor = Math.max(0.8, inflation / 5);
    const costOfLivingFactor = costOfLiving / 100;
    
    // Base amount calculation
    const basePayout = (averageIncome * 0.1) * unemploymentFactor * inflationFactor * costOfLivingFactor;
    
    return Math.round(basePayout);
  }
  
  static adjustForSentiment(basePayout, sentimentScore) {
    // Adjust payout based on news sentiment (-1 to 1 scale)
    const sentimentMultiplier = 1 + (sentimentScore * 0.1);
    return Math.round(basePayout * sentimentMultiplier);
  }
  
  static calculateTotalCost(payout, population) {
    return payout * population;
  }
}

// API Routes
app.get('/api/economic-data', (req, res) => {
  res.json(economicData);
});

app.get('/api/news-sentiment', (req, res) => {
  res.json(newsData);
});

app.get('/api/ubi-calculation', (req, res) => {
  const basePayout = UBICalculator.calculateBasePayout(economicData);
  const adjustedPayout = UBICalculator.adjustForSentiment(basePayout, newsData.sentiment);
  const totalCost = UBICalculator.calculateTotalCost(adjustedPayout, economicData.population);
  
  const calculation = {
    basePayout,
    adjustedPayout,
    totalCost,
    factors: {
      unemployment: economicData.unemployment,
      costOfLiving: economicData.costOfLiving,
      inflation: economicData.inflation,
      sentiment: newsData.sentiment
    },
    explanation: [
      `Base calculation considers unemployment (${economicData.unemployment}%), inflation (${economicData.inflation}%), and cost of living (${economicData.costOfLiving})`,
      `Sentiment analysis of recent news (${newsData.sentiment > 0 ? 'positive' : 'negative'}) ${newsData.sentiment > 0 ? 'increases' : 'decreases'} payout by ${Math.abs(newsData.sentiment * 10)}%`,
      `Total program cost: $${totalCost.toLocaleString()} for ${economicData.population.toLocaleString()} residents`
    ],
    lastUpdated: new Date().toISOString()
  };
  
  res.json(calculation);
});

app.post('/api/simulate', (req, res) => {
  const simulationData = { ...economicData, ...req.body };
  
  const basePayout = UBICalculator.calculateBasePayout(simulationData);
  const adjustedPayout = UBICalculator.adjustForSentiment(basePayout, newsData.sentiment);
  const totalCost = UBICalculator.calculateTotalCost(adjustedPayout, simulationData.population);
  
  res.json({
    basePayout,
    adjustedPayout,
    totalCost,
    factors: simulationData,
    lastUpdated: new Date().toISOString()
  });
});

app.get('/api/scenarios', (req, res) => {
  const scenarios = [
    {
      id: 'crisis',
      name: 'Economic Crisis',
      description: 'High unemployment, rising inflation',
      data: {
        unemployment: 12.5,
        inflation: 6.2,
        costOfLiving: 115,
        sentiment: -0.6
      }
    },
    {
      id: 'boom',
      name: 'Economic Boom',
      description: 'Low unemployment, stable prices',
      data: {
        unemployment: 3.2,
        inflation: 2.1,
        costOfLiving: 95,
        sentiment: 0.7
      }
    },
    {
      id: 'disaster',
      name: 'Natural Disaster',
      description: 'Emergency response scenario',
      data: {
        unemployment: 15.0,
        inflation: 4.5,
        costOfLiving: 125,
        sentiment: -0.8
      }
    }
  ];
  
  res.json(scenarios);
});

// Initialize with real data on startup
DataService.updateEconomicData();
DataService.updateNewsData();

// Update economic data every 5 minutes (to respect API limits)
cron.schedule('*/5 * * * *', async () => {
  await DataService.updateEconomicData();
});

// Update news sentiment every 10 minutes
cron.schedule('*/10 * * * *', async () => {
  await DataService.updateNewsData();
});

// Add endpoint for manual data refresh
app.post('/api/refresh-data', async (req, res) => {
  try {
    await Promise.all([
      DataService.updateEconomicData(),
      DataService.updateNewsData()
    ]);
    res.json({ 
      success: true, 
      message: 'Data refreshed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to refresh data',
      error: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`UBI Simulator Server running on port ${PORT}`);
});