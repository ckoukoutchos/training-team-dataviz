import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from '@material-ui/core';

interface BasicTable {
  headers: string[];
  rows: number[][];
}

const BasicTable = (props: BasicTable) => {
  const { headers, rows } = props;

  return (
    <Table>
      <TableHead>
        <TableRow>
          {headers.map((header: string, index: number) => (
            <TableCell key={index} align='left'>
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row: number[], index: number) => (
          <TableRow key={index}>
            {row.map((item: number, index: number) => (
              <TableCell key={index} align='left'>
                {item}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default BasicTable;
