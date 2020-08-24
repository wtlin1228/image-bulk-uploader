import React from "react";
import PropTypes from "prop-types";
import { makeStyles, styled } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

// eslint-disable-next-line
const StyledTableRow = styled(({ isInvalid, ...other }) => (
  <TableRow {...other} />
))(({ isInvalid }) => ({
  backgroundColor: isInvalid && "#f60649ab",
}));

export default function SimpleTable({ rows }) {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>檔案名稱</TableCell>
            <TableCell align="right">科目</TableCell>
            <TableCell align="right">Cover Range</TableCell>
            <TableCell align="right">ItemSN</TableCell>
            <TableCell align="right">Qid</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow
              key={row.name}
              isInvalid={
                row.subject === "" || row.coverRange === "" || row.itemSN === ""
              }
            >
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.subject}</TableCell>
              <TableCell align="right">{row.coverRange}</TableCell>
              <TableCell align="right">{row.itemSN}</TableCell>
              <TableCell align="right">{row.qid}</TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

SimpleTable.propTypes = {
  rows: PropTypes.array.isRequired,
};
