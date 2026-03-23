import { useState } from "react";
import { getAllUsers, updateUser } from "../../../lib/api/users";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import type { User } from "../types";

export const UserEditDialog = ({
  openEdit,
  user,
  handleClose,
}: {
  openEdit: boolean;
  user?: User;
  handleClose?: () => void;
}) => {
  const [editFormData, setEditFormData] = useState<User>(
    user || {
      id: 0,
      name: "",
      email: "",
      role: "",
      status: "none",
    },
  );
  const handleSave = () => {
    // Implement save logic here, e.g., call an API to update the user
    console.log("Saving user data:", editFormData);
    try {
      const updateUserData = async () => {
        const response = await updateUser({ userData: editFormData });
        console.log("Update response:", response);
        alert("User updated successfully!");
        handleClose?.();
        // Optionally, you can refresh the user list after adding a new user
        const updatedUsers = await getAllUsers({
          page: 1,
          limit: 10,
          search: "",
        });
        setState({ data: updatedUsers?.data, total: updatedUsers?.total });
      };
      updateUserData();
    } catch (error) {
      console.error("Error updating user:", error);
    }
    handleClose?.();
  };
  return (
    <Dialog
      open={openEdit}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Edit User
      </DialogTitle>
      <DialogContent dividers>
        <Box>
          {/* Form fields for editing user details */}
          {!editFormData && <div>No user data available</div>}
          <TextField
            label="Name"
            value={editFormData.name}
            onChange={(e) =>
              setEditFormData({ ...editFormData, name: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            value={editFormData.email}
            onChange={(e) =>
              setEditFormData({ ...editFormData, email: e.target.value })
            }
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="role-select-label">Role</InputLabel>
            <Select
              labelId="role-select-label"
              id="role-select"
              label="Role"
              value={editFormData.role}
              onChange={(e) =>
                setEditFormData({ ...editFormData, role: e.target.value })
              }
            >
              <MenuItem value="Content Strategist">Content Strategist</MenuItem>
              <MenuItem value="QA Engineer">QA Engineer</MenuItem>
              <MenuItem value="DevOps Engineer">DevOps Engineer</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Checkbox
                name="status"
                checked={editFormData.status === "active"}
                onChange={(e) =>
                  setEditFormData({
                    ...editFormData,
                    status: e.target.checked ? "active" : "inactive",
                  })
                }
              />
            }
            label="Active Status"
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} variant="outlined" color="primary">
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};
