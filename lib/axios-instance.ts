import axios from 'axios';
import { handleAxiosError } from '@/utils/error';
import { getSessionId } from '@/utils/helpers';

// Base API URL - uses environment variable or defaults to the energy-stack API
const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'https://energy-stack-api.onrender.com/api/';

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add session ID to requests if available
    const sessionId = getSessionId();
    if (sessionId) {
      config.headers['X-Session-ID'] = sessionId;
    }
    return config;
  },
  (error) => {
    handleAxiosError(error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    handleAxiosError(error);
    return Promise.reject(error);
  }
);

export default api;
