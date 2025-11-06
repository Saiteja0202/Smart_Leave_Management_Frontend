import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Button,
  Stack,
  Chip
} from '@mui/material';
import Swal from 'sweetalert2';
import { getAllLeaveRequests, approveLeave, rejectLeave } from '../ApiCenter/AdminApi';

const AdminLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminId = sessionStorage.getItem('adminId');

  const fetchRequests = async () => {
    try {
      const response = await getAllLeaveRequests(adminId);
      setRequests(response.data);
    } catch {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (leaveId, action) => {
    try {
      if (action === 'approve') {
        await approveLeave(adminId, leaveId);
        Swal.fire('Approved', 'Leave approved', 'success');
      } else {
        await rejectLeave(adminId, leaveId);
        Swal.fire('Rejected', 'Leave rejected', 'info');
      }
      fetchRequests();
    } catch {
      Swal.fire('Error', 'Action failed', 'error');
    }
  };

  const getStatusChip = (status) => {
    if (status === 'APPROVED') {
      return <Chip label="Approved" color="success" />;
    } else if (status === 'REJECTED') {
      return <Chip label="Rejected" color="error" />;
    }
    else if (status === 'CANCELED') {
      return <Chip label="Canceled" color="warning" />;
    }
    else {
      return <Chip label="Pending" color="default" />;
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom align='center' sx={{ color: '#183c86',fontWeight: 'bold' }}>Leave Requests</Typography>
        {loading ? (
          <CircularProgress />
        ) : requests.length === 0 ? (
          <Typography>No leave requests found.</Typography>
        ) : (
          <List>
            {requests.map((req) => (
              <ListItem key={req.leaveId} divider>
                <ListItemText
                  primary={`User: ${req.userName} (ID: ${req.userId}) | Role: ${req.userRole}`}
                  secondary={
                    <>
                      Leave Type: {req.leaveType} ({req.leaveTypePlannedAndUnplanned}) | Duration: {req.duration} day(s)
                      <br />
                      From: {req.startDate} To: {req.endDate}
                      <br />
                      Approver: {req.approver}
                    </>
                  }
                />
                <Stack direction="row" spacing={1}>
                  {req.leaveStatus === 'PENDING' ? (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleAction(req.leaveId, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleAction(req.leaveId, 'reject')}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    getStatusChip(req.leaveStatus)
                  )}
                </Stack>
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default AdminLeaveRequests;
