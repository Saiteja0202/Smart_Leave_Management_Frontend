import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, CircularProgress,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { registrationHistory } from '../ApiCenter/AdminApi';

const AdminRegistrationHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    registrationHistory()
      .then((res) => {
        setHistory(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch registration history:', err);
        setLoading(false);
      });
  }, []);

  return (
    <TableContainer component={Paper} sx={{ mt: 4, px: isMobile ? 1 : 4, py: 2 }}>
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        align="center"
        sx={{ color: '#183c86', fontWeight: 'bold', mb: 2 }}
      >
        Registration History
      </Typography>

      {loading ? (
        <Typography align="center">
          <CircularProgress />
        </Typography>
      ) : (
        <Table size={isMobile ? 'small' : 'medium'}>
          <TableHead>
            <TableRow>
              <TableCell><strong>Reg. ID</strong></TableCell>
              <TableCell><strong>First Name</strong></TableCell>
              <TableCell><strong>Last Name</strong></TableCell>
              <TableCell><strong>User ID</strong></TableCell>
              <TableCell><strong>Email</strong></TableCell>
              <TableCell><strong>Role</strong></TableCell>
              <TableCell><strong>Registered On</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {history.map((entry) => (
              <TableRow key={entry.registrationId}>
                <TableCell>{entry.registrationId}</TableCell>
                <TableCell>{entry.firstName}</TableCell>
                <TableCell>{entry.lastName}</TableCell>
                <TableCell>{entry.userId}</TableCell>
                <TableCell sx={{ wordBreak: 'break-word' }}>{entry.email}</TableCell>
                <TableCell>{entry.role}</TableCell>
                <TableCell>{new Date(entry.registerDate).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </TableContainer>
  );
};

export default AdminRegistrationHistory;
