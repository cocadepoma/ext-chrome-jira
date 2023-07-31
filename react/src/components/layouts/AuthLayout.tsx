import { Typography } from '@mui/material';

import img from '../../img/128.png';
import logoDeveser from '../../img/logo_white.png';

import './styles.css';

interface Props {
  children: JSX.Element;
}

export const AuthLayout = ({ children }: Props) => {
  return (
    <div className='auth-layout'>
      <div className='auth-layout-bg' />
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', position: 'absolute', left: '50%', top: '10%', transform: 'translate(-50%, -50%)' }}>
        <img
          src={img}
          alt="logo"
          width={40}
          height={36}
          style={{ cursor: 'pointer', filter: 'drop-shadow(rgba(0, 0, 0, 0.4) 1px 1px 3px)' }}
        />

        <Typography variant="h1" sx={{ color: 'rgba(255,255,255,1)', fontSize: '1.7rem' }}>Kanbanify</Typography>
      </div>
      {children}

      <a className="logo-deveser" href="https://deveser.net/" target="_blank">
        <p>by</p>
        <img
          src={logoDeveser}
          alt="logo-deveser"
          style={{ filter: 'drop-shadow(rgba(255, 255, 255, 0.4) 1px 1px 3px)' }}
        />
      </a>
    </div>
  );
};
