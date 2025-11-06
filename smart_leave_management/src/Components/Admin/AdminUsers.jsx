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
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom align='center' sx={{ color: '#183c86',fontWeight: 'bold' }}>
          All Users
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : users.length === 0 ? (
          <Typography>No users found.</Typography>
        ) : (
          <List>
            {users.map((user) => (
              <ListItem
                key={user.userId}
                divider
                secondaryAction={
                  <IconButton edge="end" onClick={() => handleDelete(user.userId)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <ListItemText
                  primary={`${user.firstName} ${user.lastName}`}
                  secondary={
                    <>
                      Email: {user.email} | Role: {user.role?.roleName || user.userRole}
                      <br />
                      Country: {user.countryName} | Gender: {user.gender}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default AdminUsers;
