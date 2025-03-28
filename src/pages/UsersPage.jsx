import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUsers } from '../services/api';
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Pagination,
  Snackbar,
  Alert
} from '@mui/material';
import UserCard from '../components/Users/UserCard';
import Navbar from '../components/Shared/Navbar';

const UsersPage = () => {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getUsers(page);
        setUsers(response.data.data);
        setTotalPages(response.data.total_pages);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch users');
        showSnackbar('Failed to load users', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, token]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleUserUpdated = async () => {
    try {
      const response = await getUsers(page);
      setUsers(response.data.data);
      showSnackbar('User updated successfully', 'success');
    } catch (err) {
      showSnackbar('Failed to update user', 'error');
    }
  };

  const handleUserDeleted = (deletedUserId) => {
    setUsers(users.filter(user => user.id !== deletedUserId));
    showSnackbar('User deleted successfully', 'success');
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
    <>
      <Navbar onLogout={logout} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>
        
        {loading && users.length === 0 ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <Typography color="error">{error}</Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {users.map((user) => (
                <Grid item key={user.id} xs={12} sm={6} md={4}>
                  <UserCard 
                    user={user}
                    onUserUpdated={handleUserUpdated}
                    onUserDeleted={handleUserDeleted}
                  />
                </Grid>
              ))}
            </Grid>
            
            {totalPages > 1 && (
              <Box display="flex" justifyContent="center" mt={4}>
                <Pagination 
                  count={totalPages} 
                  page={page} 
                  onChange={handlePageChange} 
                  color="primary" 
                />
              </Box>
            )}
          </>
        )}

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default UsersPage;