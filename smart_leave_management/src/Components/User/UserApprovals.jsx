import { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  CircularProgress,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import Swal from 'sweetalert2';
import {
  getAllUserLeaveRequests,
  approveUserLeave,
  rejectUserLeave,
} from '../ApiCenter/UserApi';

const UserApprovals = () => {
  const userId = sessionStorage.getItem('userId');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getAllUserLeaveRequests(userId);
      setRequests(res.data);
    } catch (error) {
      Swal.fire('Error', 'Failed to fetch leave requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  const handleAction = async (leaveId, requesterId, action) => {
    try {
      if (action === 'approve') {
        await approveUserLeave(userId, requesterId);
        Swal.fire('Approved', 'Leave request approved', 'success');
      } else {
        await rejectUserLeave(userId, requesterId);
        Swal.fire('Rejected', 'Leave request rejected', 'info');
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
    } else {
      return <Chip label="Pending" color="default" />;
    }
  };

  const getActionCell = (req) => {
    if (req.leaveStatus === 'PENDING') {
      return (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleAction(req.leaveId, req.userId, 'approve')}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleAction(req.leaveId, req.userId, 'reject')}
          >
            Reject
          </Button>
        </Stack>
      );
    } else if (req.leaveStatus === 'APPROVED') {
      return <Typography color="success.main">Approved</Typography>;
    } else if (req.leaveStatus === 'REJECTED') {
      return <Typography color="error.main">Rejected</Typography>;
    }
  };

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom align='center' sx={{ color: '#183c86',fontWeight: 'bold' }}>
        User Leave Approvals
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : requests.length === 0 ? (
        <Typography>No leave requests found.</Typography>
      ) : (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Employee Name</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Leave Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Approver</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((req) => (
                <TableRow key={req.leaveId}>
                  <TableCell>{req.userName}</TableCell>
                  <TableCell>{req.userRole}</TableCell>
                  <TableCell>{req.leaveType}</TableCell>
                  <TableCell>{req.startDate}</TableCell>
                  <TableCell>{req.endDate}</TableCell>
                  <TableCell>{req.duration}</TableCell>
                  <TableCell>{req.approver}</TableCell>
                  <TableCell>{getStatusChip(req.leaveStatus)}</TableCell>
                  <TableCell>{getActionCell(req)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default UserApprovals;
