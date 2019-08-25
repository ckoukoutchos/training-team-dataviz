import React from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import { ResponsiveBar } from '@nivo/bar';

import Legend from '../../legend/Legend';

import styles from './MLCycleProgress.module.css';
import { Cycle, Module } from '../../../models/types';
import Metadata from '../../../shared/metadata';
import CONSTS from '../../../shared/constants';

interface MLCycleProgressProps {
  children?: any;
  cycle: Cycle;
  title: string;
  subtitle?: string;
}

const MLCycleProgress = (props: MLCycleProgressProps) => {
  const { children, cycle, title, subtitle } = props;

  const moduleCount = {
    'Development Basics and Front End': 0,
    Databases: 0,
    'Logic Layer (Java)': 0,
    'Front End Frameworks (React)': 0,
    'Group Project': 0,
    'Final Project': 0
  };

  const associateCurrentModule = {
    'Development Basics and Front End': [],
    Databases: [],
    'Logic Layer (Java)': [],
    'Front End Frameworks (React)': [],
    'Group Project': [],
    'Final Project': []
  };

  for (const associate of cycle.associates) {
    associate.modules.forEach((module: Module) => {
      // if active and module not completed
      if (associate.active && module.startDate && !module.endDate) {
        // and module isn't currently paused
        if (!module.modulePause) {
          moduleCount[module.type]++;
          associateCurrentModule[module.type].push(associate.name);
          // or module was paused but no longer is
        } else if (module.modulePause && module.moduleResume) {
          moduleCount[module.type]++;
          associateCurrentModule[module.type].push(associate.name);
        }
      }
    });
  }

  return (
    <Paper className={styles.Paper}>
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

      <div className={styles.MLGraph}>
        <ResponsiveBar
          data={[
            {
              ...moduleCount,
              '': ''
            }
          ]}
          keys={CONSTS.modules}
          indexBy=''
          margin={{ top: 0, right: 85, bottom: 10, left: 85 }}
          padding={0.3}
          colors={{ scheme: 'red_yellow_blue' }}
          layout='horizontal'
          axisTop={null}
          axisRight={null}
          axisBottom={null}
          axisLeft={null}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor='black'
          tooltip={(data: any) => {
            return (
              <div>
                <strong style={{ color: data.color }}>
                  {data.id}: {data.value}
                </strong>
                <ul>
                  {associateCurrentModule[data.id].map(
                    (name: string, index: number) => (
                      <li key={index}>{name}</li>
                    )
                  )}
                </ul>
              </div>
            );
          }}
        />
      </div>

      <Legend items={Metadata.modules} colors={'moduleColors'} />

      {children}
    </Paper>
  );
};

export default MLCycleProgress;
