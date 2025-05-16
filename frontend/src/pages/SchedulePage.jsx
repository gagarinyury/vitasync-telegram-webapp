import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Fade,
  Collapse,
  Alert
} from '@mui/material';
import {
  CalendarMonth,
  AccessTime,
  Add,
  Delete,
  ExpandMore,
  LightMode,
  WbTwilight,
  DarkMode,
  Restaurant,
  Schedule as ScheduleIcon,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';

const ScheduleHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
  color: '#fff',
  padding: theme.spacing(3),
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(3),
  textAlign: 'center'
}));

const TimeCard = styled(Card)(({ theme, timeOfDay }) => ({
  borderRadius: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: `2px solid ${
    timeOfDay === 'morning' ? '#ffd54f' :
    timeOfDay === 'afternoon' ? '#ffb74d' :
    timeOfDay === 'evening' ? '#81c784' :
    '#7986cb'
  }`,
  overflow: 'visible',
  position: 'relative',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[4]
  }
}));

const TimeIcon = styled(Box)(({ theme, color }) => ({
  position: 'absolute',
  top: -15,
  left: 20,
  background: color,
  borderRadius: '50%',
  padding: theme.spacing(1),
  color: '#fff',
  boxShadow: theme.shadows[2]
}));

function SchedulePage() {
  const [supplements, setSupplements] = useState([
    { id: 1, name: 'Витамин D3', dose: '2000 МЕ', time: 'morning' },
    { id: 2, name: 'Омега-3', dose: '1000 мг', time: 'afternoon' },
    { id: 3, name: 'Магний', dose: '400 мг', time: 'evening' }
  ]);

  const [newSupplement, setNewSupplement] = useState({
    name: '',
    dose: '',
    time: 'morning'
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedTime, setExpandedTime] = useState('');

  const timeOfDayOptions = [
    { value: 'morning', label: 'Утро', icon: <LightMode />, color: '#ffd54f' },
    { value: 'afternoon', label: 'День', icon: <WbTwilight />, color: '#ffb74d' },
    { value: 'evening', label: 'Вечер', icon: <DarkMode />, color: '#81c784' },
    { value: 'night', label: 'Ночь', icon: <Restaurant />, color: '#7986cb' }
  ];

  const handleAddSupplement = () => {
    if (newSupplement.name && newSupplement.dose) {
      setSupplements([
        ...supplements,
        { ...newSupplement, id: Date.now() }
      ]);
      setNewSupplement({ name: '', dose: '', time: 'morning' });
      setShowAddForm(false);
    }
  };

  const handleDeleteSupplement = (id) => {
    setSupplements(supplements.filter(s => s.id !== id));
  };

  const groupedSupplements = timeOfDayOptions.reduce((acc, time) => {
    acc[time.value] = supplements.filter(s => s.time === time.value);
    return acc;
  }, {});

  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 10 }}>
      <ScheduleHeader>
        <CalendarMonth sx={{ fontSize: 48, mb: 1 }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          График приема
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.9 }}>
          Организуйте прием добавок по времени
        </Typography>
      </ScheduleHeader>

      {supplements.length === 0 ? (
        <Fade in={true}>
          <Alert severity="info" sx={{ mb: 3, borderRadius: 2 }}>
            У вас пока нет добавок в графике. Добавьте первую добавку, чтобы начать!
          </Alert>
        </Fade>
      ) : (
        timeOfDayOptions.map(({ value, label, icon, color }) => (
          <TimeCard key={value} timeOfDay={value}>
            <TimeIcon color={color}>
              {icon}
            </TimeIcon>
            <CardContent sx={{ pt: 3 }}>
              <Box 
                sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  mb: 2,
                  cursor: 'pointer'
                }}
                onClick={() => setExpandedTime(expandedTime === value ? '' : value)}
              >
                <Typography variant="h6" fontWeight={600}>
                  {label}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={groupedSupplements[value].length} 
                    size="small"
                    color="primary"
                  />
                  <IconButton size="small">
                    <ExpandMore 
                      sx={{ 
                        transform: expandedTime === value ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.3s'
                      }} 
                    />
                  </IconButton>
                </Box>
              </Box>
              
              <Collapse in={expandedTime === value}>
                <List disablePadding>
                  {groupedSupplements[value].map((supplement) => (
                    <ListItem 
                      key={supplement.id} 
                      sx={{ 
                        bgcolor: 'grey.50', 
                        borderRadius: 1, 
                        mb: 1,
                        p: 2
                      }}
                    >
                      <ListItemText
                        primary={<Typography fontWeight={600}>{supplement.name}</Typography>}
                        secondary={supplement.dose}
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDeleteSupplement(supplement.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            </CardContent>
          </TimeCard>
        ))
      )}

      <Fade in={showAddForm}>
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={2}>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Добавить добавку
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Название добавки"
                value={newSupplement.name}
                onChange={(e) => setNewSupplement({ ...newSupplement, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Дозировка"
                value={newSupplement.dose}
                onChange={(e) => setNewSupplement({ ...newSupplement, dose: e.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Время приема</InputLabel>
                <Select
                  value={newSupplement.time}
                  label="Время приема"
                  onChange={(e) => setNewSupplement({ ...newSupplement, time: e.target.value })}
                >
                  {timeOfDayOptions.map(option => (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {option.icon}
                        {option.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<CheckCircle />}
                onClick={handleAddSupplement}
                fullWidth
              >
                Добавить
              </Button>
              <Button
                variant="outlined"
                startIcon={<Cancel />}
                onClick={() => setShowAddForm(false)}
                color="error"
              >
                Отмена
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Fade>

      <Button
        fullWidth
        variant="contained"
        size="large"
        startIcon={<Add />}
        onClick={() => setShowAddForm(true)}
        sx={{ 
          borderRadius: 3, 
          py: 1.5,
          display: showAddForm ? 'none' : 'flex'
        }}
      >
        Добавить добавку
      </Button>

      <Paper 
        sx={{ 
          p: 3, 
          mt: 3, 
          borderRadius: 2,
          background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'
        }} 
        elevation={0}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <ScheduleIcon color="primary" />
          <Typography variant="h6" fontWeight={600}>
            Рекомендации по приему
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Утро: жирорастворимые витамины (A, D, E, K) с едой
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • День: витамины группы B для энергии
        </Typography>
        <Typography variant="body2" sx={{ mb: 1 }}>
          • Вечер: магний и минералы для расслабления
        </Typography>
        <Typography variant="body2">
          • Разносите прием железа и кальция на 2-3 часа
        </Typography>
      </Paper>
    </Container>
  );
}

export default SchedulePage;