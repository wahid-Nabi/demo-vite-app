import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import type { User } from "../types";
import { useState } from "react";
import { createUser } from "../../../lib/api/users";

const AddUserDialog = ({
  open,
  setOpen,
  onUserAdded,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  onUserAdded: () => void; // Callback to refetch users after adding a new user
}) => {
  const [formData, setFormData] = useState<User>({
    id: 0,
    name: "",
    email: "",
    role: "",
    status: "none",
  });
  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    role: "",
  });
  const Roles = ["Admin", "Editor", "Viewer"];
  const validateField = (fieldName: string, value: string) => {
    let error = "";
    if (fieldName === "name") {
      if (!value.trim()) error = "Name is required";
    } else if (fieldName === "email") {
      if (!value.trim()) {
        error = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        error = "Enter a valid email";
      }
    } else if (fieldName === "role") {
      if (!value) error = "Role is required";
    }
    setFormErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  const isFormValid =
    formData.name.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
    formData.role &&
    !formErrors.name &&
    !formErrors.email &&
    !formErrors.role;

  const submitHandler = async () => {
    try {
      console.log("Submitting form with data:", formData);
      const result = await createUser(formData);
      console.log("Form Data Submitted:", formData, "Result:", result);
      onUserAdded();
      setOpen(false);
      // Optionally, you can refresh the user list after adding a new user
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            onBlur={() => validateField("name", formData.name)}
            error={!!formErrors.name}
            helperText={formErrors.name}
            fullWidth
            margin="normal"
            inputProps={{ "data-testid": "name-input" }}
          />
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            onBlur={() => validateField("email", formData.email)}
            error={!!formErrors.email}
            helperText={formErrors.email}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth error={!!formErrors.role}>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={formData.role}
              label="Role"
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value } as User)
              }
              onBlur={() => validateField("role", formData.role)}
            >
              {Roles.map((item) => (
                <MenuItem key={item} value={item}>
                  {item}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {formErrors.role && (
            <span style={{ fontSize: "0.75rem", color: "#d32f2f" }}>
              {formErrors.role}
            </span>
          )}
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.status === "active" ? true : false}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.checked ? "active" : "inactive",
                    } as User)
                  }
                />
              }
              label="Status"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={submitHandler}
            color="primary"
            disabled={!isFormValid}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default AddUserDialog;
