import { useContext } from 'react';

import { MenuOutlined as MenuOutlinedIcon } from '@mui/icons-material'
import { AppBar, Toolbar, IconButton, Typography, Link } from '@mui/material'

import { UIContext } from '../../../contexts/ui';
import { useNavigate } from 'react-router-dom';

export const Navbar = () => {
  const { openSideMenu } = useContext(UIContext);
  const navigate = useNavigate();

  return (
    <AppBar position="fixed" elevation={0} sx={{ backgroundColor: 'rgb(255,255,255)', boxShadow: '0px 3px 7px -3px #ffffff59', width: '800px', left: 0, height: '2rem' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', boxShadow: '2px 2px 5px -1px rgba(0,0,0,0.5)', minHeight: '2rem!important' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src="https://res.cloudinary.com/diwcrqh9i/image/upload/v1668332527/logos/logo_yox9pw.png"
            alt="logo"
            width={20}
            height={20}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer', transform: 'scaleX(-1)' }}
          />

          <Typography variant="h6" sx={{ color: 'rgba(0,0,0,0.7)', fontSize: '1rem' }}>LibreJira</Typography>
        </div>


        <IconButton size="small" edge="start" onClick={openSideMenu} >
          <MenuOutlinedIcon />
        </IconButton>

      </Toolbar>
    </AppBar>
  );
};
