import React from 'react';
import { Divider, Paper, Tooltip, Typography } from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import styles from './RollUps.module.css';
import { Cycle, Associate, Module } from '../../models/types';
import {
  calcDaysSince,
  getItemInArrayByName,
  calcScoreAvg,
  calcStandardDeviation
} from '../../shared/dataService';
import Metadata from '../../shared/metadata';

interface RollUpsProps {
  cycleAggregation: any;
  associateAggregation: any;
  cycle: Cycle;
  associate: Associate;
}

const RollUps = (props: RollUpsProps) => {
  const { cycleAggregation, associateAggregation, cycle, associate } = props;

  const getAttendanceScore = (count: any): number => {
    const attendanceModifier =
      count['Excused Absence'] * -0.5 +
      count['Unexcused Absence'] * -5 +
      count['Excused Late Arrival'] * -0.2 +
      count['Unexcused Late Arrival'] * -1;

    const daysInCycle = associate.endDate
      ? calcDaysSince(associate.startDate, associate.endDate)
      : calcDaysSince(associate.startDate);
    const daysOff = associate.cycle[0] === 'm' ? 4 : 2;
    const daysInClass = daysInCycle - Math.round((daysInCycle / 7) * daysOff);
    const attendanceScore = Math.round(
      ((daysInClass + attendanceModifier) / daysInClass) * 100
    );
    return attendanceScore;
  };

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

  const getCompositeScore = (
    scores: number[],
    associateScore: number
  ): number => {
    const combinedScoreAvg = calcScoreAvg(scores);
    const SD = calcStandardDeviation(scores);
    const associateDeviation = (associateScore - combinedScoreAvg) / SD;
    let compositeScore = 0;
    if (Math.abs(associateDeviation) < 0.5) {
      compositeScore = 3;
    } else if (associateDeviation >= 0.5 && associateDeviation < 1) {
      compositeScore = 4;
    } else if (associateDeviation >= 1) {
      compositeScore = 5;
    } else if (associateDeviation <= -0.5 && associateDeviation > -1) {
      compositeScore = 2;
    } else {
      compositeScore = 1;
    }

    return compositeScore;
  };

  const getModuleTimeScore = (associate: Associate): number => {
    const workedModules = associate.modules.filter(
      (module: Module, index: number) => module.daysInModule > 0 && index < 4
    );
    const workedModuleTimes = workedModules.map(
      (module: Module, index: number) => {
        // if module in-progress and less than half alloted time, just give 100%
        if (
          module.daysInModule < Metadata.maxTimePerModule[index] * 0.6 &&
          !module.endDate
        ) {
          return 1;
        }
        // 0.6 is ratio of ML to traditional cycle module lengths
        return (Metadata.maxTimePerModule[index] / module.daysInModule) * 0.6;
      }
    );

    const total = workedModuleTimes.reduce(
      (acc: any, curr: any) => acc + curr,
      0
    );
    return Math.round((total / workedModuleTimes.length) * 100);
  };

  const getWeightedAssessmentScore = (aggregation: any): number => {
    if (aggregation.softSkills && aggregation.quizzes && aggregation.projects) {
      return Math.round(
        aggregation.projects * 0.45 +
          aggregation.softSkills * 0.45 +
          aggregation.quizzes * 0.1
      );
    } else if (aggregation.projects && aggregation.quizzes) {
      return Math.round(aggregation.projects * 0.7 + aggregation.quizzes * 0.3);
    } else if (aggregation.projects) {
      return aggregation.projects;
    } else {
      return 0;
    }
  };

  const getMLRollUp = (
    cycleAgg: any,
    associateAgg: any,
    cycle: Cycle,
    associate: Associate
  ) => {
    const assessmentsScore = getWeightedAssessmentScore(associateAgg);
    const moduleTimeScore = getModuleTimeScore(associate);
    const attendanceScore = getAttendanceScore(associate.attendance.count);
    const associateScore = Math.round(
      assessmentsScore * 0.5 + attendanceScore * 0.25 + moduleTimeScore * 0.25
    );

    const scores: any = [];
    cycleAgg.aggregations.forEach((item: any) => {
      const associate = getItemInArrayByName(cycle.associates, item.name);
      const assessments = getWeightedAssessmentScore(item);
      const attendance = getAttendanceScore(associate.attendance.count);
      const moduleTime = getModuleTimeScore(associate);
      if (assessments && attendance && moduleTime) {
        scores.push(
          Math.round(assessments * 0.5 + attendance * 0.25 + moduleTime * 0.25)
        );
      }
    });

    const compositeScore = getCompositeScore(scores, associateScore);

    return {
      assessmentsScore,
      associateScore,
      attendanceScore,
      compositeScore,
      moduleTimeScore
    };
  };

  const getTradRollUp = (
    cycleAgg: any,
    associateAgg: any,
    cycle: Cycle,
    associate: Associate
  ) => {
    const assessmentsScore = getWeightedAssessmentScore(associateAgg);
    const attendanceScore = getAttendanceScore(associate.attendance.count);
    const associateScore = Math.round(
      assessmentsScore * 0.6 + attendanceScore * 0.4
    );

    const scores: any = [];
    cycleAgg.aggregations.forEach((item: any) => {
      const associate = getItemInArrayByName(cycle.associates, item.name);
      const assessments = getWeightedAssessmentScore(item);
      const attendance = getAttendanceScore(associate.attendance.count);
      if (assessments && attendance) {
        scores.push(Math.round(assessments * 0.6 + attendance * 0.4));
      }
    });

    const compositeScore = getCompositeScore(scores, assessmentsScore);

    return {
      assessmentsScore,
      associateScore,
      attendanceScore,
      compositeScore,
      moduleTimeScore: null
    };
  };

  const {
    assessmentsScore,
    associateScore,
    attendanceScore,
    compositeScore,
    moduleTimeScore
  } =
    associate.cycle[0] === 'm'
      ? getMLRollUp(cycleAggregation, associateAggregation, cycle, associate)
      : getTradRollUp(cycleAggregation, associateAggregation, cycle, associate);

  const background = getCompositeBackground(compositeScore);

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
          <strong>Combined:</strong> {associateScore}%
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

        <Tooltip
          className={styles.Tooltip}
          title={
            <>
              <Typography>
                Composite score based on associate's combined score relative to
                cycle average:
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
              {compositeScore}
            </Typography>
          </div>
        </Tooltip>

        <div>
          <Typography variant='subtitle1'>
            <strong>Assessments:</strong> {assessmentsScore}%
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
              <strong>Attendance:</strong> {attendanceScore}%
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

          {moduleTimeScore && (
            <Typography variant='subtitle1'>
              <strong>Module Time:</strong> {moduleTimeScore}%
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
