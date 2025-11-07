import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, CircularProgress,
  Box, useMediaQuery
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
      })
      .catch((err) => {
        console.error('Failed to fetch registration history:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Box sx={{ mt: 6, mb: 5, px: isMobile ? 1 : 6 }}>
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(to right, #183c86, #5c6bc0)',
          borderRadius: 3,
          p: isMobile ? 2 : 2,
          textAlign: 'center',
          mb: 4,
          boxShadow: '0 6px 15px rgba(24,60,134,0.2)',
        }}
      >
        <Typography
          variant={isMobile ? 'h6' : 'h5'}
          sx={{ color: 'white', fontWeight: 'bold', letterSpacing: 1 }}
        >
          Registration History
        </Typography>
        
      </Box>

      {/* Table Container */}
      <TableContainer
        component={Paper}
        sx={{
          borderRadius: 3,
          boxShadow: '0 6px 15px rgba(24,60,134,0.08)',
          overflowX: 'auto',
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" py={5}>
            <CircularProgress />
          </Box>
        ) : history.length === 0 ? (
          <Typography align="center" sx={{ p: 4, color: 'gray' }}>
            No registration records found.
          </Typography>
        ) : (
          <Table stickyHeader size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#183c86' }}>
                {[
                  'Reg. ID',
                  'First Name',
                  'Last Name',
                  'User ID',
                  'Email',
                  'Role',
                  'Registered On',
                ].map((head, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      fontWeight: 'bold',
                      color: 'black',
                      textAlign: 'center',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {head}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {history.map((entry, index) => (
                <TableRow
                  key={entry.registrationId}
                  sx={{
                    backgroundColor: index % 2 === 0 ? '#f9fafc' : 'white',
                    '&:hover': { backgroundColor: '#e8f0fe' },
                  }}
                >
                  <TableCell align="center">{entry.registrationId}</TableCell>
                  <TableCell align="center">{entry.firstName}</TableCell>
                  <TableCell align="center">{entry.lastName}</TableCell>
                  <TableCell align="center">{entry.userId}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      wordBreak: 'break-word',
                      maxWidth: isMobile ? 150 : 250,
                    }}
                  >
                    {entry.email}
                  </TableCell>
                  <TableCell align="center">{entry.role}</TableCell>
                  <TableCell align="center">
                    {new Date(entry.registerDate).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Box>
  );
};

export default AdminRegistrationHistory;
