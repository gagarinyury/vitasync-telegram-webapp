import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  LinearProgress,
  Fade
} from '@mui/material';
import {
  Person,
  CalendarMonth,
  Assessment,
  Timer,
  LocalOffer,
  Logout,
  ArrowBack,
  EmojiEvents,
  Bolt
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useAuthStore } from '../store/authStore';
import { useTelegram } from '../hooks/useTelegram';

const ProfileHeader = styled(Paper)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: '#fff',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  textAlign: 'center'
}));

const StatsCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  height: '100%',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const AchievementChip = styled(Chip)(({ theme }) => ({
  margin: theme.spacing(0.5),
  background: 'linear-gradient(45deg, #ffd700 30%, #ffed4b 90%)',
  color: '#000',
  fontWeight: 600
}));

function ProfilePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { tg } = useTelegram();
  const [analysisCount, setAnalysisCount] = useState(0);
  const [remainingAnalyses, setRemainingAnalyses] = useState(2);
  const [userLevel, setUserLevel] = useState(1);
  const [xp, setXp] = useState(450);
  const [xpToNextLevel, setXpToNextLevel] = useState(1000);

  useEffect(() => {
    // Загрузка статистики пользователя
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    // Здесь будет загрузка реальной статистики
    // Пока используем моковые данные
    setAnalysisCount(7);
    setRemainingAnalyses(1);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const achievements = [
    { title: 'Первый анализ', icon: '🎯', unlocked: true },
    { title: '5 анализов', icon: '🏆', unlocked: true },
    { title: 'Эксперт БАДов', icon: '🧑‍🔬', unlocked: false },
    { title: 'Гуру здоровья', icon: '💊', unlocked: false }
  ];

  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 8 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate('/')}
        sx={{ mb: 2, color: 'white' }}
      >
        Назад
      </Button>

      <ProfileHeader elevation={3}>
        <Avatar 
          sx={{ 
            width: 100, 
            height: 100, 
            mx: 'auto', 
            mb: 2,
            bgcolor: 'rgba(255,255,255,0.2)',
            fontSize: 48
          }}
        >
          {user?.first_name?.charAt(0) || '?'}
        </Avatar>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
          {user?.first_name} {user?.last_name}
        </Typography>
        <Typography variant="body1" sx={{ opacity: 0.9 }}>
          @{user?.username || 'telegram_user'}
        </Typography>
        
        <Box sx={{ mt: 3 }}>
          <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
            Уровень {userLevel}
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={(xp / xpToNextLevel) * 100}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: 'rgba(255,255,255,0.3)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: '#ffd700'
              }
            }}
          />
          <Typography variant="caption" sx={{ mt: 0.5, display: 'block', opacity: 0.9 }}>
            {xp} / {xpToNextLevel} XP
          </Typography>
        </Box>
      </ProfileHeader>

      <Fade in={true} timeout={600}>
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <StatsCard elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Assessment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {analysisCount}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Анализов проведено
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
          <Grid item xs={6}>
            <StatsCard elevation={2}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Bolt sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" fontWeight={700}>
                  {remainingAnalyses}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Осталось сегодня
                </Typography>
              </CardContent>
            </StatsCard>
          </Grid>
        </Grid>
      </Fade>

      <Fade in={true} timeout={800}>
        <Card sx={{ mb: 3, borderRadius: 2 }} elevation={2}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <EmojiEvents sx={{ color: 'warning.main', mr: 1 }} />
              <Typography variant="h6" fontWeight={600}>
                Достижения
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
              {achievements.map((achievement, index) => (
                <AchievementChip
                  key={index}
                  icon={<span>{achievement.icon}</span>}
                  label={achievement.title}
                  sx={{ opacity: achievement.unlocked ? 1 : 0.5 }}
                />
              ))}
            </Box>
          </CardContent>
        </Card>
      </Fade>

      <Fade in={true} timeout={1000}>
        <Card sx={{ borderRadius: 2 }} elevation={2}>
          <List>
            <ListItem>
              <ListItemIcon>
                <Person color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Telegram ID"
                secondary={user?.id || 'Не указан'}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <CalendarMonth color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Дата регистрации"
                secondary={new Date().toLocaleDateString('ru-RU')}
              />
            </ListItem>
            <Divider />
            <ListItem>
              <ListItemIcon>
                <LocalOffer color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary="Тип аккаунта"
                secondary={
                  <Chip 
                    label="Премиум" 
                    size="small" 
                    color="warning"
                    sx={{ mt: 0.5 }}
                  />
                }
              />
            </ListItem>
          </List>
        </Card>
      </Fade>

      <Box sx={{ mt: 4 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<Logout />}
          onClick={handleLogout}
          sx={{ borderRadius: 2 }}
        >
          Выйти из аккаунта
        </Button>
      </Box>
    </Container>
  );
}

export default ProfilePage;