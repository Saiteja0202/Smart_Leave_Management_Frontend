import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
} from '@mui/material';
import Swal from 'sweetalert2';
import { getAllUsers, getAllLeaveRequests } from '../ApiCenter/AdminApi';
import { BarChart, PieChart,LineChart  } from '@mui/x-charts';

const AdminReports = () => {
  const [users, setUsers] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingLeaves, setLoadingLeaves] = useState(true);
  const adminId = sessionStorage.getItem('adminId');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch {
        Swal.fire('Error', 'Failed to fetch users', 'error');
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchLeaveRequests = async () => {
      try {
        const response = await getAllLeaveRequests(adminId);
        setLeaveRequests(response.data);
      } catch {
        Swal.fire('Error', 'Failed to fetch leave requests', 'error');
      } finally {
        setLoadingLeaves(false);
      }
    };

    fetchUsers();
    if (adminId) fetchLeaveRequests();
  }, [adminId]);

  const leaveCountsPerUser = () => {
    const counts = {};
    leaveRequests.forEach((req) => {
      counts[req.userName] = (counts[req.userName] || 0) + 1;
    });
    return Object.entries(counts).map(([user, count]) => ({ user, count }));
  };

  const plannedVsUnplanned = () => {
    const planned = leaveRequests.filter((r) => r.leaveTypePlannedAndUnplanned === 'PLANNED').length;
    const unplanned = leaveRequests.filter((r) => r.leaveTypePlannedAndUnplanned === 'UNPLANNED').length;
    return [
      { label: 'Planned', value: planned },
      { label: 'Unplanned', value: unplanned },
    ];
  };

  const leaveTypeDistribution = () => {
    const types = {};
    leaveRequests.forEach((r) => {
      types[r.leaveType] = (types[r.leaveType] || 0) + 1;
    });
    return Object.entries(types).map(([type, count]) => ({ type, count }));
  };

  return (
    <Container maxWidth="lg">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom align="center" sx={{ color: '#183c86', fontWeight: 'bold' }}>
          Admin Reports
        </Typography>

        {/* <Typography variant="h6" sx={{ mt: 3 }}>All Users</Typography>
        {loadingUsers ? (
          <CircularProgress />
        ) : users.length === 0 ? (
          <Typography>No users found.</Typography>
        ) : (
          <List>
            {users.map((user) => (
              <ListItem key={user.userId} divider>
                <ListItemText
                  primary={`${user.firstName} ${user.lastName} (ID: ${user.userId})`}
                  secondary={
                    <>
                      Email: {user.email} | Role: {user.role?.roleName || user.userRole}
                      <br />
                      Country: {user.countryName} | Gender: {user.gender}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )} */}

        {/* <Divider sx={{ my: 4 }} /> */}

        {/* <Typography variant="h6">All Leave Requests</Typography>
        {loadingLeaves ? (
          <CircularProgress />
        ) : leaveRequests.length === 0 ? (
          <Typography>No leave requests found.</Typography>
        ) : (
          <List>
            {leaveRequests.map((req) => (
              <ListItem key={req.leaveId} divider>
                <ListItemText
                  primary={`User: ${req.userName} (ID: ${req.userId}) | Role: ${req.userRole}`}
                  secondary={
                    <>
                      Leave Type: {req.leaveType} ({req.leaveTypePlannedAndUnplanned}) | Duration: {req.duration} day(s)
                      <br />
                      From: {req.startDate} To: {req.endDate}
                      <br />
                      Status: {req.leaveStatus} | Approver: {req.approver}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        )} */}

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" sx={{ mt: 3 }}>Visual Summary</Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 2 }}>
          <Box>
            <Typography variant="subtitle1" fontWeight="bold">Leave Requests per User</Typography>
            <BarChart
              series={[{ data: leaveCountsPerUser().map((d) => d.count), label: 'Leaves' }]}
              xAxis={[{ data: leaveCountsPerUser().map((d) => d.user), scaleType: 'band' }]}
              height={300}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold">Planned vs Unplanned Leaves</Typography>
            <PieChart
              series={[{ data: plannedVsUnplanned() }]}
              height={300}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1" fontWeight="bold">Leave Type Distribution</Typography>
            <BarChart
              series={[{ data: leaveTypeDistribution().map((d) => d.count), label: 'Count' }]}
              xAxis={[{ data: leaveTypeDistribution().map((d) => d.type), scaleType: 'band' }]}
              height={300}
            />
          </Box>

          <Box>
  <Typography variant="subtitle1" fontWeight="bold">Summary</Typography>

  <Box sx={{ mt: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
    <Typography variant="body1">
      <strong>Total Number of Users:</strong> {users.length}
    </Typography>
    <Typography variant="body1" sx={{ mt: 1 }}>
      <strong>Total Number of Leave Requests:</strong> {leaveRequests.length}
    </Typography>
  </Box>
</Box>




        </Box>
      </Paper>
    </Container>
  );
};

export default AdminReports;
