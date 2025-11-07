import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
} from '@mui/material';
import Swal from 'sweetalert2';
import {
  addCountryCalendar,
  getAllHolidays,
  updateCalendar,
} from '../ApiCenter/AdminApi';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const AdminAddCalendar = () => {
  const [holidayData, setHolidayData] = useState({
    countryName: '',
    calendarYear: '',
    holidayName: '',
    holidayDate: '',
  });
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(false);
  const [holidayLoading, setHolidayLoading] = useState(true);
  const adminId = sessionStorage.getItem('adminId');

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await getAllHolidays(adminId);
        setHolidays(response.data);
      } catch {
        setHolidays([]);
      } finally {
        setHolidayLoading(false);
      }
    };

    if (adminId) {
      fetchHolidays();
    }
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHolidayData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addCountryCalendar(adminId, holidayData);
      Swal.fire('Success', 'Holiday added successfully', 'success');
      setHolidayData({
        countryName: '',
        calendarYear: '',
        holidayName: '',
        holidayDate: '',
      });
      const response = await getAllHolidays(adminId);
      setHolidays(response.data);
    } catch {
      Swal.fire('Error', 'Failed to add holiday', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await updateCalendar(adminId);
      Swal.fire('Updated', 'Calendar updated successfully', 'success');
      const response = await getAllHolidays(adminId);
      setHolidays(response.data);
    } catch {
      Swal.fire('Error', 'Failed to update calendar', 'error');
    } finally {
      setLoading(false);
    }
  };

  const groupedHolidays = holidays.reduce((acc, holiday) => {
    const key = `${holiday.countryName} (${holiday.calendarYear})`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(holiday);
    return acc;
  }, {});

  return (
    <Container maxWidth="md">
      <Paper
        sx={{
          p: 4,
          mt: 4,
          boxShadow: 4,
          borderRadius: 3,
          transition: 'all 0.3s ease',
        }}
      >
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
            sx={{ color: '#fff', fontWeight: 'bold' }}
          >
            Add Holidays to Calendar
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <a
            href="https://docs.google.com/spreadsheets/d/1nkOpL4L6J9mDw2tLaezeO8KZnXxwhauCed1JG5u6bq8/edit?gid=0#gid=0"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              color: '#1976d2',
              fontWeight: '500',
            }}
          >
            <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
            View Calendar Template
          </a>
        </Box>

       
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="contained"
            onClick={handleUpdate}
            disabled={loading}
            sx={{
              background: 'linear-gradient(to right, #183c86, #5c6bc0)',
              color: '#fff',
              px: 4,
              py: 1,
              fontWeight: 600,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': { opacity: 0.9 },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Calendar'}
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h6"
          sx={{ fontWeight: 'bold', color: '#183c86', mb: 2 }}
        >
          Holiday List
        </Typography>

        {holidayLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <CircularProgress />
          </Box>
        ) : Object.keys(groupedHolidays).length === 0 ? (
          <Typography align="center" color="text.secondary">
            No holidays found.
          </Typography>
        ) : (
          Object.entries(groupedHolidays).map(([group, items]) => (
            <Box
              key={group}
              sx={{
                mb: 3,
                borderRadius: 2,
                p: 2,
                backgroundColor: '#f9f9fc',
                boxShadow: 1,
                transition: '0.3s',
                '&:hover': { boxShadow: 3 },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: '#183c86',
                  fontWeight: 'bold',
                  mb: 1,
                }}
              >
                {group}
              </Typography>
              <List>
                {items.map((holiday) => (
                  <ListItem key={holiday.holidayId} divider>
                    <ListItemText
                      primary={holiday.holidayName}
                      secondary={`Date: ${holiday.holidayDate} (${holiday.holidayDay})`}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          ))
        )}
      </Paper>
    </Container>
  );
};

export default AdminAddCalendar;
