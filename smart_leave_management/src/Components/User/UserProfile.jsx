import { useEffect, useState } from 'react';
import {
  Typography,
  CircularProgress,
  Paper,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Avatar,
  Divider,
  Tooltip,
} from '@mui/material';
import { Edit, Delete, LockReset } from '@mui/icons-material';
import Swal from 'sweetalert2';
import {
  getUserDetails,
  updateUserDetails,
  deleteAccount,
  updatePassword,
  generateOtpForPassword,
  verifyOtpForPassword,
} from '../ApiCenter/UserApi';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [editData, setEditData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [openEmailDialog, setOpenEmailDialog] = useState(false);
  const [openOtpDialog, setOpenOtpDialog] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();

  // ✅ Fetch User Details
  const fetchUser = async () => {
    try {
      const res = await getUserDetails(userId);
      setUser(res.data);
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  // ✅ Profile Edit
  const handleOpenDialog = () => {
    setEditData(user);
    setOpenDialog(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await updateUserDetails(userId, editData);
      Swal.fire('Updated', 'Profile updated successfully', 'success');
      setOpenDialog(false);
      fetchUser();
    } catch {
      Swal.fire('Error', 'Failed to update profile', 'error');
    }
  };

  // ✅ Password Change
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Send OTP
  const handleEmailSubmit = async () => {
    if (!email) {
      Swal.fire('Error', 'Please enter your email', 'error');
      return;
    }
 
    setOtpLoading(true);
    try {
      await generateOtpForPassword({ email });
      Swal.fire('OTP Sent', 'Check your email for the OTP', 'success');
      setOpenEmailDialog(false);
      setOpenOtpDialog(true);
    } catch {
      Swal.fire('Error', 'Failed to generate OTP', 'error');
    } finally {
      setOtpLoading(false);
    }
  };
 
 
  const handleOtpSubmit = async () => {
    if (!otp) {
      Swal.fire('Error', 'Please enter the OTP', 'error');
      return;
    }
 
    setOtpLoading(true);
    try {
      await verifyOtpForPassword({ otp });
      Swal.fire('Verified', 'OTP verified successfully', 'success');
      setOpenOtpDialog(false);
      setOpenPasswordDialog(true);
    } catch {
      Swal.fire('Error', 'Invalid OTP', 'error');
    } finally {
      setOtpLoading(false);
    }
  };
 

  // ✅ Update Password
  const handlePasswordUpdate = async () => {
    const { oldPassword, newPassword } = passwordData;
    if (!oldPassword || !newPassword) {
      Swal.fire('Error', 'Please fill in both password fields', 'error');
      return;
    }
    try {
      await updatePassword(userId, passwordData);
      Swal.fire('Success', 'Password updated successfully', 'success');
      setOpenPasswordDialog(false);
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch {
      Swal.fire('Error', 'Failed to update password', 'error');
    }
  };

  // ✅ Delete Account
  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will permanently delete your account.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
    });

    if (confirm.isConfirmed) {
      try {
        await deleteAccount(userId);
        Swal.fire('Deleted', 'Your account has been deleted.', 'success');
        sessionStorage.clear();
        navigate('/user-login');
      } catch {
        Swal.fire('Error', 'Failed to delete account', 'error');
      }
    }
  };

  if (!user) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  const firstLetter = user.firstName?.charAt(0)?.toUpperCase() || 'U';

  // ✅ UI Layout
  return (
    <Paper
      elevation={3}
      sx={{
        p: 4,
        borderRadius: 4,
        background: 'linear-gradient(180deg, #ffffff 0%, #f7f9fc 100%)',
        boxShadow: '0px 4px 15px rgba(0,0,0,0.08)',
        animation: 'fadeIn 0.6s ease-in-out',
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateY(15px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Avatar
          sx={{
            bgcolor: '#0288d1',
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 1,
            fontSize: 32,
          }}
        >
          {firstLetter}
        </Avatar>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#183c86' }}>
          {user.firstName} {user.lastName}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user.userName}
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Email:</strong> {user.email}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Phone:</strong> {user.phoneNumber}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Gender:</strong> {user.gender}</Typography>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography><strong>Country:</strong> {user.countryName}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography><strong>Address:</strong> {user.address}</Typography>
        </Grid>
      </Grid>

      {/* 🔘 Action Buttons */}
      <Box
        sx={{
          mt: 4,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          justifyContent: 'center',
        }}
      >
        <Tooltip title="Edit Profile">
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={handleOpenDialog}
          >
            Update Profile
          </Button>
        </Tooltip>

        <Tooltip title="Change Password">
          <Button
            variant="outlined"
            startIcon={<LockReset />}
            onClick={() => setOpenEmailDialog(true)}
          >
            Change Password
          </Button>
        </Tooltip>

        <Tooltip title="Delete Account">
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={handleDelete}
          >
            Delete Account
          </Button>
        </Tooltip>
      </Box>

      {/* ✏️ Edit Profile Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="First Name" name="firstName" value={editData.firstName || ''} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Last Name" name="lastName" value={editData.lastName || ''} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Email" name="email" value={editData.email || ''} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Phone Number" name="phoneNumber" value={editData.phoneNumber || ''} onChange={handleChange} margin="normal" />
          <TextField fullWidth label="Address" name="address" value={editData.address || ''} onChange={handleChange} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* ✉️ Email Dialog */}
      <Dialog open={openEmailDialog} onClose={() => setOpenEmailDialog(false)}>
        <DialogTitle>Enter Email to Receive OTP</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEmailDialog(false)}>Cancel</Button>
          <Button onClick={handleEmailSubmit} variant="contained" disabled={otpLoading}>
  {otpLoading ? <CircularProgress size={24} color="inherit" /> : 'Send OTP'}
</Button>
 
        </DialogActions>
      </Dialog>

      {/* 🔢 OTP Dialog */}
      <Dialog open={openOtpDialog} onClose={() => setOpenOtpDialog(false)}>
        <DialogTitle>Enter OTP</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenOtpDialog(false)}>Cancel</Button>
          <Button onClick={handleOtpSubmit} variant="contained" disabled={otpLoading}>
  {otpLoading ? <CircularProgress size={24} color="inherit" /> : 'Verify OTP'}
</Button>
 
        </DialogActions>
      </Dialog>

      {/* 🔐 Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={() => setOpenPasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Old Password"
            name="oldPassword"
            type="password"
            value={passwordData.oldPassword}
            onChange={handlePasswordChange}
            margin="normal"
          />
          <TextField
            fullWidth
            label="New Password"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenPasswordDialog(false)}>Cancel</Button>
          <Button onClick={handlePasswordUpdate} variant="contained">Update</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default UserProfile;
