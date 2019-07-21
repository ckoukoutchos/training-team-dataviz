import React from 'react';
import { Avatar, Card, CardContent, CardHeader, Typography } from '@material-ui/core';
import styles from './AssociateInfo.module.css';

const AssociateInfo = (props) => {
  const { Date: date, Person } = props.associate.find(item => item['Interaction Type'] === 'Associate Start');
  
  return (
    <Card className={styles.Card}>
      <CardHeader avatar={<Avatar>{Person[0]}</Avatar>} title={Person} subheader={props.cycle} />
      <CardContent>
        <Typography variant='body2' component='p'>
          Start Date: {date}
        </Typography>
        <Typography variant='body2' component='p'>
          Days in Cycle: {calcDaysSince(date)}
        </Typography>
      </CardContent>
    </Card >
  );
}

const calcDaysSince = (date) => {
  const dateSplit = date.split('/');
  const startDate = new Date('20' + dateSplit[2], dateSplit[0], dateSplit[1]);
  const daysSinceStart = (Date.now() - startDate) / 86400000;
  return Math.round(daysSinceStart);
}

export default AssociateInfo;