import kanbanifyApi from "../api/kanbanify";
import { UserResponse } from "../interfaces/user";

const getToken = async (): Promise<string> => {
  const resp = await chrome?.storage?.sync?.get(null);

  return resp?.token ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJwYWNvcnM4OEBnbWFpbC5jb20tNjRjMWE5ZTA2MTc1NDUyYzMwZTFiMTkwIiwiZW1haWwiOiJwYWNvcnM4OEBnbWFpbC5jb20iLCJpYXQiOjE2OTA1MDIzMTUsImV4cCI6MTY5MDUwNTkxNX0.rI1ajMJvOJVdgRojTqnMFyqTGWJd1DVnXkJ4ZrrcXuE';
};

const setToken = async (token: string) => {
  await chrome?.storage?.sync?.set({ token });
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

export const AuthService = {
  getToken,
  setToken,
  login,
  register,
};