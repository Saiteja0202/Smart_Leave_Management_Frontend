import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '../ApiCenter/AdminApi';
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from 'sweetalert2';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminId = sessionStorage.getItem('adminId');

  const fetchUsers = async () => {
    try {
      const response = await getAllUsers();
      setUsers(response.data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (userId) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete the user.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      confirmButtonColor: '#d33',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteUser(adminId, userId);
        Swal.fire('Deleted!', 'User has been deleted.', 'success');
        fetchUsers();
      } catch {
        Swal.fire('Error', 'Failed to delete user.', 'error');
      }
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      {/* Header Gradient */}
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
          Manage Users
        </Typography>
      </Box>

      {/* Main Section */}
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

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
            <CircularProgress />
          </Box>
        ) : users.length === 0 ? (
          <Typography align="center" sx={{ color: 'gray' }}>
            No users found.
          </Typography>
        ) : (
          <List>
            {users.map((user) => (
              <Paper
                key={user.userId}
                elevation={2}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#fff',
                  transition: '0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'scale(1.01)',
                  },
                }}
              >
                <ListItem
                  divider
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => handleDelete(user.userId)}
                      sx={{
                        color: '#d32f2f',
                        '&:hover': { color: '#b71c1c', transform: 'scale(1.2)' },
                        transition: '0.2s ease',
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
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
                          Email: {user.email} | Role: {user.role?.roleName || user.userRole}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Country: {user.countryName} | Gender: {user.gender}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default AdminUsers;
