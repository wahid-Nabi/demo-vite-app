import {
  Box,
  Pagination,
  PaginationItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  MenuItem,
  type SelectChangeEvent,
  Select,
  TableRow,
  Typography,
  Menu,
  IconButton,
} from "@mui/material";
import { EllipsisVertical } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

type ColumnConfig<T> = {
  id: string;
  label: string;
  className?: string;
  dataKey: string;
  cell?: (
    value: any,
    row: T,
    columnIndex: number,
    rowIndex: number,
    data: T[],
  ) => ReactNode;
};

const CommonTable = <T,>({
  columns,
  data,
  total,
}: {
  columns: ColumnConfig<T>[];
  data: T[];
  total: number;
}) => {
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table sx={{ width: "100%" }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell key={column.id} className={column.className}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ ml: 1 }}
                  >
                    {column.label}
                  </Typography>

                  {column.id !== "actions" && (
                    <TableColumnMoreActions column={column} />
                  )}
                </Box>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={row[columns[0].dataKey as keyof T] as string}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              {columns.map((column, columnIndex) => {
                const cellValue = row[column.dataKey as keyof T];
                const displayValue = column.cell
                  ? column.cell(cellValue, row, columnIndex, rowIndex, data)
                  : cellValue;
                return (
                  <TableCell key={column.id}>
                    {displayValue as string}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box
        sx={{
          display: "flex",
          borderTop: "1px solid #e0e0e0",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        <Typography variant="body2" color="textSecondary">
          {`Showing ${data.length} of ${total} entries`}
        </Typography>
        <TablePagination total={total} />
        <PageSizeSelector />
      </Box>
    </TableContainer>
  );
};

export default CommonTable;

const TablePagination = ({ total }: { total: number }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (
    _: React.ChangeEvent<unknown, Element>,
    page: number,
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    setSearchParams(params);
  };
  const currentPage = Number(searchParams.get("page") || "1");
  const count = Math.ceil(total / Number(searchParams.get("limit") || "10"));
  console.log({ total, count, currentPage });
  return (
    <Pagination
      variant="outlined"
      shape="rounded"
      count={count}
      page={currentPage}
      onChange={handleChange}
      renderItem={(item) => {
        // console.log(item);
        if (item.type === "previous" && currentPage <= 1) {
          return <PaginationItem {...item} disabled />;
        }
        if (item.type === "next" && currentPage >= count) {
          return <PaginationItem {...item} disabled />;
        }
        return <PaginationItem {...item} />;
      }}
    />
  );
};

const PageSizeSelector = () => {
  const PAGE_OPTIONS = [10, 25, 50, 100];
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = (event: SelectChangeEvent) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("limit", event.target.value);
    setSearchParams(params);
  };

  return (
    <Select
      size="small"
      id="page-size-select"
      value={searchParams.get("limit") || PAGE_OPTIONS[0].toString()}
      onChange={handleChange}
      displayEmpty
      sx={{ width: 100 }}
    >
      {PAGE_OPTIONS.map((option) => (
        <MenuItem key={option} value={option.toString()}>
          {option}
        </MenuItem>
      ))}
    </Select>
  );
};

const TableColumnMoreActions = <T,>({
  column,
}: {
  column: ColumnConfig<T>;
}) => {
  const options = ["Asc", "Desc"];
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const open = Boolean(anchorEl);
  const [searchParams, setSearchParams] = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  return (
    <>
      <IconButton
        size="small"
        onClick={(e) => {
          setAnchorEl(e.currentTarget);
          setSelectedColumn(column.dataKey);
        }}
      >
        <EllipsisVertical size={16} />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => {
          setAnchorEl(null);
          setSelectedColumn(null);
        }}
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
            key={option}
            onClick={() => {
              console.log("Column:", selectedColumn);
              console.log("Sort:", option);
              params.set("sortBy", selectedColumn || "");
              params.set("sortOrder", option.toLowerCase());
              setSearchParams(params);
              setAnchorEl(null);
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};
