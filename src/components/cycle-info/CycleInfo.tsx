import React from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import styles from './CycleInfo.module.css';
import { Cycle, Staff, StaffRole } from '../../models/types';

interface CycleInfoProps {
  bodyOnly?: boolean;
  cycleName: string;
  cycle: Cycle;
}

const CycleInfo = (props: CycleInfoProps) => {
  const { bodyOnly, cycleName, cycle } = props;
  const formattedName = cycleName
    .split(' ')
    .slice(2)
    .join(' ');
  const activeTrainers: string[] = [];
  cycle.staff.forEach((staff: Staff) => {
    if (staff.active && staff.role === StaffRole.TRAINER) {
      activeTrainers.push(staff.name);
    }
  });
  const activeTAs: string[] = [];
  cycle.staff.forEach((staff: Staff) => {
    if (staff.active && staff.role === StaffRole.TA) {
      activeTAs.push(staff.name);
    }
  });

  const infoBody = (
    <div className={styles.Body}>
      <div>
        <Typography variant='body2'>
          <strong>Trainer(s): </strong>
          {activeTrainers.join(' | ')}
        </Typography>

        <Typography variant='body2'>
          <strong>TA(s): </strong>
          {activeTAs.join(' | ')}
        </Typography>

        <Typography variant='body2'>
          <strong>Total # Associates: </strong>
          {cycle.totalNumberOfAssociates}
        </Typography>
      </div>

      <div>
        <Typography variant='body2'>
          <strong>Start Date(s): </strong>
          {cycle.startDate.toDateString()}
        </Typography>

        <Typography variant='body2'>
          <strong>End Date: </strong>
          {cycle.endDate ? cycle.endDate.toDateString() : null}
        </Typography>

        <Typography variant='body2'>
          <strong>Current # Associates: </strong>
          {cycle.currentNumberOfAssociates}
        </Typography>
      </div>
    </div>
  );

  return bodyOnly ? (
    infoBody
  ) : (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h3'>{formattedName}</Typography>

        <Typography variant='h6' color='textSecondary'>
          {cycle.type}
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      {infoBody}
    </Paper>
  );
};

export default CycleInfo;
