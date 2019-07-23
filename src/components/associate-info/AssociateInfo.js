import React from 'react';
import { Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import styles from './AssociateInfo.module.css';
import { calcDaysSince } from '../../shared/dataService';
import CONSTS from '../../shared/constants';

const AssociateInfo = (props) => {
  const { Date: startDate, Person } = props.associate.find(item => item['Interaction Type'] === 'Associate Start');
  const exitRegex = RegExp('Cycle Exit');
  const endDate = props.associate.find(item => exitRegex.test(item['Interaction Type']));

  return (
    <Card className={styles.Card}>
      <CardHeader component='h1' title={Person} subheader={CONSTS[props.cycle]} />
      <CardContent>
        <Typography variant='body2' component='p'>
          <strong>Start Date:</strong> {startDate}
        </Typography>
        <Typography variant='body2' component='p'>
          <strong>Days in Cycle:</strong> {endDate ? calcDaysSince(startDate, endDate.Date) : calcDaysSince(startDate)}
        </Typography>
        {endDate ?
          <>
            <Typography variant='body2' component='p'>
              <strong>End Date: </strong>{endDate.Date}
            </Typography>
            <Typography variant="button" display="block" gutterBottom>
              {endDate['Interaction Type']}
            </Typography>
          </>
          : null}
      </CardContent>
    </Card >
  );
}

export default AssociateInfo;