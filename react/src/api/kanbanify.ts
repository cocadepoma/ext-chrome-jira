import axios from 'axios';
import { AuthService } from '../services/AuthService';

const kanbanifyApi = axios.create({
  baseURL: import.meta.env.VITE_BASE_API,
});

kanbanifyApi.interceptors.request.use(
  async (config) => {
    const token = await AuthService.getToken();

    if (token) {
      config.headers['x-token'] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default kanbanifyApi;
