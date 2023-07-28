import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { BoardsProvider } from './contexts/boards';
import { UIProvider } from './contexts/ui';

import { lightTheme } from './themes';

import { Layout } from './components/layouts';
import { AuthLayout } from './components/layouts/AuthLayout';
import { AuthProvider } from "./contexts/auth";

import { ProtectedRoute } from './routes/ProtectedRoute';
import { UnprotectedRoute } from './routes/UnprotectedRoute';

import Home from './views/Home';
import { Login } from './views/Login/Login';
import { Register } from './views/Register/Register';
import { TicketDetail } from './views/TicketDetail/TicketDetail';

const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <AuthLayout>
        <UnprotectedRoute>
          <Login />
        </UnprotectedRoute>
      </AuthLayout>
    )
  },
  {
    path: "/register",
    element: (
      <AuthLayout>
        <UnprotectedRoute>
          <Register />
        </UnprotectedRoute>
      </AuthLayout>
    )
  },
  {
    path: "/boards",
    element: (
      <Layout>
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: "/ticket/:boardid/:ticketid",
    element: (
      <Layout>
        <ProtectedRoute>
          <TicketDetail />
        </ProtectedRoute>
      </Layout>
    )
  },
  {
    path: "*",
    element: (
      <Navigate to="/login" />
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
