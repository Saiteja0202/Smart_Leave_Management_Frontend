import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  CircularProgress,
  Paper,
  Box,
  Grid,
  IconButton,
  Dialog,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Swal from 'sweetalert2';
import { getAllUsers, getAllLeaveRequests } from '../ApiCenter/AdminApi';
import { BarChart, PieChart, LineChart } from '@mui/x-charts';

const AdminReports = () => {
  const [users, setUsers] = useState([]);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openChart, setOpenChart] = useState(null);
  const adminId = sessionStorage.getItem('adminId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, leavesRes] = await Promise.all([
          getAllUsers(),
          getAllLeaveRequests(adminId),
        ]);
        setUsers(usersRes.data);
        setLeaveRequests(leavesRes.data);
      } catch {
        Swal.fire('Error', 'Failed to fetch data', 'error');
      } finally {
        setLoading(false);
      }
    };
    if (adminId) fetchData();
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

  const lineChartData = () => {
    const monthCounts = {};
    leaveRequests.forEach((req) => {
      const month = new Date(req.startDate).toLocaleString('default', { month: 'short' });
      monthCounts[month] = (monthCounts[month] || 0) + 1;
    });
    return Object.entries(monthCounts).map(([month, count]) => ({ month, count }));
  };

  const charts = [
    {
      title: 'Leave Requests per User',
      type: 'bar',
      data: leaveCountsPerUser(),
      seriesLabel: 'Leaves',
      color: '#5c6bc0',
    },
    {
      title: 'Planned vs Unplanned Leaves',
      type: 'pie',
      data: plannedVsUnplanned(),
    },
    {
      title: 'Leave Type Distribution',
      type: 'bar',
      data: leaveTypeDistribution(),
      seriesLabel: 'Count',
      color: '#42a5f5',
    },
    {
      title: 'Monthly Leave Trend',
      type: 'line',
      data: lineChartData(),
      seriesLabel: 'Leaves per Month',
      color: '#43a047',
    },
  ];

  return (
    <Container maxWidth="xl" sx={{ mt: 5, mb: 6 }}>
      <Box
        sx={{
          background: 'linear-gradient(to right, #183c86, #5c6bc0)',
          borderRadius: 3,
          p: 2,
          boxShadow: 4,
          mb: 5,
        }}
      >
        <Typography variant="h5" align="center" sx={{ fontWeight: 'bold', color: 'white' }}>
          Admin Analytics Dashboard
        </Typography>
       
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={4}>
          {charts.map((chart, i) => (
            <Grid item xs={12} md={6} key={i}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: 3,
                  boxShadow: '0 5px 12px rgba(0,0,0,0.1)',
                  position: 'relative',
                }}
              >
                {/* Enlarge Button */}
                <IconButton
                  onClick={() => setOpenChart(chart)}
                  sx={{
                    position: 'absolute',
                    top: 10,
                    right: 10,
                    backgroundColor: '#f5f5f5',
                    '&:hover': { backgroundColor: '#e0e0e0' },
                  }}
                >
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/8096/8096946.png"
                    alt="enlarge"
                    width="20"
                    height="20"
                  />
                </IconButton>

                <Typography variant="h6" sx={{ mb: 2, color: '#183c86', fontWeight: 600 }}>
                  {chart.title}
                </Typography>

                {chart.type === 'bar' && (
                  <BarChart
                    series={[{ data: chart.data.map((d) => d.count), label: chart.seriesLabel, color: chart.color }]}
                    xAxis={[{ data: chart.data.map((d) => d.user || d.type), scaleType: 'band' }]}
                    height={300}
                  />
                )}
                {chart.type === 'pie' && (
                  <PieChart series={[{ data: chart.data, innerRadius: 40, outerRadius: 120, paddingAngle: 3 }]} height={300} />
                )}
                {chart.type === 'line' && (
                  <LineChart
                    series={[{ data: chart.data.map((d) => d.count), label: chart.seriesLabel, color: chart.color }]}
                    xAxis={[{ data: chart.data.map((d) => d.month), scaleType: 'band' }]}
                    height={300}
                  />
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Enlarged Chart Dialog */}
      <Dialog open={!!openChart} onClose={() => setOpenChart(null)} maxWidth="lg" fullWidth>
        {openChart && (
          <Box sx={{ p: 3, position: 'relative' }}>
            <IconButton onClick={() => setOpenChart(null)} sx={{ position: 'absolute', top: 8, right: 8 }}>
              <CloseIcon />
            </IconButton>
            <Typography variant="h5" align="center" sx={{ mb: 2, color: '#183c86', fontWeight: 600 }}>
              {openChart.title}
            </Typography>
            {openChart.type === 'bar' && (
              <BarChart
                series={[{ data: openChart.data.map((d) => d.count), label: openChart.seriesLabel, color: openChart.color }]}
                xAxis={[{ data: openChart.data.map((d) => d.user || d.type), scaleType: 'band' }]}
                height={400}
              />
            )}
            {openChart.type === 'pie' && (
              <PieChart series={[{ data: openChart.data, innerRadius: 50, outerRadius: 150, paddingAngle: 3 }]} height={400} />
            )}
            {openChart.type === 'line' && (
              <LineChart
                series={[{ data: openChart.data.map((d) => d.count), label: openChart.seriesLabel, color: openChart.color }]}
                xAxis={[{ data: openChart.data.map((d) => d.month), scaleType: 'band' }]}
                height={400}
              />
            )}
          </Box>
        )}
      </Dialog>
    </Container>
  );
};

export default AdminReports;
