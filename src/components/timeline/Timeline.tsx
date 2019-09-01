import React, { Component } from 'react';
import {
  Divider,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';
import styles from './Timeline.module.css';
import {
  Associate,
  AttendanceType,
  Assessment,
  AttendanceEvent,
  Module
} from '../../models/types';
import {
  calcAssessmentsScore,
  calcScoreAvg,
  calcDaysSince
} from '../../shared/dataService';
import { ResponsiveLine } from '@nivo/line';
import CONSTS from '../../shared/constants';
import Metadata from '../../shared/metadata';

interface TimelineProps {
  associate: Associate;
}

interface TimelineState {
  selectedScore: string;
  weeklyScores: WeeklyScore[];
}

type WeeklyScore = {
  assessmentScore: number;
  attendanceCount: any;
  attendanceScore: number;
  combinedScore: number;
  date: number;
  moduleTimes: number[];
  moduleTimeScore: number;
  projectAvg: number;
  projectScores: number[];
  quizAvg: number;
  quizScores: number[];
  softSkillsAvg: number;
  softSkillsScores: number[];
};

class Timeline extends Component<TimelineProps, TimelineState> {
  constructor(props: TimelineProps) {
    super(props);

    const weeklyScores = this.createWeeklyScores(
      props.associate.daysInCycle,
      props.associate.startDate
    );
    this.addAssessments(
      weeklyScores,
      props.associate.projects,
      'projectScores'
    );
    this.addAssessments(weeklyScores, props.associate.quizzes, 'quizScores');
    this.addAssessments(
      weeklyScores,
      props.associate.softSkills,
      'softSkillsScores'
    );
    this.addAttendance(weeklyScores, props.associate.attendance.events);
    if (props.associate.cycle[0] === 'm') {
      this.calcModuleScore(weeklyScores, props.associate.modules);
    }

    this.formatWeeklyScores(
      weeklyScores,
      props.associate.startDate,
      props.associate.cycle
    );

    this.state = {
      selectedScore: 'Combined',
      weeklyScores
    };
  }

  createWeeklyScores(daysInCycle: number, startDate: Date) {
    const numOfWeeks = Math.floor(daysInCycle / 7);
    let dateHolder = startDate.valueOf();
    const weeklyScores: WeeklyScore[] = [];

    for (let i = 0; i < numOfWeeks; i++) {
      weeklyScores.push({
        assessmentScore: 0,
        attendanceCount: {
          [AttendanceType.EXCUSED_ABSENCE]: 0,
          [AttendanceType.UNEXCUSED_ABSENCE]: 0,
          [AttendanceType.EXCUSED_LATE]: 0,
          [AttendanceType.UNEXCUSED_LATE]: 0,
          [AttendanceType.OPTIONAL]: 0
        },
        attendanceScore: 0,
        combinedScore: 0,
        date: dateHolder,
        moduleTimes: [],
        moduleTimeScore: 100,
        projectAvg: 0,
        projectScores: [],
        quizAvg: 0,
        quizScores: [],
        softSkillsAvg: 0,
        softSkillsScores: []
      });
      // inc to new weeks date
      dateHolder += 604800000;
    }

    return weeklyScores;
  }

  addAssessments = (
    weeklyScores: WeeklyScore[],
    assessments: Assessment[],
    type: string
  ) => {
    assessments.forEach((assessment: Assessment) => {
      const index = weeklyScores.findIndex(
        (week: WeeklyScore) => assessment.date.valueOf() < week.date
      );
      if (index !== -1) {
        weeklyScores[index][type].push(assessment.score);
      }
    });
  };

  addAttendance = (
    weeklyScores: WeeklyScore[],
    attendance: AttendanceEvent[]
  ) => {
    attendance.forEach((event: AttendanceEvent) => {
      const index = weeklyScores.findIndex(
        (week: WeeklyScore) => event.date.valueOf() < week.date
      );
      if (index !== -1) {
        weeklyScores[index].attendanceCount[event.type]++;
      }
    });
  };

  calcAttendanceScore = (
    endDate: Date,
    startDate: Date,
    count: any,
    cycle: string
  ): number => {
    const attendanceModifier =
      count['Excused Absence'] * -0.5 +
      count['Unexcused Absence'] * -5 +
      count['Excused Late Arrival'] * -0.2 +
      count['Unexcused Late Arrival'] * -1;

    const daysInCycle = calcDaysSince(startDate, endDate);
    const daysOff = cycle[0] === 'm' ? 4 : 2;
    const daysInClass = daysInCycle - Math.round((daysInCycle / 7) * daysOff);
    const attendanceScore = Math.round(
      ((daysInClass + attendanceModifier) / daysInClass) * 100
    );
    return attendanceScore;
  };

  calcModuleScore = (weeklyScores: WeeklyScore[], modules: Module[]) => {
    let currModule = 0;
    const moduleScores: any = [];

    for (const score of weeklyScores) {
      // if module has end date and week date is greater than it, move to next module
      if (
        modules[currModule].endDate &&
        //@ts-ignore
        score.date > modules[currModule].endDate.valueOf()
      ) {
        moduleScores[currModule] =
          (Metadata.maxTimePerModule[currModule] /
            calcDaysSince(
              //@ts-ignore
              modules[currModule].startDate,
              modules[currModule].endDate
            )) *
          0.6 *
          100;
        score.moduleTimes = [...moduleScores];
        currModule++;
      }
      // ignore group and final modules
      if (currModule > 3) break;

      // if module in-progress and less than half alloted time
      if (
        modules[currModule].startDate &&
        //@ts-ignore
        calcDaysSince(modules[currModule].startDate, new Date(score.date)) <
          Metadata.maxTimePerModule[currModule] * 0.6
      ) {
        moduleScores[currModule] = 100;
        score.moduleTimes = [...moduleScores];
        // else apply the ML to traditional cycle converter
      } else {
        moduleScores[currModule] =
          (Metadata.maxTimePerModule[currModule] /
            calcDaysSince(
              //@ts-ignore
              modules[currModule].startDate,
              new Date(score.date)
            )) *
          0.6 *
          100;

        score.moduleTimes = [...moduleScores];
      }
    }
  };

  formatWeeklyScores(
    weeklyScores: WeeklyScore[],
    startDate: Date,
    cycle: string
  ) {
    const tempProjects: any = [];
    const tempQuizzes: any = [];
    const tempSoftSkills: any = [];
    let tempAttendance = {
      [AttendanceType.EXCUSED_ABSENCE]: 0,
      [AttendanceType.UNEXCUSED_ABSENCE]: 0,
      [AttendanceType.EXCUSED_LATE]: 0,
      [AttendanceType.UNEXCUSED_LATE]: 0,
      [AttendanceType.OPTIONAL]: 0
    };

    for (const score of weeklyScores) {
      tempProjects.push(...score.projectScores);
      tempQuizzes.push(...score.quizScores);
      tempSoftSkills.push(...score.softSkillsScores);

      tempAttendance[AttendanceType.EXCUSED_ABSENCE] +=
        score.attendanceCount[AttendanceType.EXCUSED_ABSENCE];
      tempAttendance[AttendanceType.UNEXCUSED_ABSENCE] +=
        score.attendanceCount[AttendanceType.UNEXCUSED_ABSENCE];
      tempAttendance[AttendanceType.EXCUSED_LATE] +=
        score.attendanceCount[AttendanceType.EXCUSED_LATE];
      tempAttendance[AttendanceType.UNEXCUSED_LATE] +=
        score.attendanceCount[AttendanceType.UNEXCUSED_LATE];
      tempAttendance[AttendanceType.OPTIONAL] +=
        score.attendanceCount[AttendanceType.OPTIONAL];

      score.projectAvg = calcScoreAvg(tempProjects);
      score.quizAvg = calcScoreAvg(tempQuizzes);
      score.softSkillsAvg = calcScoreAvg(tempSoftSkills);
      if (cycle[0] === 'm') {
        score.moduleTimeScore = calcScoreAvg(score.moduleTimes);
      }

      score.assessmentScore = calcAssessmentsScore(
        score.projectAvg,
        score.quizAvg,
        score.softSkillsAvg
      );
      const attScore = this.calcAttendanceScore(
        new Date(score.date),
        startDate,
        tempAttendance,
        cycle
      );
      score.attendanceScore = isNaN(attScore) ? 0 : attScore;

      if (cycle[0] === 'm') {
        score.combinedScore = Math.round(
          score.assessmentScore * 0.5 +
            score.attendanceScore * 0.25 +
            score.moduleTimeScore * 0.25
        );
      } else {
        score.combinedScore = Math.round(
          score.assessmentScore * 0.6 + score.attendanceScore * 0.4
        );
      }
    }
  }

  createGraphData(weeklyScores: WeeklyScore[], scores: string) {
    return weeklyScores.map((week: WeeklyScore) => {
      const dateSplit = new Date(week.date).toDateString().split(' ');
      const date = [dateSplit[1], dateSplit[2]].join(' ');
      return {
        x: date,
        y: week[CONSTS[scores]]
      };
    });
  }

  onScoreSelection = (event: any) => {
    this.setState({ selectedScore: event.target.value });
  };

  render() {
    const { selectedScore, weeklyScores } = this.state;
    const data = this.createGraphData(weeklyScores, selectedScore);

    return (
      <Paper className={styles.Paper}>
        <div className={styles.Header}>
          <Typography variant='h3'>Timeline</Typography>
          <Typography variant='h6' color='textSecondary'>
            Aggregation & Assessment Scores
          </Typography>
        </div>

        <div className={styles.Divider}>
          <Divider />
        </div>

        <FormControl style={{ minWidth: '120px', margin: '4px 0 0 32px' }}>
          <InputLabel htmlFor='score'>Timeline</InputLabel>
          <Select
            value={selectedScore}
            onChange={this.onScoreSelection}
            inputProps={{
              name: 'age',
              id: 'score'
            }}
          >
            {[
              'Combined',
              'Assessments',
              'Attendance',
              'Module Time',
              'Projects',
              'Quizzes',
              'Soft Skills'
            ].map((score: string) => (
              <MenuItem key={score} value={score}>
                {score}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <div className={styles.Graph}>
          <ResponsiveLine
            data={[
              {
                id: selectedScore,
                data
              }
            ]}
            margin={{ top: 30, right: 30, bottom: 100, left: 70 }}
            //@ts-ignore
            xScale={{
              type: 'point'
            }}
            yScale={{
              type: 'linear',
              stacked: true,
              min: 0,
              max: selectedScore === 'Module Time' ? 'auto' : 100
            }}
            curve='linear'
            axisTop={null}
            axisRight={null}
            axisBottom={{
              orient: 'bottom',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 60,
              legend: 'Weeks',
              legendOffset: 50,
              legendPosition: 'middle'
            }}
            axisLeft={{
              orient: 'left',
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Score',
              legendOffset: -40,
              legendPosition: 'middle'
            }}
            colors={{ scheme: 'red_yellow_blue' }}
            pointSize={10}
            pointColor={{ theme: 'background' }}
            pointBorderWidth={2}
            pointBorderColor={{ from: 'serieColor' }}
            pointLabel='y'
            pointLabelYOffset={-12}
            enableArea={true}
            enableSlices='x'
            areaBlendMode='darken'
            areaOpacity={0.1}
            isInteractive={true}
            enableCrosshair={true}
            animate={false}
          />
        </div>
      </Paper>
    );
  }
}

export default Timeline;
