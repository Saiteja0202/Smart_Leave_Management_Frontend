import { useEffect, useState } from 'react';
import { getUserLeaveBalance } from '../ApiCenter/UserApi';
import {
  Paper,
  Typography,
  CircularProgress,
  Grid,
  Box,
} from '@mui/material';

const UserLeaveBalance = () => {
  const userId = sessionStorage.getItem('userId');
  const [balanceData, setBalanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await getUserLeaveBalance(userId);
        setBalanceData(res.data[0]); 
      } catch {
        setBalanceData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBalance();
  }, [userId]);

  const leaveTypes = [
    { key: 'sickLeave', label: 'Sick Leave' },
    { key: 'casualLeave', label: 'Casual Leave' },
    { key: 'earnedLeave', label: 'Earned Leave' },
    { key: 'paternityLeave', label: 'Paternity Leave' },
    { key: 'maternityLeave', label: 'Maternity Leave' },
    { key: 'lossOfPay', label: 'Loss of Pay' },
    { key: 'totalLeaves', label: 'Total Leaves' },
  ];

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom align='center' sx={{ color: '#183c86',fontWeight: 'bold' }}>
        Leave Balance
      </Typography>
      {loading ? (
        <CircularProgress />
      ) : balanceData ? (
        <Grid container spacing={2}>
          {leaveTypes.map(({ key, label }) => (
            <Grid item xs={12} sm={6} md={4} key={key}>
              <Box
                sx={{
                  border: '1px solid #ccc',
                  borderRadius: 2,
                  p: 2,
                  textAlign: 'center',
                  backgroundColor: '#f9f9f9',
                  boxShadow: 1,
                }}
              >
                <Typography variant="subtitle1" fontWeight="bold">
                  {label}
                </Typography>
                <Typography variant="body2">
                  Available Days: {balanceData[key]}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography>No leave balance data available.</Typography>
      )}
    </Paper>
  );
};

export default UserLeaveBalance;
