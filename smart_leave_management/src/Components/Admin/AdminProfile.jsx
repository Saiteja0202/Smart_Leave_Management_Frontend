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
  Avatar,
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
        text: 'Your changes have been saved successfully.',
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

  const firstLetter = adminData?.firstName?.charAt(0)?.toUpperCase() || 'A';
  const fullName = `${adminData.firstName || ''} ${adminData.lastName || ''}`.trim();

  return (
    <Container maxWidth="md">
      <Paper
        elevation={4}
        sx={{
          p: 4,
          mt: 5,
          borderRadius: 3,
          boxShadow: '0px 3px 8px rgba(0,0,0,0.1)',
          backgroundColor: '#fff',
        }}
      >
        {/* 🧑‍💼 Profile Header */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            mb: 3,
          }}
        >
          <Avatar
            sx={{
              bgcolor: '#0288d1',
              width: 80,
              height: 80,
              fontSize: 32,
              mb: 1,
            }}
          >
            {firstLetter}
          </Avatar>

          <Typography variant="h5" sx={{ color: '#183c86', fontWeight: 'bold' }}>
            {fullName || 'Admin'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Administrator
          </Typography>

          <IconButton
            color="primary"
            sx={{ mt: 1 }}
            onClick={() => setOpen(true)}
            title="Edit Profile"
          >
            <EditIcon />
          </IconButton>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* 👤 Personal Info */}
        <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', color: '#0288d1' }}>
          Personal Information
        </Typography>
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

        {/* 📞 Contact Info */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, fontWeight: 'bold', color: '#0288d1' }}>
          Contact Information
        </Typography>
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

        {/* 🔐 Account Info */}
        <Typography variant="subtitle1" gutterBottom sx={{ mt: 3, fontWeight: 'bold', color: '#0288d1' }}>
          Account Details
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography><strong>Username:</strong> {adminData.userName}</Typography>
          </Grid>
        </Grid>
      </Paper>

      {/* ✏️ Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
        <DialogTitle>Edit Profile</DialogTitle>
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
          <Button variant="contained" onClick={handleUpdate}>Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminProfile;
