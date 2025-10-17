require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
const axios = require('axios');
const Sentiment = require('sentiment');
const logger = require('./config/logger');
const { validate, simulationSchema, requestLogger, errorHandler, healthCheck } = require('./middleware/validation');

const app = express();
const PORT = process.env.PORT || 5001;
const sentiment = new Sentiment();

// API Keys with environment variable fallback
const FRED_API_KEY = process.env.FRED_API_KEY || 'e26ae0090bffd64bf880af4dfd3fd64b';
const NEWS_API_KEY = process.env.NEWS_API_KEY || 'f415d9bfde984661b543c1de809deeaa';
const ALPHA_VANTAGE_API_KEY = process.env.ALPHA_VANTAGE_API_KEY || 'VAXW46GMQF6Y2US8';

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the UBI API. For available endpoints, see /api/health or /api/economic-data.',
    availableEndpoints: [
      'GET /health',
      'GET /api/health',
      'GET /api/metrics',
      'GET /api/economic-data',
      'GET /api/news-sentiment',
      'GET /api/ubi-calculation',
      'GET /api/scenarios',
      'POST /api/simulate',
      'POST /api/refresh-data'
    ]
  });
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Allow for development - should be configured properly in production
}));

// Compression middleware
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // 15 minutes in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      endpoint: req.path
    });
    res.status(429).json({
      success: false,
      message: 'Too many requests from this IP, please try again later.',
      retryAfter: 15 * 60
    });
  }
});

app.use('/api/', limiter);

// CORS configuration (supports multiple allowed origins)
const allowedOriginsEnv = process.env.CORS_ORIGIN || 'http://localhost:3000,https://ubi-flow.netlify.app';
const allowedOrigins = allowedOriginsEnv
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(requestLogger);

// Trust proxy (important for rate limiting and IP detection)
app.set('trust proxy', 1);

// Real-time data storage with additional metadata
let economicData = {
  unemployment: 0,
  costOfLiving: 100,
  population: 333000000, // US population
  inflation: 0,
  averageIncome: 0,
  gdp: 0,
  sp500: 0,
  lastUpdated: new Date().toISOString(),
  dataFreshness: 'initializing',
  apiHealth: {
    fred: 'unknown',
    alphaVantage: 'unknown'
  }
};

let newsData = {
  sentiment: 0,
  articles: [],
  newsCount: 0,
  lastUpdated: new Date().toISOString(),
  dataFreshness: 'initializing',
  apiHealth: {
    newsApi: 'unknown'
  }
};

// Performance metrics
let performanceMetrics = {
  apiCalls: {
    fred: { total: 0, successful: 0, failed: 0 },
    newsApi: { total: 0, successful: 0, failed: 0 },
    alphaVantage: { total: 0, successful: 0, failed: 0 }
  },
  responseTime: {
    avg: 0,
    min: Number.MAX_VALUE,
    max: 0,
    last: 0
  },
  uptime: process.uptime(),
  startTime: new Date().toISOString()
};

