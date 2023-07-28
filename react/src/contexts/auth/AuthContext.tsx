import { createContext } from 'react';
import { UIState } from './AuthProvider';

export interface ContextProps {
  userId: string | null;
  email: string | null;
  token: string | null;

  onRegister: ({ email, password }: { email: string, password: string }) => Promise<void>;
  onLogin: ({ email, password }: { email: string, password: string }) => Promise<void>;
  signin: ({ email, userId }: UIState) => void;
  signout: VoidFunction;
}

export const AuthContext = createContext({} as ContextProps);