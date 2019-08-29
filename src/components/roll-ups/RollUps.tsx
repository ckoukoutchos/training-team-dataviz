import React from 'react';
import { Divider, Paper, Tooltip, Typography } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import styles from './RollUps.module.css';
import { Aggregation } from '../../models/types';

interface RollUpsProps {
  aggregation: Aggregation;
  showComposite: boolean;
}

const RollUps = (props: RollUpsProps) => {
  const { aggregation, showComposite } = props;

  const getCompositeBackground = (score: number) => {
    switch (score) {
      case 1:
        return ['Circle', 'Red', 'Number1'];
      case 2:
        return ['Circle', 'Orange', 'Number1'];
      case 3:
        return ['Circle', 'Green', 'Number1'];
      case 4:
        return ['Burst8', 'Green', 'Number2'];
      case 5:
        return ['Burst12', 'Green', 'Number2'];
      default:
        return ['Circle', 'Red', 'Number1'];
    }
  };
  const background = getCompositeBackground(aggregation.composite);

  return (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h3'>Score Aggregations</Typography>
        <Typography variant='h6' color='textSecondary'>
          Roll Ups of Assessments, Attendance, and Module Time
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      <div className={styles.Body}>
        <Typography variant='h6'>
          <strong>Combined:</strong> {aggregation.combined}%
          <Tooltip
            className={styles.Tooltip}
            title={
              <>
                <Typography>
                  A weighted score of assessments, attendance, and module time:
                </Typography>
                <Typography>Traditional Cycles:</Typography>
                <ul>
                  <li>
                    <Typography>Assessments: 60%</Typography>
                  </li>
                  <li>
                    <Typography>Attendance: 40%</Typography>
                  </li>
                </ul>
                <Typography>Mastery Learning Cycles:</Typography>
                <ul>
                  <li>
                    <Typography>Assessments: 40%</Typography>
                  </li>
                  <li>
                    <Typography>Attendance: 40%</Typography>
                  </li>
                  <li>
                    <Typography>Module Time: 20%</Typography>
                  </li>
                </ul>
              </>
            }
          >
            <HelpOutline />
          </Tooltip>
        </Typography>

        {showComposite && (
          <Tooltip
            className={styles.Tooltip}
            title={
              <>
                <Typography>
                  Composite score based on associate's combined score relative
                  to cycle average:
                </Typography>
                <ul>
                  <li>
                    <Typography>
                      3: within one standard deviation of mean
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      4 & 2: +/- one standard deviation from mean
                    </Typography>
                  </li>
                  <li>
                    <Typography>
                      5 & 1: +/- two standard deviations from mean
                    </Typography>
                  </li>
                </ul>
              </>
            }
          >
            <div style={{ position: 'relative' }}>
              <div
                className={[styles[background[0]], styles[background[1]]].join(
                  ' '
                )}
              />
              <Typography variant='h1' className={styles[background[2]]}>
                {aggregation.composite}
              </Typography>
            </div>
          </Tooltip>
        )}

        <div>
          <Typography variant='subtitle1'>
            <strong>Assessments:</strong> {aggregation.assessments}%
            <Tooltip
              className={styles.Tooltip}
              title={
                <>
                  <Typography>A weighted score of all assessments:</Typography>
                  <ul>
                    <li>
                      <Typography>Projects: 45%</Typography>
                    </li>
                    <li>
                      <Typography>Soft Skills: 45%</Typography>
                    </li>
                    <li>
                      <Typography>Quizzes: 10%</Typography>
                    </li>
                  </ul>
                </>
              }
            >
              <HelpOutline />
            </Tooltip>
          </Typography>

          <div>
            <Typography variant='subtitle1'>
              <strong>Attendance:</strong> {aggregation.attendance}%
              <Tooltip
                className={styles.Tooltip}
                title={
                  <>
                    <Typography>
                      A weighted score of attendance events:
                    </Typography>
                    <ul>
                      <li>
                        <Typography>Unexcused Absence: -5</Typography>
                      </li>
                      <li>
                        <Typography>Unexcused Late Arrival: -1</Typography>
                      </li>
                      <li>
                        <Typography>Excused Absence: -0.5</Typography>
                      </li>
                      <li>
                        <Typography>Excused Late Arrival: -0.2</Typography>
                      </li>
                    </ul>
                    <Typography>
                      ((Total number of class days) + (sum of attendance event
                      modifiers)) / (Total number of class days)
                    </Typography>
                    <hr />
                    <Typography>
                      Ex. Associate has been in cycle for 10 class days with 1
                      unexcused absence and 1 unexcused late:
                    </Typography>
                    <ul>
                      <li>
                        <Typography>
                          Attendance modifier: -5 (Unexcused Absence) + -1
                          (Unexcused Late) = -6
                        </Typography>
                      </li>
                      <li>
                        <Typography>Score: (10 + -6) / 10 = 40%</Typography>
                      </li>
                    </ul>
                  </>
                }
              >
                <HelpOutline />
              </Tooltip>
            </Typography>
          </div>

          {aggregation.moduleTime === aggregation.moduleTime && (
            <Typography variant='subtitle1'>
              <strong>Module Time:</strong> {aggregation.moduleTime}%
              <Tooltip
                className={styles.Tooltip}
                title={
                  <>
                    <Typography>
                      A weighted score of time spent in modules (first four
                      only). 100% means same pace as traditional cycle.
                    </Typography>
                    <Typography>
                      (Max time allowed for module) / (Time in module) * 0.6
                    </Typography>
                    <hr />
                    <Typography>
                      Ex. Associate completed the first module in 30 days and
                      the second in 32 days.
                    </Typography>
                    <ul>
                      <li>
                        <Typography>
                          First module: 42 (Max time) / 30 (days in cycle) * 0.6
                          (ML modifer) = 0.84
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          Second module: 28 (Max time) / 32 (days in cycle) *
                          0.6 (ML modifer) = 0.53
                        </Typography>
                      </li>
                      <li>
                        <Typography>
                          Score: (0.84 + 0.53) / 2 = 68.5%
                        </Typography>
                      </li>
                    </ul>
                  </>
                }
              >
                <HelpOutline />
              </Tooltip>
            </Typography>
          )}
        </div>
      </div>
    </Paper>
  );
};

export default RollUps;
