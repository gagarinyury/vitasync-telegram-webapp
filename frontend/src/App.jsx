import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container, ThemeProvider, Box } from '@mui/material';
import { useTelegram } from './hooks/useTelegram';
import { useAuthStore } from './store/authStore';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import SchedulePage from './pages/SchedulePage';
import ProfilePage from './pages/ProfilePage';
import MainMenuPage from './pages/MainMenuPage';
import Navigation from './components/Navigation';
import LoadingScreen from './components/LoadingScreen';
import theme from './styles/theme';

function App() {
  const { tg, user: tgUser } = useTelegram();
  const { login, isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (tg) {
      tg.ready();
      tg.expand();
      
      // Style the Telegram app
      tg.setHeaderColor(theme.palette.primary.main);
      tg.setBackgroundColor('#ffffff');
    }
  }, [tg]);

  useEffect(() => {
    if (tgUser && !isAuthenticated) {
      login(tg.initData);
    }
  }, [tgUser, isAuthenticated, login, tg]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Container maxWidth="sm" sx={{ py: 2 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MainMenuPage />} />
          <Route path="/analysis" element={<AnalysisPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Container>
      <Navigation />
    </Box>
  );
}

export default App;