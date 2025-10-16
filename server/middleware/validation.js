const Joi = require('joi');
const logger = require('../config/logger');

// Validation schemas
const simulationSchema = Joi.object({
  unemployment: Joi.number().min(0).max(100).required(),
  inflation: Joi.number().min(-10).max(50).required(),
  costOfLiving: Joi.number().min(0).max(1000).required(),
  population: Joi.number().min(1).max(10000000000).optional(),
  averageIncome: Joi.number().min(0).max(1000000).optional()
});

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errorMessage = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      logger.warn('Validation failed', {
        endpoint: req.path,
        method: req.method,
        errors: errorMessage,
        body: req.body,
        ip: req.ip
      });

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errorMessage,
        timestamp: new Date().toISOString()
      });
    }

    // Replace request body with validated/sanitized data
    req.body = value;
    next();
  };
};

// Request logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      contentLength: res.get('Content-Length') || '0'
    };

    if (res.statusCode >= 400) {
      logger.error('HTTP Error', logData);
    } else if (res.statusCode >= 300) {
      logger.warn('HTTP Redirect', logData);
    } else {
      logger.http('HTTP Request', logData);
    }
  });

  next();
};

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    ip: req.ip
  });

  // Don't leak error details in production
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(err.status || 500).json({
    success: false,
    message: isDevelopment ? err.message : 'Internal server error',
    ...(isDevelopment && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
};

// Health check endpoint
const healthCheck = (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.version,
    environment: process.env.NODE_ENV || 'development'
  };

  logger.info('Health check requested', { ip: req.ip });
  res.json(healthData);
};

module.exports = {
  validate,
  simulationSchema,
  requestLogger,
  errorHandler,
  healthCheck
};