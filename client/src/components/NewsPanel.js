import React, { useState, useEffect, useCallback } from 'react';
import {
  Typography,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  Collapse,
  LinearProgress,
  Divider
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ExpandMore,
  ExpandLess,
  NewspaperOutlined,
  SentimentSatisfied,
  SentimentDissatisfied,
  SentimentNeutral
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import axios from 'axios';

const NewsPanel = ({ apiBase }) => {
  const [newsData, setNewsData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsData();
    const interval = setInterval(fetchNewsData, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, [fetchNewsData]);

  const fetchNewsData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiBase}/news-sentiment`);
      setNewsData(response.data);
    } catch (error) {
      console.error('Failed to fetch news data:', error);
    } finally {
      setLoading(false);
    }
  }, [apiBase]);

  const getSentimentColor = (sentiment) => {
    if (sentiment > 0.2) return '#00e676';
    if (sentiment < -0.2) return '#ff3d71';
    return '#ffb74d';
  };

  const getSentimentIcon = (sentiment) => {
    if (sentiment > 0.2) return <SentimentSatisfied />;
    if (sentiment < -0.2) return <SentimentDissatisfied />;
    return <SentimentNeutral />;
  };

  const getSentimentLabel = (sentiment) => {
    if (sentiment > 0.5) return 'Very Positive';
    if (sentiment > 0.2) return 'Positive';
    if (sentiment > -0.2) return 'Neutral';
    if (sentiment > -0.5) return 'Negative';
    return 'Very Negative';
  };

  if (loading) {
    return (
      <Card sx={{ background: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <CardContent sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={2}>
            <NewspaperOutlined sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Economic News Sentiment</Typography>
          </Box>
          <LinearProgress sx={{ mb: 2 }} />
          <Typography variant="body2" color="text.secondary">
            Analyzing latest economic news...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  if (!newsData) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card sx={{ 
        background: 'linear-gradient(135deg, #1a1d29 0%, #232740 100%)', 
        border: '1px solid rgba(255, 255, 255, 0.1)' 
      }}>
        <CardContent sx={{ p: 3 }}>
          {/* Header */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
            <Box display="flex" alignItems="center">
              <NewspaperOutlined sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Economic News Sentiment
              </Typography>
            </Box>
            <IconButton 
              onClick={() => setExpanded(!expanded)}
              size="small"
            >
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>

          {/* Sentiment Overview */}
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Box display="flex" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  borderRadius: '12px',
                  background: `linear-gradient(135deg, ${getSentimentColor(newsData.sentiment)}20 0%, ${getSentimentColor(newsData.sentiment)}10 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `1px solid ${getSentimentColor(newsData.sentiment)}30`
                }}
              >
                {React.cloneElement(getSentimentIcon(newsData.sentiment), { 
                  sx: { color: getSentimentColor(newsData.sentiment), fontSize: 24 } 
                })}
              </Box>
              
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, color: getSentimentColor(newsData.sentiment) }}>
                  {getSentimentLabel(newsData.sentiment)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Sentiment Score: {newsData.sentiment?.toFixed(3)}
                </Typography>
              </Box>
            </Box>

            <Box textAlign="right">
              <Chip 
                label={`${newsData.newsCount} Articles`}
                size="small"
                sx={{ mb: 1 }}
              />
              <Typography variant="caption" display="block" color="text.secondary">
                Last updated: {new Date(newsData.lastUpdated).toLocaleTimeString()}
              </Typography>
            </Box>
          </Box>

          {/* Sentiment Impact */}
          <Box mb={3}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Impact on UBI Calculation
            </Typography>
            <LinearProgress
              variant="determinate"
              value={Math.abs(newsData.sentiment) * 100}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getSentimentColor(newsData.sentiment),
                  borderRadius: 4,
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
              {newsData.sentiment > 0 ? 'Increases' : newsData.sentiment < 0 ? 'Decreases' : 'No change in'} UBI payout by {Math.abs(newsData.sentiment * 10).toFixed(1)}%
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* News Articles */}
          <Collapse in={expanded}>
            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Recent Economic Headlines
            </Typography>
            
            <List dense>
              {newsData.articles?.slice(0, 5).map((article, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ListItem 
                    sx={{ 
                      px: 0, 
                      py: 1,
                      borderLeft: `3px solid ${getSentimentColor(article.sentiment)}`,
                      paddingLeft: 2,
                      mb: 1,
                      backgroundColor: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '0 8px 8px 0'
                    }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {article.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="text.secondary">
                            {article.source} • {new Date(article.publishedAt).toLocaleDateString()}
                          </Typography>
                          <Box display="flex" alignItems="center" gap={1} mt={0.5}>
                            <Chip
                              label={`${article.sentiment > 0 ? '+' : ''}${article.sentiment?.toFixed(2)}`}
                              size="small"
                              sx={{
                                backgroundColor: `${getSentimentColor(article.sentiment)}20`,
                                color: getSentimentColor(article.sentiment),
                                fontSize: '0.7rem',
                                height: 20
                              }}
                            />
                            {article.sentiment > 0 ? (
                              <TrendingUp sx={{ fontSize: 14, color: getSentimentColor(article.sentiment) }} />
                            ) : (
                              <TrendingDown sx={{ fontSize: 14, color: getSentimentColor(article.sentiment) }} />
                            )}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                </motion.div>
              ))}
            </List>
          </Collapse>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default NewsPanel;