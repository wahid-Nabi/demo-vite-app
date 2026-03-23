import { useCallback, useEffect, useRef, useState } from "react";
import { createUser, getAllUsers, updateUser } from "../../../lib/api/users";
import CommonTable from "../../../components/shared/table/common-table";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { Edit, Eye, SearchIcon, X } from "lucide-react";
import { useDebounceSearch } from "../../../hooks/usedebounce_search";
import { useNavigate } from "react-router-dom";
import ActionMenu, {
  type ActionMenuItem,
} from "../../../components/shared/ui/action-menu";
import { UserEditDialog } from "../update/update";
import UserProfile from "../user-details";
import AddUserDialog from "../Add/add-user";
import type { User } from "../types";
import TestComponent from "../../../components/test/test";

const UserList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState({ data: [], total: 0 });
  const [localSearch, setLocalSearch] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [stausFilter, setStatusFilter] = useState<
    "active" | "inactive" | "none"
  >("none");

  const { debouncedSearch } = useDebounceSearch(localSearch, 500);

  const page = Number(searchParams.get("page") || "1");
  const limit = Number(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const sortOrder = searchParams.get("sortOrder") || "";
  const status = searchParams.get("status") || "";
  const columns = [
    { id: "name", label: "Name", dataKey: "name" },
    { id: "email", label: "Email", dataKey: "email" },
    { id: "role", label: "Role", dataKey: "role" },
    {
      id: "status",
      label: "Status",
      dataKey: "status",
      cell: (status: "active" | "inactive" | "none") => (
        <Chip
          size="small"
          label={status}
          color={status === "active" ? "success" : "default"}
        />
      ),
    },
    {
      id: "actions",
      label: "Actions",
      dataKey: "id",
      cell: (id: string, row: User) => (
        <UserListActionMenu id={id} data={row} />
      ),
    },
  ];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const result = await getAllUsers({
          page,
          limit,
          search,
          sortBy,
          sortOrder,
          status,
        });
        setState({ data: result?.data, total: result?.total });
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, [page, limit, search, sortBy, sortOrder, status]);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);

      if (debouncedSearch) {
        params.set("search", debouncedSearch);
        params.set("page", "1");
      } else {
        params.delete("search");
      }

      return params;
    });
  }, [debouncedSearch]);

  useEffect(() => {
    navigate("/users?page=1&limit=10", { replace: true });
  }, []);

  const refetchUsers = async () => {
    const updatedUsers = await getAllUsers({
      page,
      limit,
      search,
    });
    setState({ data: updatedUsers?.data, total: updatedUsers?.total }); // whatever method you already use
  };
  return (
    <Box sx={{ width: "100%", height: "100vh", p: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
          pr: 4,
        }}
      >
        <TextField
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          placeholder="Search..."
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flex: 1, maxWidth: 320 }}
        />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="demo-select-small-label">Status</InputLabel>
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={stausFilter}
              label="Status"
              onChange={(e) => {
                const newStatus = e.target.value as
                  | "active"
                  | "inactive"
                  | "none";

                setStatusFilter(newStatus);
                const params = new URLSearchParams(searchParams.toString());

                if (newStatus === "none") {
                  params.delete("status"); // show all users
                } else {
                  params.set("status", newStatus);
                }

                setSearchParams(params);
              }}
            >
              <MenuItem value="none">
                <em>None</em>
              </MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>

          <Button variant="contained" onClick={() => setOpen(true)}>
            Add User
          </Button>
        </Box>
      </Box>
      {/* <Box sx={{ width: "100%", height: "calc(100vh - 150px)" }}>
        <TestComponent />
      </Box> */}
      <CommonTable columns={columns} data={state.data} total={state.total} />
      <AddUserDialog
        open={open}
        setOpen={setOpen}
        onUserAdded={refetchUsers} // Pass the refetch function to the AddUserDialog
      />
    </Box>
  );
};

export default UserList;

const UserListActionMenu = ({ id, data }: { id: string; data: User }) => {
  const [openProfile, setOpenProfile] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const options: ActionMenuItem[] = [
    {
      icon: Eye,
      label: "View Profile",
      onClick: () => {
        setOpenProfile(true);
        setOpenDrawer(true);
      },
    },
    {
      icon: Edit,
      label: "Edit User",
      onClick: () => setOpenEdit(true),
    },
  ];

  return (
    <>
      <ActionMenu
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        open={Boolean(anchorEl)}
        options={options}
      />
      {openProfile && (
        <UserProfile
          handleClose={() => setOpenDrawer(false)}
          openProfile={openDrawer}
        />
      )}
      <UserEditDialog
        openEdit={openEdit}
        user={data}
        handleClose={() => setOpenEdit(false)}
      />
    </>
  );
};
