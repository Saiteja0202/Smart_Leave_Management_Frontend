import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Container,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
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
      <Paper sx={{ p: 4, mt: 4 }}>
      <Typography variant="h5" gutterBottom align='center' sx={{ color: '#183c86',fontWeight: 'bold' }}>
  Add Holidays to Calendar
  <a
    href="https://docs.google.com/spreadsheets/d/1nkOpL4L6J9mDw2tLaezeO8KZnXxwhauCed1JG5u6bq8/edit?gid=0#gid=0"
    target="_blank"
    rel="noopener noreferrer"
    style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: '#1976d2' }}
  >
    <CalendarTodayIcon fontSize="small" sx={{ mr: 0.5 }} />
    Calendar
  </a>
</Typography>

        

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="outlined" onClick={handleUpdate} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Update Calendar'}
          </Button>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Holiday List
          </Typography>
          {holidayLoading ? (
            <CircularProgress />
          ) : Object.keys(groupedHolidays).length === 0 ? (
            <Typography>No holidays found.</Typography>
          ) : (
            Object.entries(groupedHolidays).map(([group, items]) => (
              <Box key={group} sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
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
        </Box>

        <Divider sx={{ my: 3 }} />

        
      </Paper>
    </Container>
  );
};

export default AdminAddCalendar;
