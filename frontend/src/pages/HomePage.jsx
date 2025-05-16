import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  InputAdornment,
  Fade
} from '@mui/material';
import {
  Add as AddIcon,
  Science as ScienceIcon,
  Schedule as ScheduleIcon,
  Person as PersonIcon,
  HealthAndSafety,
  Menu as MenuIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTelegram } from '../hooks/useTelegram';
import { useAuthStore } from '../store/authStore';
import analysisService from '../services/analysisService';

const GradientPaper = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const CategoryChip = styled(Chip)(({ theme, isSelected }) => ({
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.grey[200],
  color: isSelected ? '#fff' : theme.palette.text.primary,
  '&:hover': {
    backgroundColor: isSelected ? theme.palette.primary.dark : theme.palette.grey[300],
    transform: 'scale(1.05)',
  }
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(3),
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4],
  }
}));

function HomePage() {
  const navigate = useNavigate();
  const { hapticFeedback } = useTelegram();
  const { user } = useAuthStore();
  const [supplements, setSupplements] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState('');
  const [showCategories, setShowCategories] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const analyzeParam = params.get('analyze');
    
    if (analyzeParam) {
      const items = analyzeParam.split(',').map(item => item.trim());
      setSupplements(items);
    }
  }, []);

  const handleAddSupplement = () => {
    if (inputValue.trim() && !supplements.includes(inputValue.trim())) {
      setSupplements([...supplements, inputValue.trim()]);
      setInputValue('');
      hapticFeedback('light');
    }
  };

  const handleRemoveSupplement = (index) => {
    const newSupplements = supplements.filter((_, i) => i !== index);
    setSupplements(newSupplements);
    hapticFeedback('light');
  };

  const handleAnalyze = () => {
    if (supplements.length < 2) {
      setError('Добавьте минимум 2 добавки для анализа');
      return;
    }
    navigate('/analysis', { state: { supplements } });
  };

  const quickAddCategories = [
    { label: 'Популярные витамины', items: ['Витамин D3', 'Витамин C', 'Витамин B12', 'Мультивитамины'] },
    { label: 'Минералы', items: ['Магний', 'Цинк', 'Железо', 'Кальций'] },
    { label: 'Популярные БАДы', items: ['Омега-3', 'Пробиотики', 'Коллаген', 'Коэнзим Q10'] },
  ];

  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 8 }}>
      <Box sx={{ mb: 3, textAlign: 'center' }}>
        <HealthAndSafety sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Анализ совместимости
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Проверьте, как ваши добавки взаимодействуют друг с другом
        </Typography>
      </Box>

      <GradientPaper elevation={0}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Добавьте ваши добавки
        </Typography>
        
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Например: Витамин D3"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddSupplement()}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button
                  variant="contained"
                  onClick={handleAddSupplement}
                  sx={{ minWidth: 'auto', px: 2 }}
                  disabled={!inputValue.trim()}
                >
                  <AddIcon />
                </Button>
              </InputAdornment>
            ),
            sx: { borderRadius: 3 }
          }}
        />

        {supplements.length > 0 && (
          <Fade in={true}>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Выбранные добавки ({supplements.length}):
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {supplements.map((supplement, index) => (
                  <Chip
                    key={index}
                    label={supplement}
                    onDelete={() => handleRemoveSupplement(index)}
                    color="primary"
                    sx={{ fontSize: '0.9rem' }}
                  />
                ))}
              </Box>
            </Box>
          </Fade>
        )}

        {error && (
          <Fade in={true}>
            <Alert severity="error" sx={{ mt: 2, borderRadius: 2 }}>
              {error}
            </Alert>
          </Fade>
        )}

        <StyledButton
          fullWidth
          variant="contained"
          size="large"
          startIcon={<ScienceIcon />}
          onClick={handleAnalyze}
          disabled={supplements.length < 2}
          sx={{ mt: 3 }}
        >
          Анализировать совместимость
        </StyledButton>
      </GradientPaper>

      {showCategories && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
            Быстрый выбор
          </Typography>
          
          {quickAddCategories.map((category) => (
            <Box key={category.label} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1.5, fontWeight: 500 }}>
                {category.label}
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {category.items.map((item) => (
                  <CategoryChip
                    key={item}
                    label={item}
                    onClick={() => {
                      if (!supplements.includes(item)) {
                        setSupplements([...supplements, item]);
                        hapticFeedback('light');
                      }
                    }}
                    isSelected={supplements.includes(item)}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Paper>
      )}

      <Grid container spacing={2} sx={{ mt: 3 }}>
        <Grid item xs={4}>
          <StyledButton
            fullWidth
            variant="outlined"
            onClick={() => navigate('/menu')}
            startIcon={<MenuIcon />}
          >
            Меню
          </StyledButton>
        </Grid>
        <Grid item xs={4}>
          <StyledButton
            fullWidth
            variant="outlined"
            onClick={() => navigate('/schedule')}
            startIcon={<ScheduleIcon />}
          >
            График
          </StyledButton>
        </Grid>
        <Grid item xs={4}>
          <StyledButton
            fullWidth
            variant="outlined"
            onClick={() => navigate('/profile')}
            startIcon={<PersonIcon />}
          >
            Профиль
          </StyledButton>
        </Grid>
      </Grid>
    </Container>
  );
}

export default HomePage;