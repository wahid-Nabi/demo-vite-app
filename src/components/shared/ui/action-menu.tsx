import { IconButton, Menu, MenuItem } from "@mui/material";
import { EllipsisVertical } from "lucide-react";
import React from "react";

type ActionMenuItem = {
  label: string;
  icon?: React.ElementType;
  onClick?: () => void;
  disabled?: boolean;
  hidden?: boolean;
};

type Props = {
  options: ActionMenuItem[];
  anchorEl: HTMLElement | null;
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  open: boolean;
  children?: React.ReactNode;
};

const ActionMenu = ({
  options,
  anchorEl,
  setAnchorEl,
  open,
  children,
}: Props) => {
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOptionClick = (option: ActionMenuItem) => {
    handleClose(); // close menu first
    option.onClick?.(); // then run action
  };

  return (
    <>
      <IconButton size="small" onClick={(e) => setAnchorEl(e.currentTarget)}>
        <EllipsisVertical size={16} />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option.label}
            onClick={() => handleOptionClick(option)}
            disabled={option.disabled}
            sx={{
              display: option.hidden ? "none" : "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            {option.icon && <option.icon size={16} />}
            {option.label}
          </MenuItem>
        ))}
      </Menu>

      {children}
    </>
  );
};

export default ActionMenu;
