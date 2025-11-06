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
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom align='center' sx={{ color: '#183c86',fontWeight: 'bold' }}>All Users</Typography>
        {loadingUsers ? (
          <CircularProgress />
        ) : users.length === 0 ? (
          <Typography>No users found.</Typography>
        ) : (
          <List>
            {users.map((user) => {
              const currentRole = user.role?.roleName || user.userRole;
              return (
                <ListItem
                  key={user.userId}
                  divider
                  secondaryAction={
                    <Button
                      variant="outlined"
                      onClick={() => handlePromoteClick(user)}
                      disabled={!getAvailableRoles(currentRole).length}
                    >
                      Promote
                    </Button>
                  }
                >
                  <ListItemText
                    primary={`${user.firstName} ${user.lastName} (ID: ${user.userId})`}
                    secondary={
                      <>
                        Email: {user.email} | Role: {currentRole}
                        <br />
                        Country: {user.countryName} | Gender: {user.gender}
                      </>
                    }
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Promote User</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Promote <strong>{selectedUser?.firstName} {selectedUser?.lastName}</strong> (ID: {selectedUser?.userId}) from <strong>{selectedUser?.role?.roleName || selectedUser?.userRole}</strong> to:
          </Typography>
          <Select
            fullWidth
            value={newRole}
            onChange={(e) => setNewRole(e.target.value)}
            displayEmpty
          >
            <MenuItem value="" disabled>Select new role</MenuItem>
            {getAvailableRoles(selectedUser?.role?.roleName || selectedUser?.userRole).map((role) => (
              <MenuItem key={role} value={role}>{role}</MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handlePromoteConfirm} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={20} /> : 'Confirm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUserPromotion;
