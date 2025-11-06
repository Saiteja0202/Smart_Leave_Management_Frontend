import { useEffect, useState } from 'react';
import { getUserLeaveRequests, cancelLeave } from '../ApiCenter/UserApi';
import {
  Paper,
  Typography,
  CircularProgress,
  Chip,
  Button,
  Box,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import Swal from 'sweetalert2';

const UserLeaveRequests = () => {
  const userId = sessionStorage.getItem('userId');
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getUserLeaveRequests(userId);
      const cleanedData = res.data.map((req) => ({
        ...req,
        leaveType: req.leaveType?.trim(),
        leaveStatus: req.leaveStatus?.trim(),
      }));
      setRequests(cleanedData);
      setFilteredRequests(cleanedData);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  // Apply filters whenever filters or requests change
  useEffect(() => {
    let filtered = [...requests];

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((req) => req.leaveStatus === statusFilter);
    }
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter((req) => req.leaveType === typeFilter);
    }

    setFilteredRequests(filtered);
  }, [statusFilter, typeFilter, requests]);

  const handleCancel = async (leaveId) => {
    const confirm = await Swal.fire({
      title: 'Cancel Leave Request?',
      text: 'This action cannot be undone.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, cancel it',
    });

    if (confirm.isConfirmed) {
      try {
        await cancelLeave(userId, leaveId);
        Swal.fire('Cancelled', 'Your leave request has been cancelled.', 'success');
        fetchRequests();
      } catch {
        Swal.fire('Error', 'Failed to cancel leave request.', 'error');
      }
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Chip label="Approved" color="success" />;
      case 'REJECTED':
        return <Chip label="Rejected" color="error" />;
      case 'CANCELED':
        return <Chip label="Cancelled" color="warning" />;
      default:
        return <Chip label="Pending" color="default" />;
    }
  };

  // 🔍 Get all unique leave types dynamically
  const uniqueLeaveTypes = [
    'ALL',
    ...Array.from(
      new Set(
        requests
          .map((req) => req.leaveType?.trim())
          .filter(Boolean)
      )
    ).sort(),
  ];

  return (
    <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 3 }}>
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
          My Leave Requests
        </Typography>
      </Box>

      {/* 🔽 Filters Section */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ mb: 3, justifyContent: 'center' }}
      >
        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Status</InputLabel>
          <Select
            value={statusFilter}
            label="Status"
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value="ALL">All</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="APPROVED">Approved</MenuItem>
            <MenuItem value="REJECTED">Rejected</MenuItem>
            <MenuItem value="CANCELED">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 180 }}>
          <InputLabel>Leave Type</InputLabel>
          <Select
            value={typeFilter}
            label="Leave Type"
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {uniqueLeaveTypes.map((type) => (
              <MenuItem key={type} value={type}>
                {type}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredRequests.length === 0 ? (
        <Typography align="center" sx={{ mt: 2 }}>
          No leave requests found.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {filteredRequests.map((req) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={req.leaveId}>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 2,
                  backgroundColor: '#f9f9fc',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  height: '100%',
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ fontWeight: 'bold', color: '#0288d1' }}
                >
                  {req.leaveType} ({req.leaveTypePlannedAndUnplanned})
                </Typography>

                <Divider />

                <Typography variant="body2">
                  <strong>From:</strong> {req.startDate} &nbsp; <strong>To:</strong>{' '}
                  {req.endDate}
                </Typography>
                <Typography variant="body2">
                  <strong>Duration:</strong> {req.duration} day(s)
                </Typography>
                
                <Typography variant="body2">
                  <strong>Approver:</strong> {req.approver}
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 'auto',
                  }}
                >
                  {getStatusChip(req.leaveStatus)}
                  {req.leaveStatus === 'PENDING' && (
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      onClick={() => handleCancel(req.leaveId)}
                    >
                      Cancel
                    </Button>
                  )}
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </Paper>
  );
};

export default UserLeaveRequests;
