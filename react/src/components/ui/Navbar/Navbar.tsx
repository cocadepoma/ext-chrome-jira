import { useContext } from 'react';
// import Image from "next/image";
// import NextLink from 'next/link';

import { MenuOutlined as MenuOutlinedIcon } from '@mui/icons-material'
import { AppBar, Toolbar, IconButton, Typography, Link } from '@mui/material'

import { UIContext } from '../../../contexts/ui';
// import { useRouter } from 'next/router';

export const Navbar = () => {
  const { openSideMenu } = useContext(UIContext);
  // const router = useRouter();

  return (
    <AppBar position="fixed" elevation={0} sx={{ backgroundColor: 'rgb(255,255,255)', boxShadow: '0px 3px 7px -3px #ffffff59', width: '800px', left: 0, height: '2rem' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', boxShadow: '2px 2px 5px -1px rgba(0,0,0,0.5)', minHeight: '2rem!important' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src="https://res.cloudinary.com/diwcrqh9i/image/upload/v1668332527/logos/logo_yox9pw.png"
            alt="logo"
            width={20}
            height={20}
            onClick={() => { }}
            style={{ cursor: 'pointer' }}
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
