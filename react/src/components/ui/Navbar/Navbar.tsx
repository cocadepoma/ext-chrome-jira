import { useContext, useState } from 'react';

import { Add, Dashboard, LowPriority, TransitEnterexit } from '@mui/icons-material';
import { AppBar, IconButton, Menu, MenuItem, Toolbar, Tooltip, Typography } from '@mui/material';

import { useLocation, useNavigate } from 'react-router-dom';

import { AuthContext } from '../../../contexts/auth';
import img from '../../../img/128.png';
import { AuthService } from '../../../services/AuthService';
import { menuItemStyles } from '../../../styles/muiOverrides';
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

  const onLogout = async () => {
    try {
      signout();
      await AuthService.deleteToken();
      navigate('/login');
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <AppBar position="fixed" elevation={0} sx={{ backgroundColor: 'var(--gray-heading)', boxShadow: '0px 3px 6px -1px #ffffff40', width: '800px', left: 0, height: '2rem', animation: 'fadeIn 0.3s' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: '2rem!important' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img
            src={img}
            alt="logo"
            width={23}
            height={23}
            onClick={() => navigate('/boards')}
            style={{ cursor: 'pointer', filter: 'drop-shadow(rgba(0, 0, 0, 0.4) 1px 1px 3px)' }}
          />

          <Typography variant="h6" sx={{ color: 'rgb(255, 255, 255)', fontSize: '1rem' }}>Kanbanify</Typography>
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
            PaperProps={{
              sx: {
                backgroundColor: 'var(--gray-body)',
                boxShadow: 'var(--shadow-2)'
              }
            }}
          >
            <MenuItem sx={menuItemStyles} onClick={onAddBoardClick}><Add sx={{ width: '1rem', height: '1rem', marginRight: '1rem' }} />Add new board</MenuItem>
            <MenuItem sx={menuItemStyles} onClick={onBoardsOrderClick}> <LowPriority sx={{ width: '1rem', height: '1rem', marginRight: '1rem' }} />Order boards</MenuItem>
            <MenuItem sx={menuItemStyles} onClick={onLogout}> <TransitEnterexit sx={{ width: '1rem', height: '1rem', marginRight: '1rem' }} />Logout</MenuItem>
          </Menu>

          {
            location.pathname === '/boards' && (
              <Tooltip title="Board options">
                <IconButton size="small" edge="start" onClick={handleClick}>
                  <Dashboard sx={{ width: '1rem', height: '1rem', color: 'white' }} />
                </IconButton>
              </Tooltip>
            )
          }
        </div>

      </Toolbar>
    </AppBar>
  );
};
