import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';

const LandingPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: '100%',
            maxWidth: 600,
            p: isMobile ? 3 : 5,
            textAlign: 'center',
            borderRadius: 3,
            backgroundColor: '#f9f9f9',
          }}
        >
          <Typography variant={isMobile ? 'h5' : 'h4'} gutterBottom sx={{ color: '#183c86',fontWeight: 'bold' }}>
            Welcome to Smart Leave Management
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            <Grid item xs={12} sm={6}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/admin-login')}
                fullWidth
                size={isMobile ? 'medium' : 'large'}
              >
                Admin
              </Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate('/user-login')}
                fullWidth
                size={isMobile ? 'medium' : 'large'}
              >
                User
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default LandingPage;
