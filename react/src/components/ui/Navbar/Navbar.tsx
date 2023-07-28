import { useContext, useState } from 'react';

import { Add, Dashboard, LowPriority, TransitEnterexit } from '@mui/icons-material';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';

import { useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../contexts/auth';
import img from '../../../img/128.png';
interface Props {
  onOrderBoards: () => void;
  onBoardAdd: () => void;
}

export const Navbar = ({ onBoardAdd, onOrderBoards }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { signout } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const onAddBoardClick = () => {
    handleClose();
    onBoardAdd();
  };

  const onBoardsOrderClick = () => {
    handleClose();
    onOrderBoards();
  };

  const onLogout = () => {
    signout();
    navigate('/login');
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{ backgroundColor: '#ffffff', boxShadow: '0px 3px 7px -3px #ffffff59', width: '800px', left: 0, height: '2rem' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', boxShadow: '2px 2px 5px -1px rgba(0,0,0,0.5)', minHeight: '2rem!important' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={img}
            alt="logo"
            width={23}
            height={23}
            onClick={() => navigate('/boards')}
            style={{ cursor: 'pointer', filter: 'drop-shadow(rgba(0, 0, 0, 0.4) 1px 1px 3px)' }}
          />

          <Typography variant="h6" sx={{ color: 'rgba(0,0,0,0.7)', fontSize: '1rem' }}>Kanbanify</Typography>
        </div>

        <div>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem sx={{ fontSize: '0.7rem' }} onClick={onAddBoardClick}><Add sx={{ width: '1rem', height: '1rem', marginRight: '1rem' }} />Add new board</MenuItem>
            <MenuItem sx={{ fontSize: '0.7rem' }} onClick={onBoardsOrderClick}> <LowPriority sx={{ width: '1rem', height: '1rem', marginRight: '1rem' }} />Order boards</MenuItem>
            <MenuItem sx={{ fontSize: '0.7rem' }} onClick={onLogout}> <TransitEnterexit sx={{ width: '1rem', height: '1rem', marginRight: '1rem' }} />Logout</MenuItem>
          </Menu>

          {
            location.pathname === '/boards' && (
              <Tooltip title="Board options">
                <IconButton size="small" edge="start" onClick={handleClick}>
                  <Dashboard sx={{ width: '1rem', height: '1rem' }} />
                </IconButton>
              </Tooltip>
            )
          }
        </div>

      </Toolbar>
    </AppBar>
  );
};
