import React, { createContext, useContext, useEffect, useState } from 'react';

const TelegramContext = createContext({});

export const TelegramProvider = ({ children }) => {
  const [tg, setTg] = useState(null);
  const [user, setUser] = useState(null);
  const [initData, setInitData] = useState(null);

  useEffect(() => {
    const telegram = window.Telegram?.WebApp;
    
    if (telegram) {
      setTg(telegram);
      setUser(telegram.initDataUnsafe?.user);
      setInitData(telegram.initData);
      
      // Enable closing confirmation
      telegram.enableClosingConfirmation();
    }
  }, []);

  const showAlert = (message) => {
    if (tg) {
      tg.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message, callback) => {
    if (tg) {
      tg.showConfirm(message, callback);
    } else {
      const result = confirm(message);
      callback(result);
    }
  };

  const hapticFeedback = (type = 'light') => {
    if (tg?.HapticFeedback) {
      switch (type) {
        case 'light':
          tg.HapticFeedback.impactOccurred('light');
          break;
        case 'medium':
          tg.HapticFeedback.impactOccurred('medium');
          break;
        case 'heavy':
          tg.HapticFeedback.impactOccurred('heavy');
          break;
        case 'success':
          tg.HapticFeedback.notificationOccurred('success');
          break;
        case 'warning':
          tg.HapticFeedback.notificationOccurred('warning');
          break;
        case 'error':
          tg.HapticFeedback.notificationOccurred('error');
          break;
        default:
          tg.HapticFeedback.impactOccurred('light');
      }
    }
  };

  return (
    <TelegramContext.Provider value={{
      tg,
      user,
      initData,
      showAlert,
      showConfirm,
      hapticFeedback
    }}>
      {children}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => {
  const context = useContext(TelegramContext);
  if (!context) {
    throw new Error('useTelegram must be used within TelegramProvider');
  }
  return context;
};