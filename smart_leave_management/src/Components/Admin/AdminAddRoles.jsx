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
  Card,
  CardContent,
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
    <Container maxWidth="md">
      <Paper
        elevation={4}
        sx={{
          p: 4,
          mt: 5,
          borderRadius: 4,
          background: 'linear-gradient(to right, #f8f9fc, #ffffff)',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
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
            Add New Role
          </Typography>
        </Box>


        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            backgroundColor: '#fafbff',
            borderRadius: 2,
            p: 3,
            boxShadow: 'inset 0 0 8px rgba(0,0,0,0.05)',
          }}
        >
          <FormControl fullWidth required>
            <InputLabel>Select Role</InputLabel>
            <Select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
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
            label="Description"
            value={customDescription}
            onChange={(e) => setCustomDescription(e.target.value)}
            placeholder="Optional: Customize role description"
            multiline
            rows={2}
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading || !selectedRole}
            sx={{
              mt: 2,
              py: 1.3,
              backgroundColor: '#183c86',
              fontWeight: 'bold',
              letterSpacing: 0.5,
              '&:hover': {
                backgroundColor: '#102a60',
                transform: 'scale(1.02)',
                transition: '0.3s',
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Add Role'}
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: '#183c86',
            fontWeight: 'bold',
            mb: 2,
          }}
        >
          Existing Roles
        </Typography>

        {fetchingRoles ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : existingRoles.length === 0 ? (
          <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
            No roles found.
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
              gap: 2,
            }}
          >
            {existingRoles.map((role) => (
              <Card
                key={role.roleId}
                sx={{
                  borderRadius: 3,
                  boxShadow: '0 3px 8px rgba(0,0,0,0.08)',
                  transition: '0.3s',
                  '&:hover': { transform: 'scale(1.03)', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' },
                }}
              >
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="bold" color="#183c86">
                    {role.roleName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {role.description}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default AdminAddRoles;
