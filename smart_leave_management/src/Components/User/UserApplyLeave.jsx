import { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
  Box,
} from '@mui/material';
import {
  applyLeave,
  calculateLeaveDuration,
  getUserLeaveBalance,
} from '../ApiCenter/UserApi';
import Swal from 'sweetalert2';

const leaveTypes = [
  { key: 'sickLeave', label: 'SICK' },
  { key: 'casualLeave', label: 'CASUAL' },
  { key: 'earnedLeave', label: 'EARNED' },
  { key: 'maternityLeave', label: 'MATERNITY' },
  { key: 'paternityLeave', label: 'PATERNITY' },
];

const UserApplyLeave = () => {
  const userId = sessionStorage.getItem('userId');
  const [formData, setFormData] = useState({
    leaveType: '',
    startDate: '',
    endDate: '',
    comments: '',
  });
  const [duration, setDuration] = useState(null);
  const [leaveBalance, setLeaveBalance] = useState({});
  const [loading, setLoading] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [dateErrorMessage, setDateErrorMessage] = useState('');
  const [balanceError, setBalanceError] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await getUserLeaveBalance(userId);
        setLeaveBalance(res.data[0]);
      } catch {
        setLeaveBalance({});
      }
    };
    fetchBalance();
  }, [userId]);

  useEffect(() => {
    const { startDate, endDate } = formData;
    if (startDate && endDate) {
      const calculate = async () => {
        try {
          const res = await calculateLeaveDuration(userId, startDate, endDate);
          setDuration(res.data);
          setDateError(false);
          setDateErrorMessage('');
        } catch (error) {
          setDuration(null);
          setDateError(true);
          const message =
            error.response?.data || 'Failed to calculate duration. Please check your dates.';
          setDateErrorMessage(message);
        }
      };
      calculate();
    } else {
      setDuration(null);
      setDateError(false);
      setDateErrorMessage('');
    }
  }, [formData.startDate, formData.endDate, userId]);

  useEffect(() => {
    if (
      formData.leaveType &&
      duration !== null &&
      leaveBalance &&
      leaveBalance[`${formData.leaveType.toLowerCase()}Leave`] !== undefined
    ) {
      const available = leaveBalance[`${formData.leaveType.toLowerCase()}Leave`];
      setBalanceError(duration > available);
    } else {
      setBalanceError(false);
    }
  }, [formData.leaveType, duration, leaveBalance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const isFormValid = () =>
    formData.leaveType &&
    formData.startDate &&
    formData.endDate &&
    formData.comments.trim() &&
    !dateError &&
    !balanceError;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const leaveApplicationForm = {
        startDate: formData.startDate,
        endDate: formData.endDate,
        leaveType: formData.leaveType,
        comments: formData.comments,
        duration,
      };
      await applyLeave(userId, leaveApplicationForm);
      Swal.fire('Success', 'Leave applied successfully', 'success');
      setFormData({
        leaveType: '',
        startDate: '',
        endDate: '',
        comments: '',
      });
      setDuration(null);
    } catch {
      Swal.fire('Error', 'Failed to apply leave', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Box
        sx={{
          background: 'linear-gradient(to right, #183c86, #5c6bc0)',
          borderRadius: 2,
          p: 2,
          mb: 3,
        }}
      >
      <Typography
        variant="h5"
        align="center"
        gutterBottom
        sx={{ color: '#fff', fontWeight: 'bold' }}
      >
        Apply for leave
      </Typography></Box>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          fullWidth
          label="Leave Type"
          name="leaveType"
          value={formData.leaveType}
          onChange={handleChange}
          margin="normal"
          required
        >
          {leaveTypes.map(({ key, label }) => (
            <MenuItem key={label} value={label}>
              {label} ({leaveBalance[key] ?? 0} days left)
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          type="date"
          label="Start Date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          error={dateError}
          helperText={dateError ? dateErrorMessage : ''}
        />
        <TextField
          fullWidth
          type="date"
          label="End Date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          margin="normal"
          InputLabelProps={{ shrink: true }}
          required
          error={dateError}
          helperText={dateError ? dateErrorMessage : ''}
        />

        {duration !== null && !dateError && (
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">
              Duration: {duration} day{duration > 1 ? 's' : ''}
            </Typography>
          </Box>
        )}

        {balanceError && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            Insufficient leave balance for selected type.
          </Typography>
        )}

        <TextField
          fullWidth
          label="Comments"
          name="comments"
          value={formData.comments}
          onChange={handleChange}
          margin="normal"
          required
        />

        <Button
          type="submit"
          variant="contained"
          sx={{ mt: 2 }}
          disabled={!isFormValid() || loading}
        >
          {loading ? <CircularProgress size={24} /> : 'Apply Leave'}
        </Button>
      </form>
    </Paper>
  );
};

export default UserApplyLeave;
