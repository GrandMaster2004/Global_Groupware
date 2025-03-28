import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUsers } from "../services/api";
import {
  Box,
  Container,
  Grid,
  Typography,
  CircularProgress,
  Pagination,
} from "@mui/material";
import UserCard from "../components/Users/UserCard";
import Navbar from "../components/Shared/Navbar";

const UsersPage = () => {
  const { token, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(err.response?.data?.error || "Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [page, token]);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <>
      <Navbar onLogout={logout} />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          User Management
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {users.map((user) => (
                <Grid item key={user.id} xs={12} sm={6} md={4}>
                  <UserCard user={user} />
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
      </Container>
    </>
  );
};

export default UsersPage;
