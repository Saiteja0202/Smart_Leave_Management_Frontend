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
  Chip,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material';
import Swal from 'sweetalert2';
import { getAllLeaveRequests, approveLeave, rejectLeave } from '../ApiCenter/AdminApi';

const AdminLeaveRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveTypeFilter, setLeaveTypeFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const adminId = sessionStorage.getItem('adminId');

  const fetchRequests = async () => {
    try {
      const response = await getAllLeaveRequests(adminId);
      setRequests(response.data);
      setFilteredRequests(response.data);
    } catch {
      setRequests([]);
      setFilteredRequests([]);
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
        Swal.fire('Approved', 'Leave approved successfully', 'success');
      } else {
        await rejectLeave(adminId, leaveId);
        Swal.fire('Rejected', 'Leave rejected successfully', 'info');
      }
      
      fetchRequests();
    } catch {
      Swal.fire('Error', 'Action failed. Try again later.', 'error');
    }
  };

  const getStatusChip = (status) => {
    switch (status) {
      case 'APPROVED':
        return <Chip label="Approved" color="success" />;
      case 'REJECTED':
        return <Chip label="Rejected" color="error" />;
      case 'CANCELED' :
        return <Chip label="Canceled"  color='warning'/>
      default:
        return <Chip label="Pending" color="default" />;
        
    }
  };

  const handleFilterChange = (type, value) => {
    if (type === 'leaveType') setLeaveTypeFilter(value);
    else setStatusFilter(value);
  };

  useEffect(() => {
    let filtered = [...requests];

    if (leaveTypeFilter !== 'ALL') {
      filtered = filtered.filter((r) => r.leaveType === leaveTypeFilter);
    }

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((r) => r.leaveStatus === statusFilter);
    }

    setFilteredRequests(filtered);
  }, [leaveTypeFilter, statusFilter, requests]);

  const leaveTypes = [...new Set(requests.map((r) => r.leaveType))];
  const statuses = ['PENDING', 'APPROVED', 'REJECTED', 'CANCELED'];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 6 }}>
      <Box
        sx={{
          background: 'linear-gradient(to right, #183c86, #5c6bc0)',
          borderRadius: 2,
          p: 2,
          mb: 3,
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: 'bold',
            color: 'white',
            letterSpacing: 1,
          }}
        >
          Leave Requests Management
        </Typography>
      </Box>

      <Paper elevation={4} sx={{ p: 4, borderRadius: 3, backgroundColor: '#fafafa' }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            justifyContent: 'center',
            mb: 3,
          }}
        >
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Leave Type</InputLabel>
            <Select
              value={leaveTypeFilter}
              label="Leave Type"
              onChange={(e) => handleFilterChange('leaveType', e.target.value)}
            >
              <MenuItem value="ALL">All</MenuItem>
              {leaveTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <MenuItem value="ALL">All</MenuItem>
              {statuses.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="150px">
            <CircularProgress />
          </Box>
        ) : filteredRequests.length === 0 ? (
          <Typography align="center" sx={{ color: 'gray' }}>
            No leave requests found.
          </Typography>
        ) : (
          <List>
            {filteredRequests.map((req) => (
              <Paper
                key={req.leaveId}
                elevation={2}
                sx={{
                  mb: 2,
                  borderRadius: 2,
                  p: 2,
                  backgroundColor: '#fff',
                  transition: '0.2s ease-in-out',
                  '&:hover': {
                    boxShadow: 6,
                    transform: 'scale(1.01)',
                  },
                }}
              >
                <ListItem
                  divider
                  secondaryAction={
                    <Stack direction="row" spacing={1}>
                      {req.leaveStatus === 'PENDING' ? (
                        <>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            onClick={() => handleAction(req.leaveId, 'approve')}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            onClick={() => handleAction(req.leaveId, 'reject')}
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        getStatusChip(req.leaveStatus)
                      )}
                    </Stack>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#183c86' }}>
                        {req.userName} (ID: {req.userId}) — {req.userRole}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          Leave Type: {req.leaveType} ({req.leaveTypePlannedAndUnplanned})
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Duration: {req.duration} day(s)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          From: {req.startDate} To: {req.endDate}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Approver: {req.approver}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
              </Paper>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default AdminLeaveRequests;
