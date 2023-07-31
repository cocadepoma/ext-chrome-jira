import { createContext } from 'react';
import { UIState } from './AuthProvider';

export interface ContextProps {
  userId: string | null;
  email: string | null;
  token: string | null;

  signin: ({ email, userId }: UIState) => void;
  signout: VoidFunction;
  loadEmail: ({ email }: { email: string }) => void;
}

export const AuthContext = createContext({} as ContextProps);