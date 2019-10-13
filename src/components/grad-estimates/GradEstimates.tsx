import React from 'react';
import styles from './GradEstimates.module.css';
import { Paper, Typography, Divider, Tooltip } from '@material-ui/core';
import { Associate, Aggregation, Module, Assessment } from '../../models/types';
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

  let associateELO = 1500;
  let wins = 0;
  let losses = 0;
  const assignments = [
    ...associate.projects,
    ...associate.exercises,
    ...associate.quizzes
  ];
  assignments.forEach((assignment: any) => {
    let actual = 0;
    let opponent = 1500;
    if (assignment['Interaction Type']) {
      actual =
        assignment.Score === 'Pass' || assignment.Score === 'Completed' ? 1 : 0;
      actual === 1 ? wins++ : losses++;
    } else if (assignment.type === 'Quiz') {
      actual = assignment.score >= 80 ? 1 : 0;
      actual === 1 ? wins++ : losses++;
      opponent = 1450;
    } else {
      actual = assignment.score >= 90 ? 1 : 0;
      actual === 1 ? wins++ : losses++;
      opponent = 1600;
    }
    const expected = 1 / (1 + Math.pow(10, (opponent - associateELO) / 400));
    associateELO = associateELO + 20 * (actual - expected);
  });

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

        <Typography variant='subtitle1'>
          <strong>ELO: </strong> {Math.round(associateELO)}
          <Tooltip
            className={styles.Tooltip}
            title={
              <>
                <Typography>
                  Ranking system assuming assignments are opponents of a certain
                  strength and passing the assignment constitutes a "win" and
                  failing a "loss". Associates ELO is adjusted up or down based
                  on wins/losses and the adjustment size is relative to the
                  opponents strength.
                </Typography>
                <ul>
                  <li>
                    <Typography>Projects: 1600</Typography>
                  </li>
                  <li>
                    <Typography>Exercises: 1500</Typography>
                  </li>
                  <li>
                    <Typography>Quizzes: 1450</Typography>
                  </li>
                </ul>
                <Typography>
                  The tougher the opponent, the bigger the gain. An associate
                  with a score over 1600 would be expected to pass most
                  projects; one with a score below 1600 would be expected to
                  take multiple attempts.
                </Typography>
                <Typography>
                  Wins: {wins}, Losses: {losses}
                </Typography>
              </>
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
