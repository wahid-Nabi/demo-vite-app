import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  useTheme,
  type SelectChangeEvent,
  type Theme,
} from "@mui/material";
import { useState } from "react";

const TestComponent = () => {
  const [multipselectValue, setMultiselectValue] = useState<number[]>([]);
  const theme = useTheme();
  const handleChange = (event: SelectChangeEvent<number[]>) => {
    //console.log(event);
    const {
      target: { value },
    } = event;
    setMultiselectValue(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",").map(Number) : value,
    );
  };
  console.log(multipselectValue);
  function getStyles(
    id: number,
    multipselectValue: readonly number[],
    theme: Theme,
  ) {
    return {
      fontWeight: multipselectValue.includes(id)
        ? theme.typography.fontWeightMedium
        : theme.typography.fontWeightRegular,
    };
  }
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };
  const names = [
    {
      id: 1,
      name: "Oliver Hansen",
    },
    {
      id: 2,
      name: "Lino",
    },
    {
      id: 3,
      name: "john",
    },
  ];
  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-chip-label">
          Select Multiple user
        </InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          value={multipselectValue}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => {
            console.log("select value", selected);

            return (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((id) => {
                  const user = names.find((u) => u.id === id);
                  console.log("user is", user);
                  return <Chip key={id} label={user?.name} />;
                })}
              </Box>
            );
          }}
          MenuProps={MenuProps}
        >
          {names.map((item) => (
            <MenuItem
              key={item.id}
              value={item.id}
              style={getStyles(item.id, multipselectValue, theme)}
            >
              {item.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default TestComponent;
