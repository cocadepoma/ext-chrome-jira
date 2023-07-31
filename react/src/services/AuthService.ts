import kanbanifyApi from "../api/kanbanify";
import { UserResponse } from "../interfaces/user";

const getEmail = async (): Promise<string> => {
  const resp = await chrome?.storage?.sync?.get(null);

  return resp?.email ?? '';
};

const setEmail = async (email: string) => {
  await chrome?.storage?.sync?.set({ email });
};

const getToken = async (): Promise<string> => {
  const resp = await chrome?.storage?.local?.get(null);
  return resp?.token ?? '';
};

const setToken = async (token: string) => {
  await chrome?.storage?.local?.set({ token });
};

const deleteToken = async () => {
  await chrome?.storage?.local.remove('token');
};

interface AuthParams {
  email: string;
  password: string;
  signal?: AbortSignal
}

const login = async ({ email, password, signal }: AuthParams) => {
  return kanbanifyApi.post<UserResponse>('/api/auth/login', { email, password }, { signal });
};

const register = async ({ email, password, signal }: AuthParams) => {
  return kanbanifyApi.post<UserResponse>('/api/auth/register', { email, password }, { signal });
};

const refresh = async () => {
  return kanbanifyApi.post<UserResponse>('/api/auth/refresh');
};

export const AuthService = {
  getToken,
  setToken,
  deleteToken,
  getEmail,
  setEmail,
  login,
  register,
  refresh
};