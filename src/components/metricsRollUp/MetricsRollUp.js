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
            <TableCell align='left'>Project Average</TableCell>
            <TableCell align='left'>Quiz Average</TableCell>
            <TableCell align='left'>Soft Skill Average</TableCell>
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
                <TableCell align='left'>{calcProjectScoreAvg(row)}%</TableCell>
                <TableCell align='left'>{calcQuizScoreAvg(row)}%</TableCell>
                <TableCell align='left'>{calcSoftSkillsScoreAvg(row)}%</TableCell>
              </TableRow>
            }) : <TableRow>
              <TableCell align='left'>{calcProjectScoreAvg(associate)}%</TableCell>
              <TableCell align='left'>{calcQuizScoreAvg(associate)}%</TableCell>
              <TableCell align='left'>{calcSoftSkillsScoreAvg(associate)}%</TableCell>
            </TableRow>
          }
        </TableBody>
      </Table>
    </Paper>
  );
}

export default MetricsRollUp;