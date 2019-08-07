import React from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import styles from './AssociateInfo.module.css';
import { calcDaysSince } from '../../shared/dataService';
import CONSTS from '../../shared/constants';
import { Associate } from '../../models/types';

interface AssociateInfoProps {
  associate: Associate;
  bodyOnly?: boolean;
}

const AssociateInfo = (props: AssociateInfoProps) => {
  const { associate, bodyOnly } = props;

  const infoBody = (
    <div className={styles.BodyOnly}>
      <div>
        <Typography variant='body2'>
          <strong>Start Date:</strong> {associate.startDate}
        </Typography>

        {associate.endDate && (
          <Typography variant='body2'>
            <strong>End Date: </strong>
            {associate.endDate}
          </Typography>
        )}
      </div>

      <div>
        <Typography variant='body2'>
          <strong>Days in Cycle:</strong>{' '}
          {associate.endDate
            ? calcDaysSince(associate.startDate, associate.endDate)
            : calcDaysSince(associate.startDate)}
        </Typography>

        {associate.endDate && (
          <Typography variant='button' display='block'>
            {associate.exitReason}
          </Typography>
        )}
      </div>
    </div>
  );

  return bodyOnly ? (
    infoBody
  ) : (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h3'>{associate.name}</Typography>
        <Typography variant='h6' color='textSecondary'>
          {CONSTS[associate.cycle]}
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      {infoBody}
    </Paper>
  );
};

export default AssociateInfo;
