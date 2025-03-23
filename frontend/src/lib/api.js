import axios from 'axios';

// Create an axios instance with request/response logging
const api = axios.create();

// Add a request interceptor
api.interceptors.request.use(
  config => {
    console.log(`REQUEST: ${config.method.toUpperCase()} ${config.url}`, config);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor
api.interceptors.response.use(
  response => {
    console.log(`RESPONSE: ${response.status} from ${response.config.url}`, response.data);
    return response;
  },
  error => {
    console.error('Response error:', error.response || error);
    return Promise.reject(error);
  }
);

export default api;
