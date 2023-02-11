import { useContext, useState } from 'react';

import { Add, MenuOutlined as MenuOutlinedIcon, Dashboard, LowPriority } from '@mui/icons-material'
import { AppBar, Toolbar, IconButton, Typography, Tooltip, MenuItem, Menu } from '@mui/material'

import { UIContext } from '../../../contexts/ui';
import { useNavigate } from 'react-router-dom';

interface Props {
  onOrderBoards: () => void;
  onBoardAdd: () => void;
}

export const Navbar = ({ onBoardAdd, onOrderBoards }: Props) => {
  const navigate = useNavigate();

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
          </Menu>

          <Tooltip title="Boards">
            <IconButton size="small" edge="start" onClick={handleClick}>
              <Dashboard sx={{ width: '1rem', height: '1rem' }} />
            </IconButton>
          </Tooltip>
        </div>

      </Toolbar>
    </AppBar>
  );
};
