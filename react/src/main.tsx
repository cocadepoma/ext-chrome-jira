import ReactDOM from 'react-dom/client';
import App from './App';
import { Providers } from './providers/Providers';

import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <Providers>
    <App />
  </Providers>
);
