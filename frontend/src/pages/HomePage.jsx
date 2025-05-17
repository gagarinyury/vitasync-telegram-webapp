import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Chip,
  Alert,
  Container,
  IconButton,
  Fade,
  Collapse,
} from '@mui/material';
import {
  Add as AddIcon,
  Science as ScienceIcon,
  HealthAndSafety,
  Clear as ClearIcon,
  Dashboard as DashboardIcon,
  Remove as RemoveIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useTelegram } from '../hooks/useTelegram';
import { useAuthStore } from '../store/authStore';
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

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const CompactHeader = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  animation: `${fadeIn} 0.5s ease-out`,
}));

const GradientPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: 'white',
  position: 'relative',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
  boxShadow: '0 12px 32px rgba(0, 0, 0, 0.15)',
  border: '2px solid rgba(59, 130, 246, 0.2)',
  animation: `${slideInUp} 0.6s ease-out`,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: 'linear-gradient(135deg, #60a5fa 0%, #34d399 100%)',
    zIndex: -1,
    borderRadius: theme.spacing(2),
    opacity: 0.1,
  },
  '& .MuiTypography-root': {
    color: '#1f2937',
    fontWeight: 600,
  },
}));

const SupplementField = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  animation: `${slideInUp} 0.5s ease-out`,
  animationDelay: '0.1s',
  animationFillMode: 'both',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  fontWeight: 700,
  transition: 'all 0.2s ease',
  textTransform: 'none',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
  },
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
}));

const AddFieldButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.light,
  color: 'white',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    transform: 'scale(1.1)',
  },
  transition: 'all 0.2s ease',
}));

const SupplementChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  },
}));

const QuickSelectButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 3),
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
  fontWeight: 700,
  fontSize: '1rem',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  backgroundColor: 'white',
  color: theme.palette.secondary.main,
  border: `2px solid ${theme.palette.secondary.main}`,
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)',
  },
}));

function HomePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hapticFeedback } = useTelegram();
  const { user } = useAuthStore();
  const [supplements, setSupplements] = useState([]);
  const [fields, setFields] = useState(['', '']);
  const [error, setError] = useState('');

  useEffect(() => {
    // Handle state from QuickSelectScreen
    if (location.state?.supplements) {
      const selectedSupplements = location.state.supplements;
      
      // Reset fields and supplements
      setSupplements([]);
      setError('');
      
      // Create fields array based on selected supplements
      if (selectedSupplements.length === 0) {
        setFields(['', '']);
      } else if (selectedSupplements.length === 1) {
        setFields([selectedSupplements[0], '']);
      } else if (selectedSupplements.length === 2) {
        setFields([selectedSupplements[0], selectedSupplements[1]]);
      } else {
        // If more than 2 supplements, fill first two fields and create additional ones
        const firstTwo = [selectedSupplements[0], selectedSupplements[1]];
        const additional = selectedSupplements.slice(2).map(item => item);
        const emptyFieldsNeeded = Math.max(0, 2 - additional.length);
        const allFields = [...firstTwo, ...additional, ...Array(emptyFieldsNeeded).fill('')];
        setFields(allFields.length < 2 ? [...allFields, ...Array(2 - allFields.length).fill('')] : allFields);
      }
      
      navigate(location.pathname, { replace: true }); // Clear the state
    }
    
    // Handle URL params
    const params = new URLSearchParams(window.location.search);
    const analyzeParam = params.get('analyze');
    
    if (analyzeParam) {
      const items = analyzeParam.split(',').map(item => item.trim());
      setSupplements(items);
    }
  }, [location.state]);

  const handleFieldChange = (index, value) => {
    const newFields = [...fields];
    newFields[index] = value;
    setFields(newFields);
  };

  const handleAddField = () => {
    setFields([...fields, '']);
    hapticFeedback('light');
  };

  const handleRemoveField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    hapticFeedback('light');
  };

  const handleAddSupplement = (index) => {
    const value = fields[index].trim();
    if (value && !supplements.includes(value)) {
      setSupplements([...supplements, value]);
      const newFields = [...fields];
      newFields[index] = '';
      setFields(newFields);
      hapticFeedback('light');
    }
  };

  const handleRemoveSupplement = (index) => {
    const newSupplements = supplements.filter((_, i) => i !== index);
    setSupplements(newSupplements);
    hapticFeedback('light');
  };

  const handleAnalyze = () => {
    // Add any remaining field values to supplements
    const allSupplements = [...supplements];
    fields.forEach(field => {
      const value = field.trim();
      if (value && !allSupplements.includes(value)) {
        allSupplements.push(value);
      }
    });

    if (allSupplements.length < 2) {
      setError('Добавьте минимум 2 добавки для анализа');
      return;
    }
    
    // Сохраняем в localStorage как запасной вариант
    localStorage.setItem('pending-analysis', JSON.stringify(allSupplements));
    navigate('/analysis');
  };

  const handleQuickSelect = () => {
    navigate('/quick-select', { state: { currentSupplements: supplements } });
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 1, pb: 8 }}>
      <CompactHeader>
        <Typography variant="h4" sx={{ mb: 1, fontSize: '2rem' }}>
          💊 🧪 🌿 ⚡
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          Анализ совместимости добавок
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Проверьте взаимодействие витаминов и БАДов
        </Typography>
      </CompactHeader>

      <GradientPaper elevation={0}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
          Введите ваши добавки
        </Typography>
        
        {fields.map((field, index) => (
          <SupplementField key={index}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={`Добавка ${index + 1}`}
              value={field}
              onChange={(e) => handleFieldChange(index, e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddSupplement(index);
                }
              }}
              size="small"
              InputProps={{
                endAdornment: (
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {field.trim() && (
                      <IconButton
                        size="small"
                        onClick={() => handleAddSupplement(index)}
                        color="primary"
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    )}
                    {fields.length > 2 && (
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveField(index)}
                        color="error"
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                ),
                sx: { borderRadius: 2 },
              }}
            />
          </SupplementField>
        ))}

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <AddFieldButton size="small" onClick={handleAddField}>
            <AddIcon />
          </AddFieldButton>
        </Box>

        <Collapse in={supplements.length > 0}>
          <Box sx={{ mt: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Выбранные добавки ({supplements.length}):
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {supplements.map((supplement, index) => (
                <SupplementChip
                  key={index}
                  label={supplement}
                  onDelete={() => handleRemoveSupplement(index)}
                  color="primary"
                  size="medium"
                />
              ))}
            </Box>
          </Box>
        </Collapse>

        {error && (
          <Fade in={true}>
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          </Fade>
        )}

        <QuickSelectButton
          fullWidth
          variant="outlined"
          color="secondary"
          startIcon={<DashboardIcon />}
          onClick={handleQuickSelect}
        >
          Быстрый выбор
        </QuickSelectButton>

        <StyledButton
          fullWidth
          variant="contained"
          size="large"
          startIcon={<ScienceIcon />}
          onClick={handleAnalyze}
          disabled={supplements.length + fields.filter(f => f.trim()).length < 2}
          sx={{ 
            mt: 2,
            backgroundColor: '#2563eb',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.1rem',
            padding: '14px 28px',
            boxShadow: '0 6px 16px rgba(37, 99, 235, 0.3)',
            '&:hover': {
              backgroundColor: '#1d4ed8',
              boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
            },
            '&:disabled': {
              backgroundColor: '#9ca3af',
              color: '#e5e7eb',
            }
          }}
        >
          Анализировать совместимость
        </StyledButton>
      </GradientPaper>
    </Container>
  );
}

export default HomePage;