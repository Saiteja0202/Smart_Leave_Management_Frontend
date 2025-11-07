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
  Avatar,
} from '@mui/material';
import {
  Dashboard,
  Person,
  CalendarToday,
  Assignment,
  Groups,
  BarChart,
  Policy,
  Upgrade,
  Logout,
  History,
} from '@mui/icons-material';
import { logout } from '../ApiCenter/AuthUtils';

const drawerWidth = 240;

const navItems = [
  { label: 'Profile', path: 'profile', icon: <Person /> },
  { label: 'Add Calendar', path: 'add-calendar', icon: <CalendarToday /> },
  { label: 'Add Roles', path: 'add-roles', icon: <Assignment /> },
  { label: 'Add Leave Policies', path: 'leave-policies', icon: <Policy /> },
  { label: 'User Promotion', path: 'user-promotion', icon: <Upgrade /> },
  { label: 'Users', path: 'users', icon: <Groups /> },
  { label: 'Leave Requests', path: 'leave-requests', icon: <Assignment /> },
  { label: 'Reports', path: 'reports', icon: <BarChart /> },
  {label:'Registration History', path:'registration-history', icon: <History />},
];

const AdminDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
          boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
        }}
      >
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Dashboard sx={{ fontSize: 28 }} />
            <Typography variant="h6" noWrap component="div">
              Admin Dashboard
            </Typography>
          </Box>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<Logout />}
            onClick={handleLogout}
            sx={{
              textTransform: 'none',
              borderRadius: 2,
              backgroundColor: '#fff',
              color: '#1976d2',
              '&:hover': {
                backgroundColor: '#e3f2fd',
              },
            }}
          >
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
            backgroundColor: '#f5f7fb',
            borderRight: '1px solid #e0e0e0',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto', p: 1 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 2,
              mt: 1,
            }}
          >
            <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56, mb: 1 }}>
            </Avatar>
            <Typography variant="subtitle1" fontWeight="bold">
              Admin
            </Typography>
          </Box>
          <List>
            {navItems.map((item) => (
              <ListItem
                button
                key={item.path}
                component={NavLink}
                to={item.path}
                sx={{
                  my: 0.5,
                  mx: 1,
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  color: '#333',
                  '&:hover': {
                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                  },
                  '&.active': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '& svg': { color: 'white' },
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  {item.icon}
                  <ListItemText primary={item.label} />
                </Box>
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
          backgroundColor: '#f7f9fc',
          minHeight: '100vh',
          '@keyframes fadeIn': {
            from: { opacity: 0, transform: 'translateY(10px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }}
      >
        <Toolbar />
        <Box
          sx={{
            p: 3,
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: 2,
            animation: 'fadeIn 0.5s ease-in-out',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
