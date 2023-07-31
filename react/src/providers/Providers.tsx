import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import { BoardsProvider } from '../contexts/boards';
import { UIProvider } from '../contexts/ui';

import { lightTheme } from '../themes';

import { AuthProvider } from "../contexts/auth";

export const Providers = ({ children }: { children: JSX.Element }) => {
  return (
    <AuthProvider>
      <SnackbarProvider maxSnack={3}>
        <UIProvider>
          <BoardsProvider>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline>
                {children}
              </CssBaseline >
            </ThemeProvider >
          </BoardsProvider>
        </UIProvider>
      </SnackbarProvider>
    </AuthProvider>
  )
}
