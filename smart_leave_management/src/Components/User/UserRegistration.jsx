import { useEffect, useState } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Link,
  CircularProgress,
  MenuItem,
  useMediaQuery,
  useTheme,
  IconButton,
  InputAdornment,
} from '@mui/material';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { getAllCountriesForUsers, registerUser } from '../ApiCenter/UserApi';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const UserRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    userName: '',
    email: '',
    password: '',
    phoneNumber: '',
    address: '',
    gender: '',
    countryName: '',
  });

  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [usernameValid, setUsernameValid] = useState(null);
  const [emailValid, setEmailValid] = useState(null);
  const [phoneValid, setPhoneValid] = useState(null);
  const [passwordValid, setPasswordValid] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^\d{10}$/;
  const usernameRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{4,}$/;

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await getAllCountriesForUsers();
        setCountries(res.data);
      } catch {
        setCountries([]);
      }
    };
    fetchCountries();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = name === 'gender' ? value.toUpperCase() : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    if (name === 'password') setPasswordValid(passwordRegex.test(value));
    if (name === 'userName') setUsernameValid(usernameRegex.test(value));
    if (name === 'email') setEmailValid(emailRegex.test(value));
    if (name === 'phoneNumber') setPhoneValid(phoneRegex.test(value));
  };

  const validateForm = () => {
    return (
      formData.firstName.trim() &&
      formData.lastName.trim() &&
      formData.address.trim() &&
      formData.gender &&
      formData.countryName &&
      emailRegex.test(formData.email) &&
      phoneRegex.test(formData.phoneNumber) &&
      usernameRegex.test(formData.userName) &&
      passwordRegex.test(formData.password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await registerUser(formData);
      await Swal.fire({
        icon: 'success',
        title: 'Registration Successful',
        text: response.data,
        confirmButtonColor: '#3085d6',
      });
      navigate('/user-login');
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data || 'Registration failed. Please try again.';
      Swal.fire({
        icon: 'error',
        title: `Error ${status || ''}`,
        text: message,
        confirmButtonColor: '#d33',
      });
    } finally {
      setLoading(false);
    }
  };

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
        <Box
          sx={{
            width: '100%',
            maxWidth: 600,
            p: isMobile ? 3 : 5,
            boxShadow: 3,
            borderRadius: 3,
            backgroundColor: '#fff',
          }}
        >
          <Typography variant={isMobile ? 'h5' : 'h4'} align="center" gutterBottom>
            User Registration
          </Typography>
          <Typography align="center" sx={{ mt: 2 }}>
            Already have an account?{' '}
            <Link href="/user-login" underline="hover">
              Go to login
            </Link>
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} margin="normal" required />
            <TextField fullWidth label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} margin="normal" required />

            <TextField
              fullWidth
              label="Username"
              name="userName"
              value={formData.userName}
              onChange={handleChange}
              margin="normal"
              required
              helperText="Must include 1 capital letter, 1 digit, and 1 symbol"
              error={usernameValid === false}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: usernameValid === true ? 'green' : usernameValid === false ? 'red' : undefined,
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              error={emailValid === false}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: emailValid === true ? 'green' : emailValid === false ? 'red' : undefined,
                  },
                },
              }}
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              margin="normal"
              required
              helperText="Must be 10 digits"
              error={phoneValid === false}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: phoneValid === true ? 'green' : phoneValid === false ? 'red' : undefined,
                  },
                },
              }}
            />

            <TextField fullWidth label="Address" name="address" value={formData.address} onChange={handleChange} margin="normal" required />

            <TextField fullWidth select label="Gender" name="gender" value={formData.gender} onChange={handleChange} margin="normal" required>
              <MenuItem value="MALE">Male</MenuItem>
              <MenuItem value="FEMALE">Female</MenuItem>
              <MenuItem value="OTHER">Other</MenuItem>
            </TextField>

            <TextField fullWidth select label="Country" name="countryName" value={formData.countryName} onChange={handleChange} margin="normal" required>
              {countries.map((country) => (
                <MenuItem key={country} value={country}>{country}</MenuItem>
              ))}
            </TextField>

            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              helperText="Min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 symbol"
              error={passwordValid === false}
              sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: passwordValid === true ? 'green' : passwordValid === false ? 'red' : undefined,
                  },
                },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((prev) => !prev)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button fullWidth type="submit" variant="contained" color="primary" disabled={!validateForm() || loading} sx={{ mt: 2 }} size={isMobile ? 'medium' : 'large'}>
              {loading ? <CircularProgress size={24} /> : 'Register'}
            </Button>
          </form>
        </Box>
      </Box>
    </Container>
  );
};

export default UserRegistration;
