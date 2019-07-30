import React from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import styles from './AssociateInfo.module.css';
import { calcDaysSince } from '../../shared/dataService';
import CONSTS from '../../shared/constants';

const AssociateInfo = (props) => {
  const { Date: startDate, Person } = props.associate.find(item => item['Interaction Type'] === 'Associate Start');
  const exitRegex = RegExp('Cycle Exit');
  const endDate = props.associate.find(item => exitRegex.test(item['Interaction Type']));

  return (
    !props.bodyOnly ? <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h3'>
          {Person}
        </Typography>
        <Typography variant='h6' color='textSecondary'>
          {CONSTS[props.cycle]}
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      <div className={styles.Body}>
        <div>
          <Typography variant='body2'>
            <strong>Start Date:</strong> {startDate}
          </Typography>
          {endDate ?
            <>
              <Typography variant='body2'>
                <strong>End Date: </strong>{endDate.Date}
              </Typography>
            </>
            : null}
        </div>

        <div>
          <Typography variant='body2'>
            <strong>Days in Cycle:</strong> {endDate ? calcDaysSince(startDate, endDate.Date) : calcDaysSince(startDate)}
          </Typography>
          {endDate ?
            <Typography variant="button" display="block">
              {endDate['Interaction Type']}
            </Typography> : null}
        </div>
      </div>
    </Paper >
      : <div className={styles.BodyOnly}>
        <div>
          <Typography variant='body2'>
            <strong>Start Date:</strong> {startDate}
          </Typography>
          {endDate ?
            <>
              <Typography variant='body2'>
                <strong>End Date: </strong>{endDate.Date}
              </Typography>
            </>
            : null}
        </div>

        <div>
          <Typography variant='body2'>
            <strong>Days in Cycle:</strong> {endDate ? calcDaysSince(startDate, endDate.Date) : calcDaysSince(startDate)}
          </Typography>
          {endDate ?
            <Typography variant="button" display="block">
              {endDate['Interaction Type']}
            </Typography> : null}
        </div>
      </div>
  );
}

export default AssociateInfo;