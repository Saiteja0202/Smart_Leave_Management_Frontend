import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Paper,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';
import { getAdminDetails, updateAdminDetails } from '../ApiCenter/AdminApi';

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);
  const [editData, setEditData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const adminId = sessionStorage.getItem('adminId');

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await getAdminDetails(adminId);
        setAdminData(response.data);
        setEditData(response.data);
      } catch (err) {
        setError('Failed to load admin profile.');
      } finally {
        setLoading(false);
      }
    };

    if (adminId) {
      fetchAdminDetails();
    } else {
      setError('Admin ID not found in session.');
      setLoading(false);
    }
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateAdminDetails(adminId, editData);
      setAdminData(editData);
      setOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Profile Updated',
        text: 'Your changes have been saved.',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch {
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="body1" color="error" align="center" sx={{ mt: 5 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h5" align='center' sx={{ color: '#183c86',fontWeight: 'bold' }}>Admin Profile</Typography>
          <IconButton onClick={() => setOpen(true)} color="primary">
            <EditIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Typography variant="subtitle1" gutterBottom>Personal Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>First Name:</strong> {adminData.firstName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Last Name:</strong> {adminData.lastName}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Gender:</strong> {adminData.gender}</Typography>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>Contact Information</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Email:</strong> {adminData.email}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Phone:</strong> {adminData.phoneNumber}</Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography><strong>Address:</strong> {adminData.address}</Typography>
          </Grid>
        </Grid>

        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>Account</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Username:</strong> {adminData.userName}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* Update Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Update Profile</DialogTitle>
        <DialogContent>
          <TextField fullWidth margin="normal" label="Username" name="userName" value={editData.userName || ''} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Email" name="email" type="email" value={editData.email || ''} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="First Name" name="firstName" value={editData.firstName || ''} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Last Name" name="lastName" value={editData.lastName || ''} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Phone Number" name="phoneNumber" value={editData.phoneNumber || ''} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Gender" name="gender" value={editData.gender || ''} onChange={handleChange} />
          <TextField fullWidth margin="normal" label="Address" name="address" value={editData.address || ''} onChange={handleChange} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProfile;
