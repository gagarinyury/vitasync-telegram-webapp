import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Paper,
  Chip,
  Button,
  IconButton,
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Fade,
} from '@mui/material';
import SwipeableViews from 'react-swipeable-views';
import {
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  LocalPharmacy as VitaminsIcon,
  Psychology as MedicationIcon,
  Science as ScienceIcon,
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';
import { useTelegram } from '../hooks/useTelegram';

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

const CategoryCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  borderRadius: theme.spacing(2),
  animation: `${slideInUp} 0.5s ease-out`,
  '&:hover': {
    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.1)',
  },
}));

const SupplementChip = styled(Chip)(({ theme, isSelected }) => ({
  margin: theme.spacing(0.5),
  fontWeight: 500,
  transition: 'all 0.2s ease',
  backgroundColor: isSelected 
    ? theme.palette.primary.main 
    : theme.palette.grey[200],
  color: isSelected ? 'white' : theme.palette.text.primary,
  '&:hover': {
    transform: 'scale(1.05)',
    backgroundColor: isSelected 
      ? theme.palette.primary.dark 
      : theme.palette.grey[300],
  },
}));

const TabPanel = ({ children, value, index, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const categories = {
  vitamins: [
    { name: 'Витамины группы B', items: ['B1', 'B2', 'B3', 'B5', 'B6', 'B7', 'B9', 'B12', 'B-комплекс'] },
    { name: 'Жирорастворимые витамины', items: ['Витамин A', 'Витамин D3', 'Витамин E', 'Витамин K2'] },
    { name: 'Водорастворимые витамины', items: ['Витамин C', 'Биотин', 'Фолиевая кислота'] },
    { name: 'Комплексы', items: ['Мультивитамины', 'Пренатальные витамины', 'Детские витамины'] },
  ],
  minerals: [
    { name: 'Макроэлементы', items: ['Кальций', 'Магний', 'Калий', 'Натрий', 'Фосфор'] },
    { name: 'Микроэлементы', items: ['Железо', 'Цинк', 'Медь', 'Селен', 'Йод', 'Марганец'] },
    { name: 'Комплексы', items: ['Мультиминералы', 'Кальций+D3', 'Магний+B6'] },
  ],
  supplements: [
    { name: 'Омега кислоты', items: ['Омега-3', 'Омега-6', 'Омега-9', 'Рыбий жир'] },
    { name: 'Антиоксиданты', items: ['Коэнзим Q10', 'Альфа-липоевая кислота', 'Ресвератрол', 'Астаксантин'] },
    { name: 'Пробиотики', items: ['Лактобактерии', 'Бифидобактерии', 'Пробиотический комплекс'] },
    { name: 'Для красоты', items: ['Коллаген', 'Гиалуроновая кислота', 'Биотин для волос'] },
    { name: 'Спортивное питание', items: ['Креатин', 'L-карнитин', 'BCAA', 'Протеин'] },
    { name: 'Прочее', items: ['Мелатонин', 'Глюкозамин', 'Куркумин', 'Спирулина'] },
  ],
};

function QuickSelectScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const { hapticFeedback } = useTelegram();
  const [selectedTab, setSelectedTab] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);

  useEffect(() => {
    if (location.state?.currentSupplements) {
      setSelectedItems(location.state.currentSupplements);
    }
  }, [location.state]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const handleItemToggle = (item) => {
    const isSelected = selectedItems.includes(item);
    if (isSelected) {
      setSelectedItems(selectedItems.filter(i => i !== item));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
    hapticFeedback('light');
  };

  const handleConfirm = () => {
    navigate('/', { state: { supplements: selectedItems } });
  };

  const renderCategory = (categoryList) => {
    return categoryList.map((category, idx) => (
      <CategoryCard key={idx} elevation={1}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
          {category.name}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
          {category.items.map((item) => (
            <SupplementChip
              key={item}
              label={item}
              onClick={() => handleItemToggle(item)}
              isSelected={selectedItems.includes(item)}
              icon={selectedItems.includes(item) ? <CheckIcon /> : null}
            />
          ))}
        </Box>
      </CategoryCard>
    ));
  };

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ bgcolor: 'background.paper' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => navigate(-1)}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Быстрый выбор
          </Typography>
          <Button
            color="primary"
            variant="contained"
            onClick={handleConfirm}
            disabled={selectedItems.length === 0}
            sx={{ borderRadius: 2 }}
          >
            Готово ({selectedItems.length})
          </Button>
        </Toolbar>
      </AppBar>

      <Paper sx={{ borderRadius: 0 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab 
            icon={<VitaminsIcon />} 
            label="Витамины" 
            iconPosition="start"
          />
          <Tab 
            icon={<MedicationIcon />} 
            label="Минералы" 
            iconPosition="start"
          />
          <Tab 
            icon={<ScienceIcon />} 
            label="БАДы" 
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      <SwipeableViews
        index={selectedTab}
        onChangeIndex={setSelectedTab}
      >
        <TabPanel value={selectedTab} index={0}>
          <Fade in={selectedTab === 0}>
            <Box>
              {renderCategory(categories.vitamins)}
            </Box>
          </Fade>
        </TabPanel>

        <TabPanel value={selectedTab} index={1}>
          <Fade in={selectedTab === 1}>
            <Box>
              {renderCategory(categories.minerals)}
            </Box>
          </Fade>
        </TabPanel>

        <TabPanel value={selectedTab} index={2}>
          <Fade in={selectedTab === 2}>
            <Box>
              {renderCategory(categories.supplements)}
            </Box>
          </Fade>
        </TabPanel>
      </SwipeableViews>

      {selectedItems.length > 0 && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 60,
            left: 0,
            right: 0,
            bgcolor: 'background.paper',
            boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.1)',
            p: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Выбрано: {selectedItems.length}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selectedItems.slice(0, 5).map((item) => (
              <Chip
                key={item}
                label={item}
                size="small"
                color="primary"
                onDelete={() => handleItemToggle(item)}
              />
            ))}
            {selectedItems.length > 5 && (
              <Chip
                label={`+${selectedItems.length - 5}`}
                size="small"
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default QuickSelectScreen;