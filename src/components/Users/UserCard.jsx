import {
  Avatar,
  Box,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useState } from "react";
import UserForm from "./UserForm";
import { updateUser, deleteUser } from "../../services/api";

const UserCard = ({ user, onUserUpdated, onUserDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleUpdate = async (updatedUser) => {
    setLoading(true);
    setError(null);
    try {
      await updateUser(user.id, updatedUser);
      onUserUpdated();
      setIsEditing(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setLoading(true);
    setError(null);
    try {
      await deleteUser(user.id);
      onUserDeleted(user.id);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      {isEditing ? (
        <CardContent>
          <UserForm
            user={user}
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
            loading={loading}
          />
          {error && (
            <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
          )}
        </CardContent>
      ) : (
        <>
          <CardHeader
            avatar={<Avatar src={user.avatar} />}
            title={`${user.first_name} ${user.last_name}`}
            subheader={user.email}
          />
          <CardContent>
            <Box display="flex" justifyContent="flex-end">
              <IconButton
                color="primary"
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : <EditIcon />}
              </IconButton>
              <IconButton
                color="error"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} /> : <DeleteIcon />}
              </IconButton>
            </Box>
            {error && (
              <div style={{ color: "red", marginTop: "10px" }}>{error}</div>
            )}
          </CardContent>
        </>
      )}
    </Card>
  );
};

export default UserCard;
