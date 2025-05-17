import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import {
  Home,
  Schedule as ScheduleIcon,
  Person,
  History,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { useTelegram } from '../hooks/useTelegram';

const StyledBottomNavigation = styled(BottomNavigation)(({ theme }) => ({
  height: 64,
  backgroundColor: theme.palette.background.paper,
  borderTop: '1px solid rgba(0, 0, 0, 0.08)',
  '& .MuiBottomNavigationAction-root': {
    minWidth: 60,
    maxWidth: 120,
    padding: '8px 0',
    transition: 'all 0.2s ease',
    '&.Mui-selected': {
      color: theme.palette.primary.main,
      '& .MuiBottomNavigationAction-label': {
        fontSize: '0.875rem',
        fontWeight: 500,
      },
      '& .MuiSvgIcon-root': {
        fontSize: '1.75rem',
        transform: 'translateY(-2px)',
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
    fontSize: '0.825rem',
    marginTop: 4,
    transition: 'all 0.2s ease',
    fontFamily: theme.typography.fontFamily,
  }
}));

const NavigationWrapper = styled(Paper)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  left: 0,
  right: 0,
  borderTopLeftRadius: 0,
  borderTopRightRadius: 0,
  boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.06)',
  zIndex: 1000,
}));

function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hapticFeedback } = useTelegram();

  const navigationItems = [
    { label: 'Главная', value: '/', icon: <Home /> },
    { label: 'История', value: '/history', icon: <History /> },
    { label: 'График', value: '/schedule', icon: <ScheduleIcon /> },
    { label: 'Профиль', value: '/profile', icon: <Person /> },
  ];

  // Hide navigation on certain pages
  const hideOnRoutes = ['/quick-select', '/results'];
  if (hideOnRoutes.includes(location.pathname)) {
    return null;
  }

  const currentValue = navigationItems.find(item => 
    location.pathname === item.value || 
    (item.value !== '/' && location.pathname.startsWith(item.value))
  )?.value || '/';

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