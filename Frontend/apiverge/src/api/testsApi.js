// src/api/testsApi.js

import { createApiService } from './baseApiService';

const testsService = createApiService('/api/tests');

export const testsApi = {
  ...testsService,
  
  // Custom methods for tests
  generateAITests: async (testId, options) => {
    return testsService.custom('post', `${testId}/ai-generate`, options);
  },
  
  getTestResults: async (testId) => {
    return testsService.custom('get', `${testId}/results`);
  }
};