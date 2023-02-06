import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { SnackbarProvider } from 'notistack'
import { CssBaseline, ThemeProvider } from '@mui/material';

import Home from './views/Home';
import TicketView from "./views/Tickets/Tickets";
import BoardsView from "./views/Boards/BoardsView";

import { UIProvider } from './contexts/ui';
import { BoardsProvider } from './contexts/boards';

import { lightTheme } from './themes';

import { Layout } from './components/layouts';

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Home />
      </Layout>
    )
  },
  {
    path: "/boards",
    element: (
      <Layout>
        <BoardsView />
      </Layout>
    )
  },
  {
    path: "/ticket/:id",
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
  );
};

export default App;
