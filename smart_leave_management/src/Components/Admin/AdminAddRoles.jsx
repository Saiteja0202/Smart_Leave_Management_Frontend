import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  CircularProgress,
  Container,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import Swal from 'sweetalert2';
import { addNewRole, getAllRoles } from '../ApiCenter/AdminApi';

const predefinedRoles = [
  { roleName: 'TEAM_MEMBER', description: 'Team Member' },
  { roleName: 'TEAM_LEAD', description: 'Team Lead' },
  { roleName: 'TEAM_MANAGER', description: 'Team Manager' },
  { roleName: 'HR_MANAGER', description: 'HR Manager' },
];

const AdminAddRoles = () => {
  const [selectedRole, setSelectedRole] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [existingRoles, setExistingRoles] = useState([]);
  const [fetchingRoles, setFetchingRoles] = useState(true);
  const adminId = sessionStorage.getItem('adminId');

  const fetchRoles = async () => {
    try {
      const response = await getAllRoles(adminId);
      setExistingRoles(response.data);
    } catch {
      setExistingRoles([]);
    } finally {
      setFetchingRoles(false);
    }
  };

  useEffect(() => {
    if (adminId) {
      fetchRoles();
    }
  }, [adminId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const defaultRole = predefinedRoles.find((r) => r.roleName === selectedRole);
    const roleObj = {
      roleName: selectedRole,
      description: customDescription || defaultRole?.description || '',
    };

    try {
      await addNewRole(adminId, roleObj);
      Swal.fire('Success', 'Role added successfully', 'success');
      setSelectedRole('');
      setCustomDescription('');
      await fetchRoles();
    } catch {
      Swal.fire('Error', 'Failed to add role', 'error');
    } finally {
      setLoading(false);
    }
  };

  const existingRoleNames = existingRoles.map((r) => r.roleName);

  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h5" gutterBottom align='center' sx={{ color: '#183c86',fontWeight: 'bold' }}>
          Add New Role
        </Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Role</InputLabel>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              required
              label="Select Role"
            >
              {predefinedRoles.map((role) => (
                <MenuItem
                  key={role.roleName}
                  value={role.roleName}
                  disabled={existingRoleNames.includes(role.roleName)}
                >
                  {role.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="Optional: Customize role description"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={loading || !selectedRole}
          >
            {loading ? <CircularProgress size={24} /> : 'Add Role'}
          </Button>
        </form>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          Existing Roles
        </Typography>
        {fetchingRoles ? (
          <CircularProgress />
        ) : existingRoles.length === 0 ? (
          <Typography>No roles found.</Typography>
        ) : (
          <List>
            {existingRoles.map((role) => (
              <ListItem key={role.roleId} divider>
                <ListItemText
                  primary={role.roleName}
                  secondary={role.description}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default AdminAddRoles;
