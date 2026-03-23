import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getUserById } from "../../../lib/api/users";
import { Box, Drawer, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";
import { InboxIcon, MailIcon } from "lucide-react";
type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "none";
};
const UserProfile = ({
  openProfile,
  handleClose,
}: {
  openProfile: boolean;
  handleClose: () => void;
}) => {
  const { id } = useParams();
  const [data, setData] = useState<User>({
    id: 0,
    name: "",
    email: "",
    role: "",
    status: "none",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const data = await getUserById(Number(id));
        setData(data);
      } catch (error) {
        console.log(error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  type Anchor = "right";
  const anchor: Anchor = "right";

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: 300, p: 2 }}
      role="presentation"
      onKeyDown={toggleDrawer(anchor, openProfile)}
    >
      {data && (
        <>
          <ListItemIcon>
            {data.id % 2 === 0 ? <InboxIcon /> : <MailIcon />}
          </ListItemIcon>

          <ListItemText primary="Name" secondary={data.name} />
          <ListItemText primary="Email" secondary={data.email} />
          <ListItemText primary="Role" secondary={data.role} />
          <ListItemText primary="Status" secondary={data.status} />
        </>
      )}
    </Box>
  );
  return (
    <div>
      {/* <Button onClick={toggleDrawer(anchor, true)}>View User</Button> */}

      <Drawer anchor={anchor} open={openProfile} onClose={() => handleClose()}>
        {list(anchor)}
      </Drawer>
    </div>
  );
};
export default UserProfile;
