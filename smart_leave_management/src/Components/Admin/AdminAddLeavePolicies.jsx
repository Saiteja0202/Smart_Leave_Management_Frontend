import { useEffect, useState } from 'react';
import {
  Box, Button, TextField, Typography, CircularProgress, Container, Paper,
  FormControl, InputLabel, Select, MenuItem, Divider, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Card, CardContent
} from '@mui/material';
import Swal from 'sweetalert2';
import { addLeavePolicies, getAllLeavePolicies, getAllRoles } from '../ApiCenter/AdminApi';

const AdminAddRolePolicies = () => {
  const adminId = sessionStorage.getItem('adminId');
  const [policyData, setPolicyData] = useState({
    role: '', sickLeave: '', earnedLeave: '', casualLeave: '', paternityLeave: '', maternityLeave: ''
  });
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [usedRoles, setUsedRoles] = useState([]);
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!adminId) return;
    const fetchData = async () => {
      setFetching(true);
      try {
        const [rolesRes, policiesRes] = await Promise.all([
          getAllRoles(adminId),
          getAllLeavePolicies(adminId),
        ]);
        setRoles(rolesRes.data.filter(r => r.roleName !== 'ADMIN'));
        setLeavePolicies(policiesRes.data);
        setUsedRoles(policiesRes.data.map(p => p.role));
      } catch {
        Swal.fire('Error', 'Failed to load roles or policies', 'error');
      } finally {
        setFetching(false);
      }
    };
    fetchData();
  }, [adminId]);

  const handleChange = (e) => setPolicyData({ ...policyData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addLeavePolicies(adminId, policyData);
      Swal.fire('Success', 'Leave policy added successfully!', 'success');
      setPolicyData({ role: '', sickLeave: '', earnedLeave: '', casualLeave: '', paternityLeave: '', maternityLeave: '' });
      const res = await getAllLeavePolicies(adminId);
      setLeavePolicies(res.data);
      setUsedRoles(res.data.map(p => p.role));
    } catch {
      Swal.fire('Error', 'Failed to add policy', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="100">
      <Paper elevation={4} sx={{ p: 4, mt: 5, borderRadius: 4, background: '#fff' }}>
        <Box sx={{ background: 'linear-gradient(to right, #183c86, #5c6bc0)', borderRadius: 2, p: 2, mb: 3 }}>
          <Typography variant="h5" align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>
            Add Leave Policy
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth required>
            <InputLabel>Select Role</InputLabel>
            <Select name="role" value={policyData.role} onChange={handleChange} label="Select Role">
              {roles.map(({ roleName }) => (
                <MenuItem key={roleName} value={roleName} disabled={usedRoles.includes(roleName)}>
                  {roleName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {['sickLeave', 'earnedLeave', 'casualLeave', 'paternityLeave', 'maternityLeave'].map((field) => (
            <TextField
              key={field}
              fullWidth
              type="number"
              label={field.replace(/([A-Z])/g, ' $1')}
              name={field}
              value={policyData[field]}
              onChange={handleChange}
              required
            />
          ))}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 2, py: 1.3, backgroundColor: '#183c86', fontWeight: 'bold',
              '&:hover': { backgroundColor: '#102a60', transform: 'scale(1.02)', transition: '0.3s' },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Add Policy'}
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />
        <Typography variant="h6" sx={{ color: '#183c86', fontWeight: 'bold', mb: 2 }}>
          Existing Leave Policies
        </Typography>

        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}><CircularProgress /></Box>
        ) : leavePolicies.length === 0 ? (
          <Typography align="center" color="text.secondary">No leave policies found.</Typography>
        ) : (
          <Card sx={{ borderRadius: 3, boxShadow: '0 3px 8px rgba(0,0,0,0.08)' }}>
            <CardContent sx={{ p: 0 }}>
              <TableContainer>
                <Table size="small">
                  <TableHead sx={{ backgroundColor: '#183c86' }}>
                    <TableRow>
                      {['Role', 'Sick', 'Earned', 'Casual', 'Paternity', 'Maternity', 'Total'].map((head) => (
                        <TableCell key={head} sx={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>
                          {head}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {leavePolicies.map((p) => (
                      <TableRow key={p.roleBasedLeaveId} sx={{ '&:hover': { backgroundColor: 'rgba(24,60,134,0.05)', transition: '0.2s' } }}>
                        <TableCell align="center" sx={{ fontWeight: 'bold' }}>{p.role}</TableCell>
                        <TableCell align="center">{p.sickLeave}</TableCell>
                        <TableCell align="center">{p.earnedLeave}</TableCell>
                        <TableCell align="center">{p.casualLeave}</TableCell>
                        <TableCell align="center">{p.paternityLeave}</TableCell>
                        <TableCell align="center">{p.maternityLeave}</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', color: '#183c86' }}>{p.totalLeaves}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        )}
      </Paper>
    </Container>
  );
};

export default AdminAddRolePolicies;
