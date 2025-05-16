import api from './api';

const analysisService = {
  analyzeCompatibility: async (supplements, modelType = 'standard') => {
    try {
      const response = await api.post('/analysis/compatibility', {
        supplements,
        modelType
      });
      
      return {
        success: true,
        analysis: response.data.analysis,
        model: response.data.model,
        limitInfo: response.data.limitInfo
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Произошла ошибка при анализе'
      };
    }
  },

  getHistory: async () => {
    const response = await api.get('/analysis/history');
    return response.data.history;
  },

  getLimits: async () => {
    const response = await api.get('/analysis/limits');
    return response.data;
  },

  getSuggestions: async (category) => {
    const response = await api.post('/analysis/suggestions', { category });
    return response.data.suggestions;
  }
};

export default analysisService;