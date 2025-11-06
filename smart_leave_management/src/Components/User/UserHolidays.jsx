import { useEffect, useState } from 'react';
import { getUserHolidays } from '../ApiCenter/UserApi';
import {
  Paper,
  Typography,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from '@mui/material';

const UserHolidays = () => {
  const userId = sessionStorage.getItem('userId');
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await getUserHolidays(userId);
        setHolidays(res.data);
      } catch {
        setHolidays([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHolidays();
  }, [userId]);

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      const day = date.toLocaleDateString('en-IN', { weekday: 'long' });
      const dd = String(date.getDate()).padStart(2, '0');
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const yyyy = date.getFullYear();
      return {
        dateFormatted: `${dd}-${mm}-${yyyy}`,
        day,
      };
    } catch {
      return {
        dateFormatted: 'Invalid Date',
        day: 'N/A',
      };
    }
  };

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
        Holiday Calendar
      </Typography></Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : holidays.length === 0 ? (
        <Typography align="center" sx={{ mt: 2 }}>
          No holiday data available.
        </Typography>
      ) : (
        <TableContainer sx={{ mt: 2 }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#e3f2fd' }}>
                {['Date', 'Day', 'Holiday Name'].map((header) => (
                  <TableCell key={header} sx={{ fontWeight: 'bold', color: '#183c86' }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {holidays.map((holiday, index) => {
                const { dateFormatted, day } = formatDate(holiday.holidayDate);
                return (
                  <TableRow
                    key={index}
                    hover
                    sx={{
                      backgroundColor: index % 2 === 0 ? '#f9f9fc' : '#ffffff',
                      transition: 'background-color 0.3s ease',
                    }}
                  >
                    <TableCell>{dateFormatted}</TableCell>
                    <TableCell>{day}</TableCell>
                    <TableCell>{holiday.holidayName}</TableCell>
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

export default UserHolidays;
