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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const [statusFilter, setStatusFilter] = useState('ALL');
  const [typeFilter, setTypeFilter] = useState('ALL');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await getAllUserLeaveRequests(userId);
      console.log("Fetched Leave Requests:", res.data); // 👀 See structure
      setRequests(res.data);
      setFilteredRequests(res.data);
    } catch {
      Swal.fire('Error', 'Failed to fetch leave requests', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [userId]);

  useEffect(() => {
    let filtered = [...requests];

    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((req) => req.leaveStatus === statusFilter);
    }
    if (typeFilter !== 'ALL') {
      filtered = filtered.filter(
        (req) => req.leaveType?.trim().toLowerCase() === typeFilter.toLowerCase()
      );
    }

    setFilteredRequests(filtered);
  }, [statusFilter, typeFilter, requests]);

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
    switch (status) {
      case 'APPROVED':
        return <Chip label="Approved" color="success" variant="outlined" />;
      case 'REJECTED':
        return <Chip label="Rejected" color="error" variant="outlined" />;
      case 'CANCELED':
        return <Chip label="Cancelled" color="warning" variant="outlined" />;
      default:
        return <Chip label="Pending" color="default" variant="outlined" />;
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
            onClick={() => handleAction(req.leaveId, req.user?.userId || req.userId, 'approve')}
            sx={{ textTransform: 'none' }}
          >
            Approve
          </Button>
          <Button
            variant="outlined"
            color="error"
            size="small"
            onClick={() => handleAction(req.leaveId, req.user?.userId || req.userId, 'reject')}
            sx={{ textTransform: 'none' }}
          >
            Reject
          </Button>
        </Stack>
      );
    } else {
      return getStatusChip(req.leaveStatus);
    }
  };

  const uniqueLeaveTypes = [
    'ALL',
    ...Array.from(
      new Set(
        requests
          .map((req) => req.leaveType?.trim().toLowerCase())
          .filter((type) => type && type.length > 0)
      )
    ).map((type) => type.charAt(0).toUpperCase() + type.slice(1)),
  ];

  return (
    <Paper sx={{ p: 4, boxShadow: 3, borderRadius: 3 }}>
      {/* Header */}
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
          User Leave Approvals
        </Typography>
      </Box>

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
            <MenuItem value="ALL">ALL</MenuItem>
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

      {/* Table Section */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : filteredRequests.length === 0 ? (
        <Typography align="center" sx={{ mt: 2 }}>
          No leave requests found.
        </Typography>
      ) : (
        <TableContainer sx={{ mt: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                {[
                  'Employee Name',
                  'Role',
                  'Leave Type',
                  'Start Date',
                  'End Date',
                  'Duration',
                  'Approver',
                  'Status',
                  'Actions',
                ].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 'bold', color: '#183c86' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((req, index) => {
                const employeeName =
                  req.user?.firstName && req.user?.lastName
                    ? `${req.user.firstName} ${req.user.lastName}`
                    : req.user?.userName || req.userName || 'N/A';

                const employeeRole = req.user?.role || req.userRole || 'N/A';

                return (
                  <TableRow
                    key={req.leaveId}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f9f9fc' : '#ffffff',
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    <TableCell>{employeeName}</TableCell>
                    <TableCell>{employeeRole}</TableCell>
                    <TableCell>{req.leaveType}</TableCell>
                    <TableCell>{req.startDate}</TableCell>
                    <TableCell>{req.endDate}</TableCell>
                    <TableCell>{req.duration}</TableCell>
                    <TableCell>{req.approver}</TableCell>
                    <TableCell>{getStatusChip(req.leaveStatus)}</TableCell>
                    <TableCell>{getActionCell(req)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Paper>
  );
};

export default UserApprovals;
