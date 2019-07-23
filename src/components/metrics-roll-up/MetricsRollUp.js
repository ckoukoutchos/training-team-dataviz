import React from 'react';
import { Link } from 'react-router-dom';
import { CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import styles from './MetricsRollUp.module.css';

const MetricsRollUp = props => {
  const { associate, associates, cycle } = props;

  return (
    associate || associates ?
      <Paper className={styles.Container}>
        <Table className={styles.Table}>
          <TableHead>
            <TableRow>
              {associates ? <TableCell align='left'>Associate</TableCell> : null}
              <TableCell align='center'>Project Average</TableCell>
              <TableCell align='center'>Quiz Average</TableCell>
              <TableCell align='center'>Soft Skill Average</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {associates ?
              Object.entries(associates).map(([name, values], index) => {
                if (name === cycle) {
                  return;
                } else {
                  const associateUrl = `/cycle/${cycle}/associate/${name.split(' ').join('-')}`;
                  return <TableRow key={index}>
                    <TableCell align='left'>
                      <Link to={associateUrl} className={styles.Link}>
                        {name}
                      </Link>
                    </TableCell>
                    <TableCell align='center'>{values.projectAvg}%</TableCell>
                    <TableCell align='center'>{values.quizAvg}%</TableCell>
                    <TableCell align='center'>{values.softSkillsAvg}%</TableCell>
                  </TableRow>
                }
              }) : <TableRow>
                <TableCell align='center'>
                  {associate.projectAvg}%
                </TableCell>
                <TableCell align='center'>
                  {associate.quizAvg}%
                </TableCell>
                <TableCell align='center'>
                  {associate.softSkillsAvg}%
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </Paper>
      : <CircularProgress />
  );
}

export default MetricsRollUp;