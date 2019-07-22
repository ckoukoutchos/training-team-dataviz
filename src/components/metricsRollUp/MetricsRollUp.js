import React from 'react';
import { Link } from 'react-router-dom';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { calcProjectScoreAvg, calcQuizScoreAvg, calcSoftSkillsScoreAvg } from '../../shared/dataService';
import styles from './MetricsRollUp.module.css';

const MetricsRollUp = props => {
  const { associate, associates, cycleName, showName } = props;

  return (
    <Paper className={styles.Container}>
      <Table className={styles.Table}>
        <TableHead>
          <TableRow>
            {showName ? <TableCell align='left'>Associate</TableCell> : null}
            <TableCell align='center'>Project Average</TableCell>
            <TableCell align='center'>Quiz Average</TableCell>
            <TableCell align='center'>Soft Skill Average</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {associates ?
            associates.map((row, index) => {
              const associateUrl = `/cycle/${cycleName}/associate/${row[0].Person.split(' ').join('-')}`;
              return <TableRow key={index}>
                <TableCell align='left'>
                  <Link to={associateUrl} className={styles.Link}>
                    {row[0].Person}
                  </Link>
                </TableCell>
                <TableCell align='center'>{calcProjectScoreAvg(row)}%</TableCell>
                <TableCell align='center'>{calcQuizScoreAvg(row)}%</TableCell>
                <TableCell align='center'>{calcSoftSkillsScoreAvg(row)}%</TableCell>
              </TableRow>
            }) : <TableRow>
              <TableCell align='center'>{calcProjectScoreAvg(associate)}%</TableCell>
              <TableCell align='center'>{calcQuizScoreAvg(associate)}%</TableCell>
              <TableCell align='center'>{calcSoftSkillsScoreAvg(associate)}%</TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </Paper>
  );
}

export default MetricsRollUp;