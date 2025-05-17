import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Button,
  Chip,
  Card,
  Container,
  LinearProgress,
  Fade,
  IconButton,
  AppBar,
  Toolbar,
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Science as ScienceIcon,
  ArrowBack,
  AutoFixHigh,
  Star as StarsIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useTelegram } from '../hooks/useTelegram';
import analysisService from '../services/analysisService';

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const CompactHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(2),
  animation: `${slideInUp} 0.5s ease-out`,
}));

const ModelCard = styled(Card)(({ theme, isSelected }) => ({
  position: 'relative',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  border: `2px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
  backgroundColor: isSelected ? theme.palette.primary.light + '10' : theme.palette.background.paper,
  '&:hover': {
    transform: 'scale(1.02)',
    boxShadow: theme.shadows[4],
  },
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const SupplementsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexWrap: 'nowrap',
  gap: theme.spacing(1),
  overflowX: 'auto',
  paddingBottom: theme.spacing(1),
  '&::-webkit-scrollbar': {
    height: 4,
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: theme.palette.grey[200],
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: theme.palette.grey[400],
    borderRadius: 2,
  },
}));

const ResultSection = styled(Box)(({ theme }) => ({
  animation: `${slideInUp} 0.6s ease-out`,
  animationFillMode: 'both',
}));

function AnalysisPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { hapticFeedback, showAlert } = useTelegram();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [error, setError] = useState('');
  const [modelType, setModelType] = useState('standard');
  const [limitInfo, setLimitInfo] = useState(null);
  const [progress, setProgress] = useState(0);
  
  // Получаем supplements из localStorage как основной способ
  const [supplements, setSupplements] = useState([]);
  
  useEffect(() => {
    const stored = localStorage.getItem('pending-analysis');
    if (stored) {
      const parsedSupplements = JSON.parse(stored);
      setSupplements(parsedSupplements);
      localStorage.removeItem('pending-analysis');
    }
  }, []);

  useEffect(() => {
    console.log('AnalysisPage - supplements:', supplements);
    
    if (supplements.length === 0) {
      console.log('No supplements found, waiting for data');
      return;
    }
    loadLimits();
  }, [supplements]);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setInterval(() => {
        setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
      }, 300);
    }
    return () => clearInterval(timer);
  }, [loading]);

  const loadLimits = async () => {
    try {
      const limits = await analysisService.getLimits();
      setLimitInfo(limits);
    } catch (err) {
      console.error('Error loading limits:', err);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setProgress(0);
    hapticFeedback('medium');

    try {
      const result = await analysisService.analyzeCompatibility(supplements, modelType);
      if (result.success) {
        setAnalysis(result.analysis);
        setProgress(100);
        hapticFeedback('success');
        
        if (modelType === 'premium' && result.limitInfo) {
          setLimitInfo(result.limitInfo);
        }
      } else {
        setError(result.error || 'Ошибка при анализе');
        hapticFeedback('error');
      }
    } catch (err) {
      setError(err.message || 'Ошибка при анализе добавок');
      hapticFeedback('error');
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (severity) => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'error':
        return <ErrorIcon />;
      default:
        return <ScienceIcon />;
    }
  };

  // Remove navigation to results page

  // Показываем загрузку если нет добавок
  if (supplements.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ px: 1 }}>
          <IconButton
            edge="start"
            onClick={() => navigate('/')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Анализ добавок
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pb: 8 }}>
        <CompactHeader>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Выбранные добавки
          </Typography>
          <SupplementsContainer>
            {supplements.map((supplement, index) => (
              <Chip
                key={index}
                label={supplement}
                color="primary"
                size="small"
                sx={{ whiteSpace: 'nowrap' }}
              />
            ))}
          </SupplementsContainer>
        </CompactHeader>

        <Paper sx={{ p: 2, borderRadius: 2, mb: 2 }} elevation={0}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5 }}>
            Режим анализа
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Box sx={{ flex: 1 }}>
              <ModelCard
                isSelected={modelType === 'standard'}
                onClick={() => setModelType('standard')}
              >
                <AutoFixHigh sx={{ fontSize: 32, color: modelType === 'standard' ? 'primary.main' : 'text.secondary', mb: 1 }} />
                <Typography variant="body1" fontWeight={600}>
                  Стандартный
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Без ограничений
                </Typography>
              </ModelCard>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <ModelCard
                isSelected={modelType === 'premium'}
                onClick={() => setModelType('premium')}
              >
                <StarsIcon sx={{ fontSize: 32, color: modelType === 'premium' ? 'primary.main' : 'text.secondary', mb: 1 }} />
                <Typography variant="body1" fontWeight={600}>
                  Премиум AI
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {limitInfo?.premium?.remaining || 0}/2 в день
                </Typography>
              </ModelCard>
            </Box>
          </Box>

          {modelType === 'premium' && limitInfo?.premium && (
            <Fade in={true}>
              <Alert 
                severity="info" 
                sx={{ 
                  borderRadius: 2, 
                  mb: 2,
                  '& .MuiAlert-message': { fontSize: '0.875rem' }
                }}
              >
                {limitInfo.premium.message}
              </Alert>
            </Fade>
          )}

          {loading && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress 
                variant="determinate" 
                value={progress} 
                sx={{ height: 4, borderRadius: 2 }} 
              />
              <Typography 
                variant="caption" 
                color="text.secondary" 
                sx={{ display: 'block', textAlign: 'center', mt: 1 }}
              >
                Анализирую... {progress}%
              </Typography>
            </Box>
          )}

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ScienceIcon />}
            onClick={handleAnalyze}
            disabled={loading}
            sx={{ 
              borderRadius: 2, 
              py: 1.5,
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
              color: 'white',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
              }
            }}
          >
            {loading ? 'Анализирую...' : 'Начать анализ'}
          </Button>
        </Paper>

        {error && (
          <Fade in={true}>
            <Alert 
              severity="error" 
              sx={{ 
                borderRadius: 2,
                '& .MuiAlert-message': { fontSize: '0.875rem' }
              }}
            >
              {error}
            </Alert>
          </Fade>
        )}
        
        {analysis && (
          <Fade in={true}>
            <ResultSection sx={{ mt: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Результаты анализа
              </Typography>
              
              {analysis.split('\n\n').map((section, index) => {
                const lines = section.split('\n');
                const title = lines[0];
                const content = lines.slice(1).join('\n');
                
                let severity = 'info';
                if (title.includes('Взаимодействие') || title.includes('Механизм')) {
                  severity = 'warning';
                } else if (title.includes('Рекомендации')) {
                  severity = 'success';
                } else if (title.includes('Заключение')) {
                  severity = 'primary';
                }
                
                return (
                  <Card key={index} sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      {getIcon(severity)}
                      <Typography variant="subtitle1" sx={{ ml: 1, fontWeight: 600 }}>
                        {title.replace(/\*\*/g, '')}
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      {content.replace(/\*\*/g, '')}
                    </Typography>
                  </Card>
                );
              })}
            </ResultSection>
          </Fade>
        )}
      </Container>
    </Box>
  );
}

export default AnalysisPage;