import { useEffect, useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Divider,
} from '@mui/material';
import Swal from 'sweetalert2';
import { getAllUsers, promoteUser } from '../ApiCenter/AdminApi';

const rolePromotionMap = {
  TEAM_MEMBER: ['TEAM_LEAD', 'TEAM_MANAGER', 'HR_MANAGER'],
  TEAM_LEAD: ['TEAM_MANAGER', 'HR_MANAGER'],
  TEAM_MANAGER: ['HR_MANAGER'],
};

const AdminUserPromotion = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newRole, setNewRole] = useState('');
  const adminId = sessionStorage.getItem('adminId');

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      setUsers(res.data);
    } catch {
      Swal.fire('Error', 'Failed to fetch users', 'error');
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handlePromoteClick = (user) => {
    setSelectedUser(user);
    setNewRole('');
    setDialogOpen(true);
  };

  const handlePromoteConfirm = async () => {
    if (!newRole) {
      Swal.fire('Error', 'Please select a new role', 'error');
      return;
    }

    setLoading(true);
    try {
      await promoteUser(adminId, selectedUser.userId, newRole);
      Swal.fire('Success', 'User promoted successfully', 'success');
      setDialogOpen(false);
      fetchUsers();
    } catch {
      Swal.fire('Error', 'Promotion failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getAvailableRoles = (currentRole) => {
    return rolePromotionMap[currentRole] || [];
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      {/* Header Gradient Bar */}
      <Box
        sx={{
          background: 'linear-gradient(to right, #183c86, #5c6bc0)',
          borderRadius: 2,
          p: 2,
          mb: 3,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: 1,
          }}
        >
          User Promotion Panel
        </Typography>
      </Box>

      <Paper
        elevation={4}
        sx={{
          p: 4,
          borderRadius: 3,
          backgroundColor: '#fafafa',
        }}
      >
        <Typography
          variant="h6"
          gutterBottom
          align="center"
          sx={{ color: '#183c86', fontWeight: 'bold' }}
        >
          All Users
        </Typography>

        <Divider sx={{ mb: 2 }} />

        {loadingUsers ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Typography align="center" sx={{ color: 'gray' }}>
            No users found.
          </Typography>
        ) : (
          <List>
            {users.map((user) => {
              const currentRole = user.role?.roleName || user.userRole;
              return (
                <Paper
                  key={user.userId}
                  elevation={2}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    p: 2,
                    backgroundColor: '#fff',
                    '&:hover': {
                      boxShadow: 6,
                      transform: 'scale(1.01)',
                      transition: '0.2s ease-in-out',
                    },
                  }}
                >
                  <ListItem
                    divider
                    secondaryAction={
                      <Button
                        variant="contained"
                        onClick={() => handlePromoteClick(user)}
                        disabled={!getAvailableRoles(currentRole).length}
                        sx={{
                          background: 'linear-gradient(to right, #183c86, #5c6bc0)',
                          color: 'white',
                          '&:hover': {
                            background: 'linear-gradient(to right, #5c6bc0, #183c86)',
                          },
                        }}
                      >
                        Promote
                      </Button>
                    }
                  >
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#183c86' }}>
                          {user.firstName} {user.lastName} (ID: {user.userId})
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography variant="body2" color="text.secondary">
                            Email: {user.email} | Role: {currentRole}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Country: {user.countryName} | Gender: {user.gender}
                          </Typography>
                        </>
                      }
                    />
                  </ListItem>
                </Paper>
              );
            })}
          </List>
        )}
      </Paper>

      {/* Promotion Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            boxShadow: 8,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 'bold', color: '#183c86' }}>Promote User</DialogTitle>
        <DialogContent>
          <Typography gutterBottom sx={{ mb: 2 }}>
            Promote{' '}
            <strong>
              {selectedUser?.firstName} {selectedUser?.lastName}
            </strong>{' '}
            (ID: {selectedUser?.userId}) from{' '}
            <strong>{selectedUser?.role?.roleName || selectedUser?.userRole}</strong> to:
          </Typography>
          <Select
            fullWidth
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            displayEmpty
            sx={{
              mt: 1,
              borderRadius: 2,
            }}
          >
            <MenuItem value="" disabled>
              Select new role
            </MenuItem>
            {getAvailableRoles(selectedUser?.role?.roleName || selectedUser?.userRole).map((role) => (
              <MenuItem key={role} value={role}>
                {role}
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={loading} sx={{ color: '#5c6bc0' }}>
            Cancel
          </Button>
          <Button
            onClick={handlePromoteConfirm}
            variant="contained"
            disabled={loading}
            sx={{
              background: 'linear-gradient(to right, #183c86, #5c6bc0)',
              '&:hover': {
                background: 'linear-gradient(to right, #5c6bc0, #183c86)',
              },
            }}
          >
            {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUserPromotion;
