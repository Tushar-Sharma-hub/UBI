const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dynamic UBI Simulator API',
      version: '1.0.0',
      description: `
        A comprehensive REST API for the Dynamic Universal Basic Income Simulator.
        
        ## Overview
        This API provides real-time economic data integration, UBI calculations, and simulation capabilities.
        Built for policy makers, researchers, and government officials to analyze and simulate dynamic UBI programs.
        
        ## Features
        - Real-time economic data from Federal Reserve, News API, and Alpha Vantage
        - AI-powered UBI calculations with sentiment analysis
        - Economic scenario simulation
        - Comprehensive logging and monitoring
        - Enterprise-level security and validation
        
        ## Data Sources
        - **Federal Reserve Economic Data (FRED)**: Unemployment, inflation, GDP, income data
        - **News API**: Economic news articles for sentiment analysis
        - **Alpha Vantage**: Stock market data (S&P 500)
        
        ## Authentication
        Currently using API keys for external services. Future versions will include JWT authentication.
        
        ## Rate Limiting
        - **Default**: 100 requests per 15 minutes per IP
        - **Configurable**: Via environment variables
        
        ## Response Format
        All responses follow a consistent format:
        \`\`\`json
        {
          "success": boolean,
          "data": object,
          "meta": {
            "timestamp": "ISO 8601 timestamp",
            "version": "API version"
          }
        }
        \`\`\`
      `,
      contact: {
        name: 'UBI Simulator Team',
        email: 'support@ubi-simulator.com',
        url: 'https://github.com/ubi-simulator'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5001',
        description: 'Development server'
      },
      {
        url: 'https://api.ubi-simulator.com',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Health',
        description: 'Server health and monitoring endpoints'
      },
      {
        name: 'Economic Data',
        description: 'Real-time economic indicators and data'
      },
      {
        name: 'UBI Calculations',
        description: 'UBI calculation engine and simulations'
      },
      {
        name: 'News & Sentiment',
        description: 'Economic news and sentiment analysis'
      },
      {
        name: 'Scenarios',
        description: 'Pre-configured economic scenarios'
      }
    ],
    components: {
      schemas: {
        EconomicData: {
          type: 'object',
          properties: {
            unemployment: {
              type: 'number',
              description: 'Current unemployment rate as percentage',
              example: 4.3,
              minimum: 0,
              maximum: 100
            },
            inflation: {
              type: 'number',
              description: 'Current inflation rate as percentage',
              example: 3.2,
              minimum: -10,
              maximum: 50
            },
            costOfLiving: {
              type: 'number',
              description: 'Cost of living index (100 = baseline)',
              example: 105,
              minimum: 50,
              maximum: 200
            },
            population: {
              type: 'integer',
              description: 'Total population count',
              example: 333000000,
              minimum: 1
            },
            averageIncome: {
              type: 'number',
              description: 'Average household income in USD',
              example: 70000,
              minimum: 0
            },
            gdp: {
              type: 'number',
              description: 'Gross Domestic Product in billions USD',
              example: 25000,
              minimum: 0
            },
            sp500: {
              type: 'number',
              description: 'S&P 500 index value',
              example: 4500,
              minimum: 0
            },
            lastUpdated: {
              type: 'string',
              format: 'date-time',
              description: 'Timestamp of last data update'
            },
            dataFreshness: {
              type: 'string',
              enum: ['fresh', 'stale', 'initializing'],
              description: 'Data freshness indicator'
            },
            apiHealth: {
              type: 'object',
              properties: {
                fred: {
                  type: 'string',
                  enum: ['healthy', 'error', 'unknown']
                },
                alphaVantage: {
                  type: 'string',
                  enum: ['healthy', 'error', 'unknown']
                }
              }
            }
          },
          required: ['unemployment', 'inflation', 'costOfLiving', 'population', 'averageIncome']
        },
        UBICalculation: {
          type: 'object',
          properties: {
            basePayout: {
              type: 'number',
              description: 'Base UBI payout before adjustments',
              example: 1200
            },
            adjustedPayout: {
              type: 'number',
              description: 'Final UBI payout after sentiment adjustment',
              example: 1250
            },
            totalCost: {
              type: 'number',
              description: 'Total program cost for entire population',
              example: 416250000000
            },
            factors: {
              type: 'object',
              description: 'Economic factors used in calculation'
            },
            explanation: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Human-readable explanation of calculation steps'
            },
            confidence: {
              type: 'integer',
              description: 'Confidence level in calculation (0-100)',
              example: 95,
              minimum: 0,
              maximum: 100
            },
            lastUpdated: {
              type: 'string',
              format: 'date-time'
            }
          },
          required: ['basePayout', 'adjustedPayout', 'totalCost', 'factors']
        },
        NewsData: {
          type: 'object',
          properties: {
            sentiment: {
              type: 'number',
              description: 'Overall sentiment score (-1 to 1)',
              example: 0.1,
              minimum: -1,
              maximum: 1
            },
            articles: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: { type: 'string' },
                  description: { type: 'string' },
                  sentiment: { type: 'number' },
                  publishedAt: { type: 'string', format: 'date-time' },
                  source: { type: 'string' }
                }
              }
            },
            newsCount: {
              type: 'integer',
              description: 'Total number of articles analyzed'
            },
            lastUpdated: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        SimulationRequest: {
          type: 'object',
          required: ['unemployment', 'inflation', 'costOfLiving'],
          properties: {
            unemployment: {
              type: 'number',
              description: 'Unemployment rate to simulate (0-100)',
              example: 6.5,
              minimum: 0,
              maximum: 100
            },
            inflation: {
              type: 'number',
              description: 'Inflation rate to simulate (-10 to 50)',
              example: 4.2,
              minimum: -10,
              maximum: 50
            },
            costOfLiving: {
              type: 'number',
              description: 'Cost of living index to simulate',
              example: 110,
              minimum: 0,
              maximum: 1000
            },
            population: {
              type: 'integer',
              description: 'Population size (optional, uses current data if not provided)',
              example: 50000000,
              minimum: 1,
              maximum: 10000000000
            },
            averageIncome: {
              type: 'number',
              description: 'Average income (optional, uses current data if not provided)',
              example: 75000,
              minimum: 0,
              maximum: 1000000
            }
          }
        },
        Scenario: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              description: 'Unique scenario identifier'
            },
            name: {
              type: 'string',
              description: 'Human-readable scenario name'
            },
            description: {
              type: 'string',
              description: 'Scenario description'
            },
            data: {
              $ref: '#/components/schemas/SimulationRequest'
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              description: 'Response data'
            },
            meta: {
              type: 'object',
              properties: {
                timestamp: {
                  type: 'string',
                  format: 'date-time'
                },
                version: {
                  type: 'string',
                  example: '1.0.0'
                }
              }
            }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                  value: { type: 'string' }
                }
              }
            },
            timestamp: {
              type: 'string',
              format: 'date-time'
            }
          }
        }
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        ServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse'
              }
            }
          }
        },
        RateLimit: {
          description: 'Rate limit exceeded',
          content: {
            'application/json': {
              schema: {
                allOf: [
                  { $ref: '#/components/schemas/ErrorResponse' },
                  {
                    type: 'object',
                    properties: {
                      retryAfter: {
                        type: 'integer',
                        description: 'Seconds to wait before retrying'
                      }
                    }
                  }
                ]
              }
            }
          }
        }
      }
    },
    paths: {}
  },
  apis: ['./index.js'], // Path to the API docs
};

const specs = swaggerJsdoc(options);
module.exports = specs;