import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import {
  Home,
  Science,
  CalendarMonth,
  Person,
  History,
  Menu
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTelegram } from '../hooks/useTelegram';

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  height: 75,
  backgroundColor: theme.palette.background.paper,
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  '& .MuiBottomNavigationAction-root': {
    minWidth: 60,
    maxWidth: 120,
    padding: '6px 0',
    transition: 'all 0.3s ease',
    '&.Mui-selected': {
      color: theme.palette.primary.main,
      '& .MuiBottomNavigationAction-label': {
        fontSize: '0.85rem',
        fontWeight: 600,
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1.8rem',
        transform: 'scale(1.1)',
      }
    },
    '&:not(.Mui-selected)': {
      color: theme.palette.text.secondary,
      '& .MuiSvgIcon-root': {
        fontSize: '1.5rem',
      }
    }
  },
  '& .MuiBottomNavigationAction-label': {
    fontSize: '0.75rem',
    marginTop: 4,
    transition: 'all 0.3s ease',
  }
}));

const NavigationWrapper = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  borderTopLeftRadius: theme.spacing(2),
  borderTopRightRadius: theme.spacing(2),
  overflow: 'hidden',
  boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.1)',
}));

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hapticFeedback } = useTelegram();

  const navigationItems = [
    { label: 'Главная', value: '/', icon: <Home /> },
    { label: 'История', value: '/history', icon: <History /> },
    { label: 'График', value: '/schedule', icon: <CalendarMonth /> },
    { label: 'Профиль', value: '/profile', icon: <Person /> },
    { label: 'Меню', value: '/menu', icon: <Menu /> }
  ];

  const currentValue = navigationItems.find(item => 
    location.pathname === item.value || 
    (item.value !== '/' && location.pathname.startsWith(item.value))
  )?.value || (location.pathname === '/analysis' ? '/' : location.pathname);

  const handleChange = (event, newValue) => {
    hapticFeedback('light');
    navigate(newValue);
  };

  return (
    <NavigationWrapper elevation={0}>
      <StyledBottomNavigation
        value={currentValue}
        onChange={handleChange}
        showLabels
      >
        {navigationItems.map((item) => (
          <BottomNavigationAction
            key={item.value}
            label={item.label}
            value={item.value}
            icon={item.icon}
          />
        ))}
      </StyledBottomNavigation>
    </NavigationWrapper>
  );
}

export default Navigation;