// Enhanced data fetching services with comprehensive error handling
class DataService {
  static async fetchFREDData(seriesId, retries = 3) {
    const startTime = Date.now();
    performanceMetrics.apiCalls.fred.total++;
    
    try {
      logger.debug(`Fetching FRED data for series: ${seriesId}`);
      
      const response = await axios.get(
        `https://api.stlouisfed.org/fred/series/observations?series_id=${seriesId}&api_key=${FRED_API_KEY}&file_type=json&limit=1&sort_order=desc`,
        { 
          timeout: 10000,
          headers: {
            'User-Agent': 'UBI-Simulator/1.0.0'
          }
        }
      );
      
      const duration = Date.now() - startTime;
      this.updateResponseMetrics(duration);
      
      if (response.data.observations && response.data.observations.length > 0) {
        performanceMetrics.apiCalls.fred.successful++;
        economicData.apiHealth.fred = 'healthy';
        logger.debug(`FRED API success for ${seriesId}`, {
          value: response.data.observations[0].value,
          duration: `${duration}ms`
        });
        return response.data.observations[0]?.value;
      } else {
        throw new Error(`No data returned for series ${seriesId}`);
      }
    } catch (error) {
      performanceMetrics.apiCalls.fred.failed++;
      economicData.apiHealth.fred = 'error';
      
      logger.error(`FRED API error for ${seriesId}`, {
        error: error.message,
        duration: `${Date.now() - startTime}ms`,
        retries: retries
      });
      
      // Retry logic with exponential backoff
      if (retries > 0 && error.code !== 'ENOTFOUND') {
        const backoffTime = Math.pow(2, (3 - retries)) * 1000; // 1s, 2s, 4s
        logger.info(`Retrying FRED API call for ${seriesId} in ${backoffTime}ms`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return this.fetchFREDData(seriesId, retries - 1);
      }
      
      return null;
    }
  }

  // Update response time metrics
  static updateResponseMetrics(duration) {
    performanceMetrics.responseTime.last = duration;
    performanceMetrics.responseTime.min = Math.min(performanceMetrics.responseTime.min, duration);
    performanceMetrics.responseTime.max = Math.max(performanceMetrics.responseTime.max, duration);
    
    // Calculate rolling average
    const totalCalls = performanceMetrics.apiCalls.fred.total + 
                      performanceMetrics.apiCalls.newsApi.total + 
                      performanceMetrics.apiCalls.alphaVantage.total;
    performanceMetrics.responseTime.avg = 
      ((performanceMetrics.responseTime.avg * (totalCalls - 1)) + duration) / totalCalls;
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
      if (unemployment && !isNaN(parseFloat(unemployment))) {
        economicData.unemployment = parseFloat(unemployment);
      }
      
      // Fetch CPI for inflation calculation (CPIAUCSL)
      const cpi = await this.fetchFREDData('CPIAUCSL');
      if (cpi && !isNaN(parseFloat(cpi))) {
        // Better inflation calculation - this is CPI index, we'll use a more realistic conversion
        const cpiValue = parseFloat(cpi);
        economicData.inflation = Math.max(0, Math.min(15, (cpiValue - 300) / 10)); // More realistic inflation calc
        
        // Calculate cost of living index based on CPI (more realistic)
        economicData.costOfLiving = Math.max(80, Math.min(150, (cpiValue - 250) / 2));
      }
      
      // Fetch median household income (MEHOINUSA646N)
      const income = await this.fetchFREDData('MEHOINUSA646N');
      if (income && !isNaN(parseFloat(income))) {
        economicData.averageIncome = parseFloat(income);
      } else {
        // Fallback to realistic average income if API fails
        economicData.averageIncome = economicData.averageIncome || 70000;
      }
      
      // Fetch GDP (GDP)
      const gdp = await this.fetchFREDData('GDP');
      if (gdp && !isNaN(parseFloat(gdp))) {
        economicData.gdp = parseFloat(gdp);
      }
      
      // Fetch S&P 500 from Alpha Vantage
      const sp500 = await this.fetchAlphaVantageData('SPY');
      if (sp500 && !isNaN(parseFloat(sp500))) {
        economicData.sp500 = parseFloat(sp500);
      }
      
      // Ensure we have minimum viable data for UBI calculations
      if (economicData.unemployment === 0) economicData.unemployment = 4.1; // Current US average
      if (economicData.inflation === 0) economicData.inflation = 3.2; // Current US inflation
      if (economicData.averageIncome === 0) economicData.averageIncome = 70000; // US median
      if (economicData.costOfLiving < 80) economicData.costOfLiving = 100; // Base index
      
      economicData.lastUpdated = new Date().toISOString();
      console.log('Economic data updated:', {
        unemployment: economicData.unemployment.toFixed(1) + '%',
        inflation: economicData.inflation.toFixed(1) + '%',
        avgIncome: '$' + economicData.averageIncome.toLocaleString(),
        costOfLiving: economicData.costOfLiving,
        gdp: economicData.gdp ? '$' + economicData.gdp.toLocaleString() + 'B' : 'N/A',
        sp500: economicData.sp500 ? '$' + economicData.sp500.toFixed(2) : 'N/A'
      });
      
    } catch (error) {
      console.error('Error updating economic data:', error);
      // Ensure we have fallback data for demo
      if (economicData.unemployment === 0) {
        economicData.unemployment = 4.1;
        economicData.inflation = 3.2;
        economicData.averageIncome = 70000;
        economicData.costOfLiving = 100;
        economicData.lastUpdated = new Date().toISOString();
        console.log('Using fallback economic data for demo');
      }
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

// Health check endpoint
app.get('/health', healthCheck);
app.get('/api/health', healthCheck);

// Metrics endpoint for monitoring
app.get('/api/metrics', (req, res) => {
  const metrics = {
    ...performanceMetrics,
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString()
  };
  
  logger.info('Metrics requested', { ip: req.ip });
  res.json({
    success: true,
    data: metrics,
    timestamp: new Date().toISOString()
  });
});

// Enhanced API Routes with professional response format
app.get('/api/economic-data', (req, res) => {
  try {
    logger.debug('Economic data requested', { ip: req.ip });
    
    const response = {
      success: true,
      data: {
        ...economicData,
        dataAge: Date.now() - new Date(economicData.lastUpdated).getTime(),
        reliability: economicData.apiHealth.fred === 'healthy' ? 'high' : 'medium'
      },
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        cached: false
      }
    };
    
    res.json(response);
  } catch (error) {
    logger.error('Error serving economic data', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve economic data',
      timestamp: new Date().toISOString()
    });
  }
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

app.post('/api/simulate', validate(simulationSchema), (req, res) => {
  try {
    logger.info('Simulation requested', { 
      parameters: req.body,
      ip: req.ip 
    });
    
    const simulationData = { ...economicData, ...req.body };
    
    const basePayout = UBICalculator.calculateBasePayout(simulationData);
    const adjustedPayout = UBICalculator.adjustForSentiment(basePayout, newsData.sentiment);
    const totalCost = UBICalculator.calculateTotalCost(adjustedPayout, simulationData.population);
    
    const result = {
      basePayout,
      adjustedPayout,
      totalCost,
      factors: {
        ...simulationData,
        sentiment: newsData.sentiment
      },
      explanation: [
        `Base UBI calculation: $${basePayout} (based on ${simulationData.unemployment}% unemployment, ${simulationData.inflation}% inflation, cost of living index ${simulationData.costOfLiving})`,
        `Sentiment adjustment: ${newsData.sentiment > 0 ? 'increases' : newsData.sentiment < 0 ? 'decreases' : 'no change to'} payout by ${Math.abs(newsData.sentiment * 10).toFixed(1)}%`,
        `Final monthly payout: $${adjustedPayout} per person`,
        `Total program cost: $${totalCost.toLocaleString()} for ${simulationData.population.toLocaleString()} residents`
      ],
      confidence: economicData.apiHealth.fred === 'healthy' ? 95 : 75,
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        simulationType: 'custom'
      }
    });
  } catch (error) {
    logger.error('Simulation calculation error', {
      error: error.message,
      parameters: req.body,
      ip: req.ip
    });
    
    res.status(500).json({
      success: false,
      message: 'Failed to process simulation',
      timestamp: new Date().toISOString()
    });
  }
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

// 404 handler for undefined routes
app.use('*', (req, res) => {
  logger.warn('404 - Route not found', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip
  });
  
  res.status(404).json({
    success: false,
    message: 'Route not found',
    availableEndpoints: [
      'GET /health',
      'GET /api/health',
      'GET /api/metrics',
      'GET /api/economic-data',
      'GET /api/news-sentiment',
      'GET /api/ubi-calculation',
      'GET /api/scenarios',
      'POST /api/simulate',
      'POST /api/refresh-data'
    ],
    timestamp: new Date().toISOString()
  });
});

// Global error handler (must be last middleware)
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception', {
    error: error.message,
    stack: error.stack
  });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection', {
    reason: reason,
    promise: promise
  });
  process.exit(1);
});

// Server startup with comprehensive logging
const server = app.listen(PORT, () => {
  logger.info('🚀 UBI Simulator Server Started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: `http://localhost:${PORT}/health`,
      api: `http://localhost:${PORT}/api`,
      metrics: `http://localhost:${PORT}/api/metrics`
    }
  });
  
  // Performance monitoring
  setInterval(() => {
    performanceMetrics.uptime = process.uptime();
    
    // Log performance metrics every 5 minutes
    if (performanceMetrics.uptime % 300 < 30) {
      logger.info('Performance metrics', {
        uptime: `${Math.floor(performanceMetrics.uptime / 60)} minutes`,
        memory: process.memoryUsage(),
        apiCalls: performanceMetrics.apiCalls,
        responseTime: performanceMetrics.responseTime
      });
    }
  }, 30000); // Check every 30 seconds
});

// Handle server errors
server.on('error', (error) => {
  logger.error('Server error', {
    error: error.message,
    code: error.code,
    port: PORT
  });
});
