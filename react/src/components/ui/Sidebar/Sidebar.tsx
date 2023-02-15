import { useContext, useEffect, useState } from "react";
import { DashboardOutlined, DashboardCustomizeOutlined } from "@mui/icons-material";
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material"
import { UIContext } from "../../../contexts/ui";
import { useLocation, useNavigate } from "react-router-dom";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { sideMenuOpen, closeSideMenu } = useContext(UIContext);
  const [activeUrl, setActiveUrl] = useState('base');

  useEffect(() => {
    if (window.location.href.includes('boards')) {
      setActiveUrl('boards');
    } else {
      setActiveUrl('base');
    }
  }, [location]);

  return (
    <Drawer
      anchor="left"
      open={sideMenuOpen}
      onClose={closeSideMenu}
    >
      <Box sx={{ width: '160px', }}>
        <Box sx={{ padding: '5px 10px', textAlign: 'center', margin: '1rem 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem' }}>
          <Typography variant="body1">Kanbanify</Typography>
          <img
            src="https://res.cloudinary.com/diwcrqh9i/image/upload/v1668332527/logos/logo_yox9pw.png"
            alt="logo"
            width={20}
            height={20}
          />
        </Box>

        <Divider />

        <List>
          <ListItem style={{ backgroundColor: activeUrl === 'base' ? 'rgba(16, 105, 227, 0.2)' : undefined }} button onClick={() => {
            closeSideMenu();
            navigate('/');
          }}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <DashboardOutlined sx={{ width: '1rem', height: '1rem' }} />
            </ListItemIcon>
            <ListItemText primary={'Dashboard'} sx={{ '& span': { fontSize: '0.8rem' } }} />
          </ListItem>


          <ListItem style={{ backgroundColor: activeUrl === 'boards' ? 'rgba(16, 105, 227, 0.2)' : undefined }} button onClick={() => {
            closeSideMenu();
            navigate('/boards');
          }}>
            <ListItemIcon sx={{ minWidth: '35px' }}>
              <DashboardCustomizeOutlined sx={{ width: '1rem', height: '1rem' }} />
            </ListItemIcon>
            <ListItemText primary={'Boards'} sx={{ '& span': { fontSize: '0.8rem' } }} />
          </ListItem>

        </List>

        <Divider />

      </Box>
    </Drawer>
  )
}
