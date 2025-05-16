import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, Box, Grid, Paper } from '@mui/material';
import { Biotech, CalendarMonth, Assessment, Person, KeyboardArrowRight } from '@mui/icons-material';
import { useAuthStore } from '../store/authStore';
import { styled } from '@mui/material/styles';

const StyledCard = styled(Card)(({ theme, bgColor }) => ({
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  background: `linear-gradient(135deg, ${bgColor} 0%, ${bgColor}dd 100%)`,
  color: '#fff',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[8],
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    right: '-50%',
    bottom: '-50%',
    left: '-50%',
    background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
    transform: 'rotate(45deg)',
    transition: 'transform 0.6s',
  },
  '&:hover::before': {
    transform: 'rotate(45deg) translate(100%, 100%)',
  }
}));

const WelcomeCard = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  padding: theme.spacing(3),
  marginBottom: theme.spacing(4),
  borderRadius: theme.spacing(2),
}));

function MainMenuPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const menuItems = [
    {
      icon: <Biotech sx={{ fontSize: 56 }} />,
      title: 'Анализ совместимости',
      description: 'Проверьте совместимость витаминов и добавок',
      path: '/',
      color: '#1976d2'
    },
    {
      icon: <CalendarMonth sx={{ fontSize: 56 }} />,
      title: 'График приема',
      description: 'Создайте персональный график приема',
      path: '/schedule',
      color: '#388e3c'
    },
    {
      icon: <Assessment sx={{ fontSize: 56 }} />,
      title: 'История анализов',
      description: 'Просмотрите прошлые анализы',
      path: '/history',
      color: '#f57c00'
    },
    {
      icon: <Person sx={{ fontSize: 56 }} />,
      title: 'Профиль',
      description: 'Управляйте вашим профилем',
      path: '/profile',
      color: '#7b1fa2'
    }
  ];

  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 8 }}>
      <WelcomeCard elevation={0}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          Привет, {user?.first_name || 'пользователь'}! 👋
        </Typography>
        <Typography variant="body1">
          Добро пожаловать в VitaSync — ваш персональный помощник для анализа совместимости витаминов и БАДов.
        </Typography>
      </WelcomeCard>

      <Grid container spacing={3}>
        {menuItems.map((item) => (
          <Grid item xs={12} sm={6} key={item.path}>
            <StyledCard 
              bgColor={item.color}
              onClick={() => navigate(item.path)}
              elevation={3}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Box sx={{ mb: 2 }}>
                      {item.icon}
                    </Box>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {item.description}
                    </Typography>
                  </Box>
                  <KeyboardArrowRight sx={{ fontSize: 32, opacity: 0.7 }} />
                </Box>
              </CardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default MainMenuPage;