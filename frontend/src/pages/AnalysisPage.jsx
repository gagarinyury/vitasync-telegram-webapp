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
  Divider,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  Container,
  LinearProgress,
  Grow,
  Fade
} from '@mui/material';
import {
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Science as ScienceIcon,
  Info as InfoIcon,
  ArrowBack,
  Psychology,
  AutoFixHigh
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTelegram } from '../hooks/useTelegram';
import analysisService from '../services/analysisService';

const ResultCard = styled(Card)(({ theme, severity }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  overflow: 'hidden',
  border: `2px solid ${
    severity === 'success' ? theme.palette.success.main :
    severity === 'warning' ? theme.palette.warning.main :
    severity === 'error' ? theme.palette.error.main :
    theme.palette.info.main
  }`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const AnalysisHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #1e88e5 0%, #42a5f5 100%)',
  color: '#fff',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  textAlign: 'center'
}));

const ModelButton = styled(ToggleButton)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  borderRadius: theme.spacing(2),
  textTransform: 'none',
  '&.Mui-selected': {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    }
  }
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
  
  const supplements = location.state?.supplements || [];

  useEffect(() => {
    if (supplements.length === 0) {
      navigate('/');
      return;
    }
    loadLimits();
  }, [supplements, navigate]);

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
    } catch (error) {
      console.error('Failed to load limits:', error);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setError('');
    setProgress(0);
    
    try {
      const result = await analysisService.analyzeCompatibility(
        supplements.join(', '),
        modelType
      );
      
      setProgress(100);
      
      if (result.success) {
        setAnalysis(result.analysis);
        setLimitInfo(result.limitInfo);
        hapticFeedback('success');
      } else {
        setError(result.error);
        hapticFeedback('error');
      }
    } catch (error) {
      setError('Произошла ошибка при анализе. Попробуйте позже.');
      hapticFeedback('error');
    } finally {
      setLoading(false);
      setProgress(0);
    }
  };

  const formatAnalysis = (text) => {
    if (!text) return null;
    
    const sections = text.split(/(?=<b>)/).filter(Boolean);
    
    return sections.map((section, index) => {
      const lines = section.split('\n').filter(Boolean);
      const title = lines[0]?.replace(/<\/?b>/g, '');
      const content = lines.slice(1).join('\n');
      
      let icon = <InfoIcon />;
      let severity = 'info';
      
      if (title?.includes('Механизм')) {
        icon = <ScienceIcon />;
        severity = 'info';
      }
      if (title?.includes('Последствия')) {
        icon = <WarningIcon />;
        severity = 'warning';
      }
      if (title?.includes('избежать')) {
        icon = <CheckCircleIcon />;
        severity = 'success';
      }
      if (title?.includes('Заключение')) {
        icon = <ErrorIcon />;
        severity = 'error';
      }
      
      return (
        <Grow in={true} timeout={600 + index * 200} key={index}>
          <ResultCard severity={severity}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ 
                  p: 1, 
                  borderRadius: '50%', 
                  backgroundColor: `${
                    severity === 'success' ? 'success' :
                    severity === 'warning' ? 'warning' :
                    severity === 'error' ? 'error' :
                    'info'
                  }.light`,
                  color: `${severity}.main`,
                  mr: 2
                }}>
                  {icon}
                </Box>
                <Typography variant="h6" fontWeight={600}>
                  {title}
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>
                {content}
              </Typography>
            </CardContent>
          </ResultCard>
        </Grow>
      );
    });
  };

  return (
    <Container maxWidth="md" sx={{ pt: 2, pb: 8 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 2 }}
      >
        Назад
      </Button>

      <AnalysisHeader>
        <Psychology sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Анализ совместимости
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
          Проверка взаимодействия добавок с помощью AI
        </Typography>
      </AnalysisHeader>

      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={3}>
        <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
          Выбранные добавки:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {supplements.map((supplement, index) => (
            <Chip
              key={index}
              label={supplement}
              color="primary"
              sx={{ fontSize: '0.9rem' }}
            />
          ))}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
            Выберите режим анализа:
          </Typography>
          <ToggleButtonGroup
            fullWidth
            value={modelType}
            exclusive
            onChange={(e, value) => value && setModelType(value)}
            sx={{ mb: 2 }}
          >
            <ModelButton value="standard">
              <Box>
                <AutoFixHigh sx={{ mb: 0.5 }} />
                <Typography variant="body1" fontWeight={600}>
                  Стандартный
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Без ограничений
                </Typography>
              </Box>
            </ModelButton>
            <ModelButton value="premium">
              <Box>
                <Psychology sx={{ mb: 0.5 }} />
                <Typography variant="body1" fontWeight={600}>
                  Премиум AI
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {limitInfo?.premium?.remaining || 0} из 2 в день
                </Typography>
              </Box>
            </ModelButton>
          </ToggleButtonGroup>
          
          {modelType === 'premium' && limitInfo?.premium && (
            <Fade in={true}>
              <Alert severity="info" sx={{ borderRadius: 2 }}>
                {limitInfo.premium.message}
              </Alert>
            </Fade>
          )}
        </Box>

        {loading && (
          <Box sx={{ mb: 3 }}>
            <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: 3 }} />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
              Анализирую добавки... {progress}%
            </Typography>
          </Box>
        )}

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} /> : <ScienceIcon />}
          onClick={handleAnalyze}
          disabled={loading}
          sx={{ borderRadius: 3, py: 1.5 }}
        >
          {loading ? 'Анализирую...' : 'Начать анализ'}
        </Button>
      </Paper>

      {error && (
        <Fade in={true}>
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {error}
          </Alert>
        </Fade>
      )}

      {analysis && (
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            Результаты анализа
          </Typography>
          {formatAnalysis(analysis)}
          
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/')}
              sx={{ borderRadius: 3 }}
            >
              Новый анализ
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/schedule', { state: { supplements } })}
              sx={{ borderRadius: 3 }}
            >
              Создать график приема
            </Button>
          </Box>
        </Box>
      )}
    </Container>
  );
}

export default AnalysisPage;