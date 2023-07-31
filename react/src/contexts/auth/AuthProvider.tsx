import { FC, useReducer } from 'react';
import { AuthContext, authReducer } from '.';

export interface UIState {
  userId: string | null;
  email: string | null;
  token: string | null;
}

interface AuthProviderProps {
  children: React.ReactNode
}

const AUTH_INITIAL_STATE: UIState = {
  userId: null,
  email: null,
  token: null,
};

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);

  const signin = ({ email, userId, token }: UIState) => {
    dispatch({ type: 'Auth - Login', payload: { email, userId, token } });
  };

  const signout = () => {
    dispatch({ type: 'Auth - Logout' });
  };

  const loadEmail = ({ email }: { email: string }) => {
    dispatch({ type: 'Auth - Load email', payload: { email } });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signin,
        signout,
        loadEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};