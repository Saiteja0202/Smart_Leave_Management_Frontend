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
} from '@mui/material';
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
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
  });

  const userId = sessionStorage.getItem('userId');
  const navigate = useNavigate();

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

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmailSubmit = async () => {
    if (!email) {
      Swal.fire('Error', 'Please enter your email', 'error');
      return;
    }

    try {
      await generateOtpForPassword(email);
      Swal.fire('OTP Sent', 'Check your email for the OTP', 'success');
      setOpenEmailDialog(false);
      setOpenOtpDialog(true);
    } catch {
      Swal.fire('Error', 'Failed to generate OTP', 'error');
    }
  };

  const handleOtpSubmit = async () => {
    if (!otp) {
      Swal.fire('Error', 'Please enter the OTP', 'error');
      return;
    }

    try {
      await verifyOtpForPassword(otp);
      Swal.fire('Verified', 'OTP verified successfully', 'success');
      setOpenOtpDialog(false);
      setOpenPasswordDialog(true);
    } catch {
      Swal.fire('Error', 'Invalid OTP', 'error');
    }
  };

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

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom align='center' sx={{ color: '#183c86',fontWeight: 'bold' }}>User Profile</Typography>
      {!user ? (
        <CircularProgress />
      ) : (
        <Box>
          <Typography>Name: {user.firstName} {user.lastName}</Typography>
          <Typography>Email: {user.email}</Typography>
          <Typography>Username: {user.userName}</Typography>
          <Typography>Phone: {user.phoneNumber}</Typography>
          <Typography>Gender: {user.gender}</Typography>
          <Typography>Country: {user.countryName}</Typography>
          <Typography>Address: {user.address}</Typography>

          <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
            <Button variant="contained" onClick={handleOpenDialog}>Update Profile</Button>
            <Button variant="outlined" onClick={() => setOpenEmailDialog(true)}>Change Password</Button>
            <Button variant="outlined" color="error" onClick={handleDelete}>Delete Account</Button>
          </Box>
        </Box>
      )}

      {/* Update Profile Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Update Profile</DialogTitle>
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

      {/* Email Dialog */}
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
          <Button onClick={handleEmailSubmit} variant="contained">Send OTP</Button>
        </DialogActions>
      </Dialog>

      {/* OTP Dialog */}
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
          <Button onClick={handleOtpSubmit} variant="contained">Verify OTP</Button>
        </DialogActions>
      </Dialog>

      {/* Password Dialog */}
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
