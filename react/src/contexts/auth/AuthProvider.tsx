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

  const onRegister = async ({ email, password }: { email: string, password: string }) => {
    // TODO: perform register
    // dispatch({ type: 'Auth - Login', payload: { email, userId } });
  };

  const onLogin = async ({ email, password }: { email: string, password: string }) => {
    // TODO: perform login
    // dispatch({ type: 'Auth - Login', payload: { email, userId } });
  };

  const signin = ({ email, userId, token }: UIState) => {
    dispatch({ type: 'Auth - Login', payload: { email, userId, token } });
  };

  const signout = () => {
    dispatch({ type: 'Auth - Logout' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        onRegister,
        onLogin,
        signin,
        signout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};