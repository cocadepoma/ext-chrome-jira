import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import Home from './views/Home';
import TicketView from "./views/Tickets/Tickets";

import { BoardsProvider } from './contexts/boards';
import { UIProvider } from './contexts/ui';

import { lightTheme } from './themes';

import { Layout } from './components/layouts';
import { AuthProvider } from "./contexts/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
        <h2>Hola</h2>
      </div>
    )
  },
  {
    path: "/home",
    element: (
      <Layout>
        <Home />
      </Layout>
    )
  },
  {
    path: "/ticket/:boardid/:ticketid",
    element: (
      <Layout>
        <TicketView />
      </Layout>
    )
  },
  {
    path: "*",
    element: (
      <Navigate to="/" />
    )
  },
]);

function App() {

  return (
    <AuthProvider>
      <SnackbarProvider maxSnack={3}>
        <UIProvider>
          <BoardsProvider>
            <ThemeProvider theme={lightTheme}>
              <CssBaseline>
                <RouterProvider router={router} />
              </CssBaseline >
            </ThemeProvider >
          </BoardsProvider>
        </UIProvider>
      </SnackbarProvider>
    </AuthProvider>
  );
};

export default App;
