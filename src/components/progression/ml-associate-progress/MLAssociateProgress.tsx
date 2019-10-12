import React, { Component } from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import { ResponsiveBullet } from '@nivo/bullet';

import Legend from '../../legend/Legend';
import Toggle from '../../toggle/Toggle';

import Metadata from '../../../shared/metadata';
import styles from './MLAssociateProgress.module.css';
import { Associate, Module } from '../../../models/types';

interface MLAssociateProgressProps {
  associate: Associate;
  title: string;
  subtitle: string;
}

interface MLAssociateProgressState {
  showModules: boolean;
}

class MLAssociateProgress extends Component<
  MLAssociateProgressProps,
  MLAssociateProgressState
> {
  state = {
    showModules: false
  };

  createMLCycleGraph(showModules: boolean, modules: Module[]) {
    const moduleTimes: number[] = [0];
    modules.forEach((module: Module) =>
      moduleTimes.push(
        moduleTimes[moduleTimes.length - 1] + module.daysInModule
      )
    );

    let data = showModules
      ? [
          {
            id: 'Basics',
            ranges: [42, 98],
            measures: [modules[0].daysInModule],
            markers: []
          },
          {
            id: 'Databases',
            ranges: [28, 98],
            measures: [modules[1].daysInModule],
            markers: []
          },
          {
            id: 'Java',
            ranges: [70, 98],
            measures: [modules[2].daysInModule],
            markers: []
          },
          {
            id: 'React',
            ranges: [56, 98],
            measures: [modules[3].daysInModule],
            markers: []
          }
        ]
      : [
          {
            id: 'Associate',
            ranges: moduleTimes,
            measures: [],
            markers: [234]
          },
          {
            id: 'Max Time',
            ranges: [42, 70, 140, 196, 224, 234],
            measures: [],
            markers: []
          }
        ];

    return (
      <div className={showModules ? styles.Graph : styles.Graph2}>
        <ResponsiveBullet
          data={data}
          margin={{ top: 20, right: 90, bottom: 50, left: 90 }}
          spacing={46}
          titleAlign='start'
          titleOffsetX={-70}
          measureSize={0.4}
          rangeColors={showModules ? ['#a50026', '#ffffff'] : 'red_yellow_blue'}
          measureColors='#e6e6e6'
          markerColors='black'
          markerSize={1}
        />
      </div>
    );
  }

  toggleHandler = () => {
    this.setState((prevState: MLAssociateProgressState) => ({
      showModules: !prevState.showModules
    }));
  };

  render() {
    const { associate, title, subtitle } = this.props;
    const { showModules } = this.state;

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

        <Toggle
          checked={showModules}
          onChange={this.toggleHandler}
          leftLabel='Overview'
          rightLabel='Per Module'
        />

        {this.createMLCycleGraph(showModules, associate.modules)}

        {showModules ? (
          <Legend
            items={['Max Time', 'Associate']}
            colors={'moduleLengthColors'}
          />
        ) : (
          <Legend items={Metadata.modules} colors={'moduleColors'} />
        )}
      </Paper>
    );
  }
}

export default MLAssociateProgress;
