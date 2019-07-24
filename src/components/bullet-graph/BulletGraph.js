import React, { Component } from 'react';
import { Divider, Grid, Paper, Switch, Typography } from '@material-ui/core';
import { ResponsiveBullet } from '@nivo/bullet'
import { calcDateMarkers, calcDaysSince, calcModuleLength } from '../../shared/dataService';
import styles from './BulletGraph.module.css';

class BulletGraph extends Component {
  state = {
    showModules: false
  };

  toggleHandler = () => {
    this.setState(prevState => ({ showModules: !prevState.showModules }));
  }

  render() {
    const { metadata, title, subtitle } = this.props;
    const { showModules } = this.state;

    let daysSinceStart = 0;
    if (metadata['Cycle Exit']) {
      daysSinceStart = Math.round(calcDaysSince(metadata['Associate Start'], metadata['Cycle Exit']));
    } else {
      daysSinceStart = Math.round(calcDaysSince(metadata['Associate Start']));
    }
    const associateMarkers = [...calcDateMarkers(metadata), 238];
    const modules = calcModuleLength(metadata);

    return (
      <Paper className={styles.Paper}>
        <div className={styles.Header}>
          <Typography variant='h4'>
            {title}
          </Typography>
          {subtitle ? <Typography variant='subtitle1' color='textSecondary'>
            {subtitle}
          </Typography> : null}
        </div>

        <div className={styles.Divider}>
          <Divider />
        </div>

        <div className={styles.Switch}>
          <Typography component="div">
            <Grid component="label" container alignItems="center" spacing={1}>
              <Grid item>Overview</Grid>
              <Grid item>
                <Switch
                  color='primary'
                  checked={showModules}
                  onChange={this.toggleHandler}
                  value="checkedC"
                />
              </Grid>
              <Grid item>Per Module</Grid>
            </Grid>
          </Typography>
        </div>

        {showModules ? <div className={styles.Graph}>
          <ResponsiveBullet
            data={[
              {
                id: 'Basics',
                ranges: [42, 98],
                measures: [modules.moduleLengths[0]],
                markers: []
              },
              {
                id: 'Databases',
                ranges: [28, 98],
                measures: [modules.moduleLengths[1]],
                markers: []
              },
              {
                id: 'Java',
                ranges: [70, 98],
                measures: [modules.moduleLengths[2]],
                markers: []
              },
              {
                id: 'React',
                ranges: [56, 98],
                measures: [modules.moduleLengths[3]],
                markers: []
              }
            ]}
            margin={{ top: 50, right: 90, bottom: 50, left: 90 }}
            spacing={46}
            titleAlign='start'
            titleOffsetX={-70}
            measureSize={0.4}
            rangeColors={['#a50026', '#ffffff']}
            measureColors='#e6e6e6'
          />
        </div>
          : <div className={styles.Graph2}>
            <ResponsiveBullet
              data={[
                {
                  id: 'Associate',
                  ranges: modules.ranges,
                  measures: [daysSinceStart],
                  markers: associateMarkers
                },
                {
                  id: 'Max Time',
                  ranges: [42, 70, 140, 196, 224, 238],
                  measures: [daysSinceStart],
                  markers: associateMarkers
                }
              ]}
              margin={{ top: 50, right: 90, bottom: 50, left: 90 }}
              spacing={46}
              titleAlign='start'
              titleOffsetX={-70}
              measureSize={0.4}
              rangeColors='red_yellow_blue'
              measureColors='#e6e6e6'
              markerColors='black'
              markerSize={1}
            />
          </div>}

        {/* <div>
            <div></div>
            <p></p>
          </div> */}
      </Paper>
    );
  }
}

export default BulletGraph;