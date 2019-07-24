import React, { Component } from 'react';
import { Divider, Grid, Paper, Switch, Typography } from '@material-ui/core';
import { ResponsiveBullet } from '@nivo/bullet'
import { calcDateMarkers, calcDaysSince, calcModuleLength } from '../../shared/dataService';
import Metadata from '../../shared/metadata';
import styles from './BulletGraph.module.css';

class BulletGraph extends Component {
  state = {
    modules: false
  };

  toggleHandler = () => {
    this.setState(prevState => ({ modules: !prevState.modules }));
  }

  render() {
    const { metadata, title, subtitle } = this.props;
    const { modules } = this.state;
    const weeksSinceStart = Math.round(calcDaysSince(metadata['Associate Start']) / 7);
    const associateMarkers = [...calcDateMarkers(metadata), 34];
    const moduleLengths = calcModuleLength(metadata);
    console.log(metadata, moduleLengths);
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
                  checked={modules}
                  onChange={this.toggleHandler}
                  value="checkedC"
                />
              </Grid>
              <Grid item>Per Module</Grid>
            </Grid>
          </Typography>
        </div>

        {modules ? <div className={styles.Graph}>
          <ResponsiveBullet
            data={[
              {
                id: 'Basics',
                ranges: [8, 14],
                measures: [7],
                markers: []
              },
              {
                id: 'Databases',
                ranges: [4, 14],
                measures: [3],
                markers: []
              },
              {
                id: 'Java',
                ranges: [10, 14],
                measures: [9],
                markers: []
              },
              {
                id: 'React',
                ranges: [8, 14],
                measures: [11],
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
                  ranges: moduleLengths,
                  measures: [weeksSinceStart],
                  markers: associateMarkers
                },
                {
                  id: 'Max Time',
                  ranges: [6, 10, 20, 28, 32, 34],
                  measures: [weeksSinceStart],
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