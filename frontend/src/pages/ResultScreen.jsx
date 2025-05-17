import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Container,
  IconButton,
  AppBar,
  Toolbar,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Fade,
} from '@mui/material';
import {
  ArrowBack,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Schedule as ScheduleIcon,
  AddCircle as AddCircleIcon,
  NoteAdd as NoteAddIcon,
  LightMode as LightModeIcon,
  Nightlight as NightlightIcon,
  Restaurant as RestaurantIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

const slideInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const ResultCard = styled(Card)(({ theme, severity }) => ({
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  border: `1px solid`,
  borderColor: 
    severity === 'success' ? theme.palette.success.light :
    severity === 'warning' ? theme.palette.warning.light :
    severity === 'error' ? theme.palette.error.light :
    theme.palette.info.light,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
  animation: `${slideInUp} 0.5s ease-out`,
  '&:hover': {
    boxShadow: '0 6px 16px rgba(0, 0, 0, 0.08)',
  },
}));

const IconContainer = styled(Box)(({ theme, severity }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor:
    severity === 'success' ? theme.palette.success.light + '20' :
    severity === 'warning' ? theme.palette.warning.light + '20' :
    severity === 'error' ? theme.palette.error.light + '20' :
    theme.palette.info.light + '20',
  marginRight: theme.spacing(2),
}));

const BottomActions = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 60,
  left: 0,
  right: 0,
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
  boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.08)',
  borderTopLeftRadius: theme.spacing(3),
  borderTopRightRadius: theme.spacing(3),
}));

function ResultScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { analysis, supplements } = location.state || {};

  if (!analysis) {
    navigate('/');
    return null;
  }

  const getIcon = (severity) => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon color="success" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'error':
        return <ErrorIcon color="error" />;
      default:
        return <InfoIcon color="info" />;
    }
  };

  const getTimeIcon = (time) => {
    if (time.includes('утр') || time.includes('днем')) {
      return <LightModeIcon fontSize="small" color="primary" />;
    } else if (time.includes('вечер') || time.includes('ночь')) {
      return <NightlightIcon fontSize="small" color="primary" />;
    } else if (time.includes('ед')) {
      return <RestaurantIcon fontSize="small" color="primary" />;
    } else {
      return <ScheduleIcon fontSize="small" color="primary" />;
    }
  };

  const formatSection = (section) => {
    // Remove asterisks and clean up formatting
    const cleanTitle = section.title.replace(/\*/g, '');
    const cleanContent = section.content.map(item => item.replace(/\*/g, ''));
    
    // Determine severity based on title
    let severity = 'info';
    if (cleanTitle.toLowerCase().includes('совмест') || cleanTitle.toLowerCase().includes('безопас')) {
      severity = 'success';
    } else if (cleanTitle.toLowerCase().includes('предупрежд') || cleanTitle.toLowerCase().includes('внимание')) {
      severity = 'warning';
    } else if (cleanTitle.toLowerCase().includes('противопоказ') || cleanTitle.toLowerCase().includes('опасн')) {
      severity = 'error';
    }

    return { title: cleanTitle, content: cleanContent, severity };
  };

  const sections = analysis.split('\n\n').map(section => {
    const lines = section.split('\n');
    const title = lines[0];
    const content = lines.slice(1).filter(line => line.trim());
    return { title, content };
  }).filter(section => section.content.length > 0);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="static" color="transparent" elevation={0}>
        <Toolbar sx={{ px: 1 }}>
          <IconButton
            edge="start"
            onClick={() => navigate('/analysis', { state: { supplements } })}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Результаты анализа
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ pb: 16 }}>
        <Box sx={{ py: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Проанализированные добавки:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 3 }}>
            {supplements.map((supplement, index) => (
              <Chip
                key={index}
                label={supplement}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Box>
        </Box>

        {sections.map((section, index) => {
          const { title, content, severity } = formatSection(section);
          
          return (
            <Fade in={true} key={index} timeout={300 + index * 100}>
              <ResultCard severity={severity}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconContainer severity={severity}>
                      {getIcon(severity)}
                    </IconContainer>
                    <Typography variant="h6" sx={{ fontWeight: 600, flex: 1 }}>
                      {title}
                    </Typography>
                  </Box>
                  
                  <List dense>
                    {content.map((item, itemIndex) => (
                      <ListItem key={itemIndex} sx={{ px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          {item.includes('утр') || item.includes('вечер') || item.includes('ед') 
                            ? getTimeIcon(item)
                            : <InfoIcon fontSize="small" color="action" />
                          }
                        </ListItemIcon>
                        <ListItemText 
                          primary={item}
                          primaryTypographyProps={{
                            variant: 'body2',
                            sx: { lineHeight: 1.6 }
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </ResultCard>
            </Fade>
          );
        })}
      </Container>

      <BottomActions>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AddCircleIcon />}
            onClick={() => navigate('/', { replace: true })}
            sx={{ borderRadius: 2, py: 1.5 }}
          >
            Новый анализ
          </Button>
          <Button
            fullWidth
            variant="contained"
            startIcon={<ScheduleIcon />}
            onClick={() => navigate('/schedule', { state: { supplements } })}
            sx={{ 
              borderRadius: 2, 
              py: 1.5,
              background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)',
              color: 'white',
              '&:hover': {
                background: 'linear-gradient(135deg, #2563eb 0%, #059669 100%)',
              }
            }}
          >
            График приема
          </Button>
        </Box>
      </BottomActions>
    </Box>
  );
}

export default ResultScreen;