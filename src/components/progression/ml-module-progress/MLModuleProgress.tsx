import React from 'react';
import { Module, Associate } from '../../../models/types';
import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  ListSubheader,
  Typography,
  Divider
} from '@material-ui/core';
import { CheckCircle, ErrorOutline, HighlightOff } from '@material-ui/icons';
import Metadata from '../../../shared/metadata';
import styles from './MLModuleProgress.module.css';

interface MLModuleProgressProps {
  associate: Associate;
}

const MLModuleProgress = (props: MLModuleProgressProps) => {
  const { modules, projects, quizzes, exercises } = props.associate;
  const currModule = modules.find(
    (module: Module) => module.startDate && !module.endDate
  );

  let required;
  if (currModule) {
    required = Metadata.required[currModule.type];
  }

  const getDueDate = (assessment: string, type: string) => {
    if (type === 'projects') {
      if (Metadata['Project (Score)'][assessment].timeline) {
        if (currModule && currModule.startDate) {
          let dueDate =
            currModule.startDate.valueOf() +
            Metadata['Project (Score)'][assessment].timeline * 86400000;
          if (
            currModule.type === 'Front End Frameworks (React)' &&
            modules[4].startDate
          ) {
            dueDate += 28 * 86400000;
          }
          return `Due: ${new Date(dueDate).toDateString()}`;
        }
      }
    } else {
      if (Metadata['Exercise'][assessment]) {
        if (currModule && currModule.startDate) {
          let dueDate =
            currModule.startDate.valueOf() +
            Metadata['Exercise'][assessment].timeline * 86400000;
          if (
            currModule.type === 'Front End Frameworks (React)' &&
            modules[4].startDate
          ) {
            dueDate += 28 * 86400000;
          }
          return `Due: ${new Date(dueDate).toDateString()}`;
        }
      }
    }
    return null;
  };

  const getIcon = (assessments: any[], curr: string, type: string) => {
    if (type === 'projects') {
      const projects = assessments.filter(
        (assessment: any) => assessment.name === curr
      );
      const project = projects.find((project: any) => project.score >= 90);
      return projects.length ? (
        project ? (
          <CheckCircle color='primary' />
        ) : (
          <ErrorOutline color='secondary' />
        )
      ) : (
        <HighlightOff color='disabled' />
      );
    } else if (type === 'quizzes') {
      const quiz = assessments.find(
        (assessment: any) => assessment.name === curr
      );
      return quiz ? (
        <CheckCircle color='primary' />
      ) : (
        <HighlightOff color='disabled' />
      );
    } else {
      const exercises = assessments.filter(
        (assessment: any) => assessment.Interaction === curr
      );
      const exercise = exercises.find(
        (exercise: any) => exercise.Score === 'Pass'
      );
      return exercises.length ? (
        exercise ? (
          <CheckCircle color='primary' />
        ) : (
          <ErrorOutline color='secondary' />
        )
      ) : (
        <HighlightOff color='disabled' />
      );
    }
  };
  return (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h3'>Module Progress</Typography>
        <Typography variant='h6' color='textSecondary'>
          {currModule ? currModule.type : ''}
        </Typography>
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      <div style={{ display: 'flex' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <List
              dense={true}
              subheader={
                <ListSubheader component='div'>Projects</ListSubheader>
              }
            >
              {required.projects.map((project: string, index: number) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {getIcon(projects, project, 'projects')}
                  </ListItemIcon>
                  <ListItemText
                    primary={project}
                    secondary={getDueDate(project, 'projects')}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          <Grid item xs={12} md={12}>
            <List
              dense={true}
              subheader={<ListSubheader component='div'>Quizzes</ListSubheader>}
            >
              {required.quizzes.map((quiz: string, index: number) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {getIcon(quizzes, quiz, 'quizzes')}
                  </ListItemIcon>
                  <ListItemText primary={quiz} />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <List
              dense={true}
              subheader={
                <ListSubheader component='div'>Exercises</ListSubheader>
              }
            >
              {required.exercises.map((exercise: string, index: number) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    {getIcon(exercises, exercise, 'exercises')}
                  </ListItemIcon>
                  <ListItemText
                    primary={exercise}
                    secondary={getDueDate(exercise, 'exercises')}
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </div>
    </Paper>
  );
};

export default MLModuleProgress;
