import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import Swal from 'sweetalert2';
import {
  addLeavePolicies,
  getAllLeavePolicies,
  getAllRoles
} from '../ApiCenter/AdminApi';

const AdminAddRolePolicies = () => {
  const [policyData, setPolicyData] = useState({
    role: '',
    sickLeave: '',
    earnedLeave: '',
    casualLeave: '',
    paternityLeave: '',
    maternityLeave: '',
    lossOfPay: '',
  });
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [usedRoles, setUsedRoles] = useState([]);
  const [leavePolicies, setLeavePolicies] = useState([]);
  const [fetching, setFetching] = useState(true);
  const adminId = sessionStorage.getItem('adminId');

  const fetchData = async () => {
    setFetching(true);
    try {
      const [rolesRes, policiesRes] = await Promise.all([
        getAllRoles(adminId),
        getAllLeavePolicies(adminId),
      ]);
      const filteredRoles = rolesRes.data.filter((role) => role.roleName !== 'ADMIN');
      setRoles(filteredRoles);
      setLeavePolicies(policiesRes.data);
      const used = policiesRes.data.map((p) => p.role);
      setUsedRoles(used);
    } catch {
      Swal.fire('Error', 'Failed to load roles or policies', 'error');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (adminId) {
      fetchData();
    }
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPolicyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await addLeavePolicies(adminId, policyData);
      Swal.fire('Success', 'Leave policy added', 'success');
      setPolicyData({
        role: '',
        sickLeave: '',
        earnedLeave: '',
        casualLeave: '',
        paternityLeave: '',
        maternityLeave: '',
        lossOfPay: '',
      });
      await fetchData();
    } catch {
      Swal.fire('Error', 'Failed to add policy', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom align='center' sx={{ color: '#183c86',fontWeight: 'bold' }}>Add Leave Policy</Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Role</InputLabel>
            <Select
              name="role"
              value={policyData.role}
              onChange={handleChange}
              required
            >
              {roles.map((role) => {
                const isUsed = usedRoles.includes(role.roleName);
                return (
                  <MenuItem
                    key={role.roleName}
                    value={role.roleName}
                    disabled={isUsed}
                  >
                    {role.roleName}
                  </MenuItem>
                );
              })}
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
              margin="normal"
              required
            />
          ))}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Add Policy'}
          </Button>
        </form>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>Existing Leave Policies</Typography>
        {fetching ? (
          <CircularProgress />
        ) : leavePolicies.length === 0 ? (
          <Typography>No leave policies found.</Typography>
        ) : (
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Role</TableCell>
                  <TableCell align="right">Sick</TableCell>
                  <TableCell align="right">Earned</TableCell>
                  <TableCell align="right">Casual</TableCell>
                  <TableCell align="right">Paternity</TableCell>
                  <TableCell align="right">Maternity</TableCell>
                  {/* <TableCell align="right">Loss of Pay</TableCell> */}
                  <TableCell align="right"><strong>Total</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {leavePolicies.map((policy) => (
                  <TableRow key={policy.roleBasedLeaveId}>
                    <TableCell>{policy.role}</TableCell>
                    <TableCell align="right">{policy.sickLeave}</TableCell>
                    <TableCell align="right">{policy.earnedLeave}</TableCell>
                    <TableCell align="right">{policy.casualLeave}</TableCell>
                    <TableCell align="right">{policy.paternityLeave}</TableCell>
                    <TableCell align="right">{policy.maternityLeave}</TableCell>
                    {/* <TableCell align="right">{policy.lossOfPay}</TableCell> */}
                    <TableCell align="right"><strong>{policy.totalLeaves}</strong></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Container>
  );
};

export default AdminAddRolePolicies;
