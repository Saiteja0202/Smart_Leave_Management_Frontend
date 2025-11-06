import { useEffect, useState } from 'react';
import { getUserHolidays } from '../ApiCenter/UserApi';
import { Paper, Typography, List, ListItem, ListItemText, CircularProgress } from '@mui/material';

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

  return (
    <Paper sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom align='center' sx={{ color: '#183c86',fontWeight: 'bold' }}>Holiday Calendar</Typography>
      {loading ? (
        <CircularProgress />
      ) : (
        <List>
          {holidays.map((holiday, index) => (
            <ListItem key={index} divider>
              <ListItemText primary={holiday.holidayName} secondary={`Date: ${holiday.holidayDate}`} />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default UserHolidays;
