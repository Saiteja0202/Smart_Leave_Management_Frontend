import { useEffect, useState } from 'react';
import { getUserLeaveRequests, cancelLeave } from '../ApiCenter/UserApi';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Chip,
  Button,
  Box,
} from '@mui/material';
import Swal from 'sweetalert2';

const UserLeaveRequests = () => {
  const userId = sessionStorage.getItem('userId');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await getUserLeaveRequests(userId);
      setRequests(res.data);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

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
        fetchRequests(); // refresh list
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

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom align='center' sx={{ color: '#183c86',fontWeight: 'bold' }}>My Leave Requests</Typography>
      {loading ? (
        <CircularProgress />
      ) : requests.length === 0 ? (
        <Typography>No leave requests found.</Typography>
      ) : (
        <List>
          {requests.map((req) => (
            <ListItem key={req.leaveId} divider>
              <ListItemText
                primary={`Type: ${req.leaveType} (${req.leaveTypePlannedAndUnplanned})`}
                secondary={
                  <>
                    From: {req.startDate} To: {req.endDate} | Duration: {req.duration} day(s)
                    <br />
                    Reason: {req.reason} | Approver: {req.approver}
                  </>
                }
              />
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default UserLeaveRequests;
