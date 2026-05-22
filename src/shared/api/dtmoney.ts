import axios from 'axios';
import { Platform } from 'react-native';
import { AppError } from '@/shared/helpers/appError';

const baseURL = Platform.select({
  ios: 'http://localhost:3001',
  android: 'http://10.0.2.2:3001',
  default: 'http://localhost:3001',
});

export const dtmoneyApi = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setOnUnauthorized(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export function getAuthToken() {
  return authToken;
}

dtmoneyApi.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

dtmoneyApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && onUnauthorized && authToken) {
      onUnauthorized();
    }
    const message =
      error?.response?.data?.message ?? 'Erro inesperado';
    return Promise.reject(new AppError(message));
  }
);
