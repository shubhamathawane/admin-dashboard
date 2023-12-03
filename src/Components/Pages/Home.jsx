import * as React from "react";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
import axios from "axios";
import {
  CancelOutlined,
  DeleteOutlineRounded,
  Done,
  EditNoteOutlined,
  Search,
} from "@mui/icons-material";
import { Pagination, Stack } from "@mui/material";
export default function Home() {
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("calories");
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [search, setSearch] = React.useState("");
  const [rows, setRows] = React.useState([]);
  const [editRowId, setEditRowId] = React.useState(null);
  const [editedRows, setEditedRows] = React.useState([]);

  const [originalArray, setOriginalArray] = React.useState([]);

  React.useEffect(() => {
    const getData = async () => {
      try {
        const apiData = await axios.get(
          "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
        );
        console.log(apiData.data);
        setRows(apiData.data);
        setOriginalArray(apiData.data); // Set original data array
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };
    getData();
  }, []);

  function getComparator(order, orderBy) {
    return order === "desc" ? (a, b) => b.id - a.id : (a, b) => a.id - b.id;
  }

  // Since 2020 all major browsers ensure sort stability with Array.prototype.sort().
  // stableSort() brings sort stability to non-modern browsers (notably IE11). If you
  // only support modern browsers you can replace stableSort(exampleArray, exampleComparator)
  // with exampleArray.slice().sort(exampleComparator)
  function stableSort(array, comparator) {
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    {
      id: "id",
      numeric: false,
      disablePadding: true,
      label: "id",
    },
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Name",
    },
    {
      id: "email",
      numeric: true,
      disablePadding: false,
      label: "Email",
    },
    {
      id: "role",
      numeric: true,
      disablePadding: false,
      label: "Role",
    },
    {
      id: "actions",
      numeric: true,
      disablePadding: false,
      label: "Actions",
    },
  ];

  function EnhancedTableHead(props) {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                <p className="text-blue-500">{headCell.label} </p>
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  const handleDeleteSelected = () => {
    if (window.confirm("Are you sure to delete ?") === true) {
      const updatedArrayList = originalArray.filter(
        (item) => !selected.includes(item.id)
      );
      setOriginalArray(updatedArrayList);

      const updatedRows = rows.filter((item) => !selected.includes(item.id));
      setRows(updatedRows);
      setSelected([]);
    }
  };

  function EnhancedTableToolbar(props) {
    const { numSelected } = props;

    return (
      <div className="flex">
        <div>
          {numSelected > 0 && (
            <button
              onClick={handleDeleteSelected}
              className="border rounded text-red-400 fw-sm mx-2"
            >
              <Tooltip title="Delete">
                <DeleteOutlineRounded />
              </Tooltip>
            </button>
          )}
        </div>
        <div>
          {numSelected > 0 && (
            <label className="mx-2">{numSelected} selected</label>
          )}
        </div>
      </div>
    );
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = visibleRows.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows?.length) : 0;

  const handleDelete = (id) => {
    if (window.confirm(`Are you sure you want to delete user with ID ${id}?`)) {
      const updatedOriginalArray = originalArray.filter(
        (item) => item.id !== id
      );
      setOriginalArray(updatedOriginalArray);

      const updatedRows = rows.filter((item) => item.id !== id);
      setRows(updatedRows);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const searchTerm = search.toLowerCase();
    if (searchTerm.trim() === "") {
      setRows(originalArray); // Restore original array if search input is empty
    } else {
      const filteredRows = originalArray.filter(
        (row) =>
          row.id.toString().includes(searchTerm) ||
          row.name.toLowerCase().includes(searchTerm) ||
          row.email.toLowerCase().includes(searchTerm) ||
          row.role.toLowerCase().includes(searchTerm)
      );
      setRows(filteredRows);
    }
  };

  const handleEdit = (id) => {
    setEditRowId(id);
    const rowTo = rows.find((item) => item.id === id);
    setEditedRows([rowTo]);
  };

  const handleInputChange = (e, id) => {
    const { name, value } = e.target;
    console.log("Edited..", editedRows);
    const updatedRows = editedRows.map((item) =>
      item.id === id ? { ...item, [name]: value } : item
    );
    setEditedRows(updatedRows);
  };

  const handleSave = (id) => {
    // setEditRowId(null);
    // const updatedRows = editedRows.find((row) =>
    //   row.id === id ? { ...row } : row
    // );
    // setRows([updatedRows]);

    setEditRowId(null);
    const updatedRows = rows.map((row) =>
      row.id === id ? editedRows.find((editedRow) => editedRow.id === id) : row
    );

    console.log("updated row", updatedRows);

    setRows(updatedRows);
  };

  const handleCancel = () => {
    setEditRowId(null);
    setRows(rows);
  };

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, rows] // Include 'rows' in the dependencies
  );

  return (
    <div className="container">
      <div className="flex items-around justify-center">
        <div>
          <Paper sx={{ width: "100%", mb: 2 }}>
            <div className="flex items-around justify-center">
              <div className="flex">
                <form onSubmit={(e) => handleSearch(e)}>
                  <input
                    className="border rounded px-2"
                    type="text"
                    placeholder="Search"
                    onChange={(e) => setSearch(e.target.value)}
                  />
                  <button
                    className="text-gray-600 mx-2"
                    onClick={(e) => handleSearch(e)}
                  >
                    <Search />
                  </button>
                </form>
                <EnhancedTableToolbar numSelected={selected.length} />
              </div>
            </div>
            <TableContainer>
              <Table
                sx={{ minWidth: 750 }}
                aria-labelledby="tableTitle"
                size={dense ? "small" : "medium"}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  order={order}
                  orderBy={orderBy}
                  onSelectAllClick={handleSelectAllClick}
                  onRequestSort={handleRequestSort}
                  rowCount={rows.length}
                />
                <TableBody>
                  {visibleRows?.map((row, index) => {
                    const isItemSelected = isSelected(row.id);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.id}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        <TableCell padding="checkbox">
                          <Checkbox
                            onClick={(event) => handleClick(event, row.id)}
                            color="primary"
                            checked={isItemSelected}
                            inputProps={{
                              "aria-labelledby": labelId,
                            }}
                          />
                        </TableCell>
                        <TableCell align="left">{row.id}</TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          padding="none"
                        >
                          {editRowId == row.id ? (
                            <>
                              {" "}
                              <input
                                className="border-2 border-gray-500 rounded p-2"
                                type="text"
                                name="name"
                                value={editedRows[0].name}
                                onChange={(e) => handleInputChange(e, row.id)}
                              />{" "}
                            </>
                          ) : (
                            <>{row.name}</>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {editRowId == row.id ? (
                            <>
                              {" "}
                              <input
                                className="border-2 border-gray-500 rounded p-2"
                                type="text"
                                name="email"
                                value={editedRows[0].email}
                                onChange={(e) => handleInputChange(e, row.id)}
                              />{" "}
                            </>
                          ) : (
                            <>{row.email}</>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          {/* role */}
                          {editRowId == row.id ? (
                            <>
                              <select
                                name="role"
                                value={editedRows[0].role}
                                onChange={(e) => handleInputChange(e, row.id)}
                              >
                                <option disabled value="">
                                  Select
                                </option>
                                <option value="admin">admin</option>
                                <option value="Member">Member</option>
                              </select>
                            </>
                          ) : (
                            <>{row.role}</>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <div className="">
                            {editRowId === row.id ? (
                              <>
                                <Tooltip title="Save">
                                  <button
                                    className="border mx-2 save rounded fs-sm text-green-600"
                                    onClick={() => handleSave(row.id)}
                                  >
                                    <Done />
                                    {/* save */}
                                  </button>
                                </Tooltip>
                                <Tooltip title="Cancel">
                                  <button
                                    className="border cancel rounded fs-sm text-red-600"
                                    onClick={() => handleCancel(row.id)}
                                  >
                                    <CancelOutlined />
                                    {/* Cancel */}
                                  </button>
                                </Tooltip>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={(id) => handleEdit(row.id)}
                                  className="border edit mx-2 rounded fs-sm text-gray-600"
                                >
                                  <Tooltip title="Edit">
                                    <EditNoteOutlined />
                                  </Tooltip>
                                </button>
                                <button
                                  onClick={(id) => handleDelete(row.id)}
                                  className="border delet rounded text-red-400 fw-sm"
                                >
                                  <Tooltip title="Delete">
                                    <DeleteOutlineRounded />
                                  </Tooltip>
                                </button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/* <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        /> */}
            <div>
              <Stack spacing={3}>
                <Pagination
                  onChange={handleChangePage}
                  count={visibleRows.length}
                  page={page}
                  showFirstButton
                  showLastButton
                />
              </Stack>
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
}
