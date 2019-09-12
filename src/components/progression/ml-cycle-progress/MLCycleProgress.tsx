import React from 'react';
import { Divider, Paper, Typography, Tooltip } from '@material-ui/core';
import { ResponsiveBar } from '@nivo/bar';

import Legend from '../../legend/Legend';

import styles from './MLCycleProgress.module.css';
import { Cycle, Module } from '../../../models/types';
import Metadata from '../../../shared/metadata';
import CONSTS from '../../../shared/constants';

interface MLCycleProgressProps {
  children?: any;
  cycle: Cycle;
  tall?: boolean;
  title: string;
  subtitle?: string;
}

const MLCycleProgress = (props: MLCycleProgressProps) => {
  const { children, cycle, tall, title, subtitle } = props;

  const moduleCount = {
    'Development Basics and Front End': 0,
    Databases: 0,
    'Logic Layer (Java)': 0,
    'Front End Frameworks (React)': 0,
    'Group Project': 0,
    'Frontend Post-group': 0,
    'Final Project': 0
  };

  const associateCurrentModule: any = {
    'Development Basics and Front End': [],
    Databases: [],
    'Logic Layer (Java)': [],
    'Front End Frameworks (React)': [],
    'Group Project': [],
    'Frontend Post-group': [],
    'Final Project': []
  };

  for (const associate of cycle.associates) {
    associate.modules.forEach((module: Module) => {
      // if active and module not completed
      if (associate.active && module.startDate && !module.endDate) {
        if (module.modulePause) {
          if (
            module.type === 'Front End Frameworks (React)' &&
            associate.modules[4].startDate
          ) {
            moduleCount['Group Project']++;
            associateCurrentModule['Group Project'].push(associate.name);
          }
        } else if (
          module.type === 'Front End Frameworks (React)' &&
          associate.modules[4].endDate
        ) {
          moduleCount['Frontend Post-group']++;
          associateCurrentModule['Frontend Post-group'].push(associate.name);
        } else if (
          !associateCurrentModule[module.type].includes(associate.name)
        ) {
          moduleCount[module.type]++;
          associateCurrentModule[module.type].push(associate.name);
        }
      }
    });
  }

  const moduleCountArray = Object.values(moduleCount);
  const associateCurrentModuleArray: any[] = Object.values(
    associateCurrentModule
  );
  const count = moduleCountArray.reduce(
    (acc: number, curr: number) => acc + curr,
    0
  );

  const sections = moduleCountArray.map((section: number) => {
    if (section === 0) {
      return '30px';
    } else if (section === 1) {
      return '40px';
    } else {
      return Math.round((section / count) * 560) + 'px';
    }
  });

  return (
    <Paper className={tall ? styles.TallPaper : styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h3'>{title}</Typography>
        {subtitle && (
          <Typography variant='h6' color='textSecondary'>
            {subtitle}
          </Typography>
        )}
      </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      <div className={styles.Container}>
        {sections.map((section: string, index: number) => (
          <Tooltip
            key={index}
            className={styles.Tooltip}
            title={
              <>
                <Typography>{Metadata.mlModules[index]}</Typography>
                <ul>
                  {associateCurrentModuleArray[index].map(
                    (associate: string) => (
                      <li key={associate}>
                        <Typography>{associate}</Typography>
                      </li>
                    )
                  )}
                </ul>
              </>
            }
          >
            <div
              className={styles.Section}
              style={{
                background: CONSTS.mlModuleColors[index],
                width: section
              }}
            >
              {moduleCountArray[index]}
            </div>
          </Tooltip>
        ))}
      </div>

      <Legend items={Metadata.mlModules} colors={'mlModuleColors'} />

      {children}
    </Paper>
  );
};

export default MLCycleProgress;
