import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Typography,
  CssBaseline,
  AppBar,
  Button,
} from '@mui/material';
import { logout } from '../ApiCenter/AuthUtils';

const drawerWidth = 240;

const UserDashboard = () => {
  const navigate = useNavigate();
  const roleName = sessionStorage.getItem('role');

  const navItems = [
    { label: 'Profile', path: 'user-profile' },
    { label: 'Leave Balance', path: 'user-leavebalance' },
    { label: 'Leave Requests', path: 'user-leave-requests' },
    { label: 'Holidays', path: 'user-holidays' },
    { label: 'Apply Leave', path: 'user-apply-leave' },
  ];

  if (roleName === 'HR_MANAGER' || roleName === 'TEAM_MANAGER') {
    navItems.push({ label: 'User Approvals', path: 'user-approvals' });
  }

  const handleLogout = () => {
    logout();
    navigate('/user-login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6" noWrap component="div">
            User Dashboard
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  '&.active': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                  },
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserDashboard;
