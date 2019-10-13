import React from 'react';
import styles from './GradEstimates.module.css';
import { Paper, Typography, Divider, Tooltip } from '@material-ui/core';
import { Associate, Aggregation, Module } from '../../models/types';
import Metadata from '../../shared/metadata';
import { HelpOutline } from '@material-ui/icons';

interface GradEstimateProps {
  associate: Associate;
  aggregation: Aggregation;
}

const GradEstimate = (props: GradEstimateProps) => {
  console.log(props);
  const { aggregation, associate } = props;
  const tradModuleDays = [25.2, 16.8, 42, 33.6];

  let days = 0;
  associate.modules.forEach((modules: Module, index: number) => {
    if (modules.startDate && modules.endDate) {
      days += modules.daysInModule;
    } else if (modules.startDate && !modules.endDate && index < 4) {
      if (aggregation.moduleTime) {
        days += tradModuleDays[index] / (aggregation.moduleTime / 100);
      }
    } else {
      days += Metadata.maxTimePerModule[index];
    }
  });

  const gradChance = Math.round((aggregation.combined - 72) * 3.3 + 50);

  return (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h3'>Graduation Estimates</Typography>
        <Typography variant='h6' color='textSecondary'>
          Estimated Graduation Date and Likelihood
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      <div className={styles.Body}>
        <Typography variant='subtitle1'>
          <strong>Estimated Graduation: </strong>{' '}
          {new Date(
            associate.startDate.valueOf() + 86400000 * (days - 5)
          ).toDateString()}
          <Tooltip
            className={styles.Tooltip}
            title={
              <Typography>
                Starts assuming the max time per module, then adjusts based on
                actual speed in prior modules.
              </Typography>
            }
          >
            <HelpOutline />
          </Tooltip>
        </Typography>

        <Typography variant='subtitle1'>
          <strong>Graduation Likelihood: </strong>{' '}
          {gradChance >= 100 ? 99 : gradChance}%
          <Tooltip
            className={styles.Tooltip}
            title={
              <Typography>
                Threshold model based on the combined score. Minimum score of
                72% equates to a 50% chance of graduation.
              </Typography>
            }
          >
            <HelpOutline />
          </Tooltip>
        </Typography>
      </div>
    </Paper>
  );
};

export default GradEstimate;
