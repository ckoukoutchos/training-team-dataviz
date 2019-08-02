import React from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';

const BasicTable = props => {
  const { headers, rows } = props;

  return (
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((header, index) => <TableCell key={index} align="left">{header}</TableCell>)}
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          {rows.map((row, index) => <TableCell key={index} align="left">{row}</TableCell>)}
        </TableRow>
      </TableBody>
    </Table>
  );
}

export default BasicTable;