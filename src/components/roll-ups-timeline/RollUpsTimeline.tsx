import React from 'react';
import { Paper, Typography, Divider } from '@material-ui/core';
import styles from './RollUpsTimeline.module.css';
import { combineScores, calcScoreAvg } from '../../shared/dataService';
import { Associate, Assessment } from '../../models/types';
import Associates from '../../containers/associates/Associates';

interface RollUpsTimelineProps {
  associate: Associate;
}

const RollUpsTimeline = (props: RollUpsTimelineProps) => {
  const { associate } = props;
  console.log(associate);

  const numOfWeeks = Math.floor(associate.daysInCycle / 7);
  const dates: any[] = [associate.startDate.getTime()];
  for (let i = 1; i <= numOfWeeks; i++) {
    dates.push(dates[i - 1] + 604800000);
  }

  const projectsTimeline: any[] = [];
  const quizzesTimeline: any[] = [];
  const softSkillsTimeline: any[] = [];
  dates.forEach((date: Date) => {
    projectsTimeline.push([]);
    quizzesTimeline.push([]);
    softSkillsTimeline.push([]);
  });

  associate.projects.forEach((project: Assessment) => {
    const index = dates.findIndex((date: Date) => date > project.date);
    if (index > -1) {
      projectsTimeline[index - 1].push(project.score);
    } else {
      projectsTimeline[projectsTimeline.length - 1].push(project.score);
    }
  });
  associate.quizzes.forEach((quiz: Assessment) => {
    const index = dates.findIndex((date: Date) => date > quiz.date);
    if (index > -1) {
      quizzesTimeline[index - 1].push(quiz.score);
    } else {
      quizzesTimeline[projectsTimeline.length - 1].push(quiz.score);
    }
  });
  associate.softSkills.forEach((softSkill: Assessment) => {
    const index = dates.findIndex((date: Date) => date > softSkill.date);
    if (index > -1) {
      softSkillsTimeline[index - 1].push(softSkill.score);
    } else {
      softSkillsTimeline[projectsTimeline.length - 1].push(softSkill.score);
    }
  });

  const projects = [projectsTimeline[0]];
  for (let i = 1; i < projectsTimeline.length; i++) {
    projects.push([...projects[i - 1], ...projectsTimeline[i]]);
  }
  const projectAvgs: any = [];
  projects.forEach((project: number[]) =>
    projectAvgs.push(calcScoreAvg(project))
  );

  const quizzes = [quizzesTimeline[0]];
  for (let i = 1; i < quizzesTimeline.length; i++) {
    quizzes.push([...quizzes[i - 1], ...quizzesTimeline[i]]);
  }
  const quizAvg: any = [];
  quizzes.forEach((quiz: number[]) => quizAvg.push(calcScoreAvg(quiz)));

  const softSkills = [softSkillsTimeline[0]];
  for (let i = 1; i < softSkillsTimeline.length; i++) {
    softSkills.push([...softSkills[i - 1], ...softSkillsTimeline[i]]);
  }
  const softSkillAvgs: any = [];
  softSkills.forEach((softSkill: number[]) =>
    softSkillAvgs.push(calcScoreAvg(softSkill))
  );
  console.log(projectAvgs);

  return (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h3'>text</Typography>
        <Typography variant='h6' color='textSecondary'>
          more text
        </Typography>
      </div>
      <div className={styles.Divider}>
        <Divider />
      </div>
      <div className={styles.Graph}></div>
    </Paper>
  );
};

export default RollUpsTimeline;
