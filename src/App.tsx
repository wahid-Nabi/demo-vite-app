import { Button, Menu, MenuItem } from "@mui/material";
import "./App.css";
import CommonTable from "./components/shared/table/common-table";
import { useState } from "react";
import { useNavigate, Routes, Route } from "react-router-dom";
import UserList from "./modules/users/listing";
import UserProfile from "./modules/users/user-details";

function App() {
  const data = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      phone: "123-456-78900",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      phone: "987-654-32100",
    },
  ];

  const columns = [
    { id: "name", label: "Name", dataKey: "name" },
    { id: "email", label: "Email", dataKey: "email" },
    { id: "phone", label: "Phone", dataKey: "phone" },
    {
      id: "acti",
      label: "Actions",
      dataKey: "id",
      cell: (value: number) => <UserTableActionMenu id={value} />,
    },
  ];
  return (
    <Routes>
      <Route path="/" element={<CommonTable columns={columns} data={data} />} />
      <Route path="/user/profile/:id" element={<UserProfile />} />
      <Route path="/users" element={<UserList />} />
    </Routes>
  );
}

export default App;

const UserTableActionMenu = ({ id }: { id: number }) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-positioned-button"
        aria-controls={open ? "demo-positioned-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Actions
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <MenuItem onClick={() => navigate(`/profile/${id}`)}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </div>
  );
};
