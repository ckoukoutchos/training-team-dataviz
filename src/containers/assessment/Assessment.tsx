import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import { Divider, Paper, Typography } from '@material-ui/core';
import MaterialTable from 'material-table';
import { ResponsiveLine } from '@nivo/line';

import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import Toggle from '../../components/toggle/Toggle';
import styles from './Assessment.module.css';

import {
  getUrlParams,
  getItemInArrayByName,
  calcPercentiles,
  formatPercentile,
  calcPercent
} from '../../shared/dataService';
import { AppState } from '../../redux/reducers/rootReducer';
import Metadata from '../../shared/metadata';
import CONSTS from '../../shared/constants';
import { Metric } from '../../models/types';

interface AssessmentProps {
  allCycleAggregations: any;
  assessmentAggregations: any;
  history: History;
}

interface AssessmentState {
  showCycles: boolean;
}

class Assessment extends Component<AssessmentProps, AssessmentState> {
  state = {
    showCycles: false
  };

  getGraphData(assessment: any, maxScore: number) {
    let scoreDistribution: any = {
      '0': 0,
      '10': 0,
      '20': 0,
      '30': 0,
      '40': 0,
      '50': 0,
      '60': 0,
      '70': 0,
      '80': 0,
      '90': 0,
      '100': 0
    };

    if (assessment.metrics[0]['Interaction Type'] === 'Soft Skill Assessment') {
      scoreDistribution = {
        '0': 0,
        '20': 0,
        '40': 0,
        '60': 0,
        '80': 0,
        '100': 0
      };
    }
    for (const score of assessment.scores) {
      // convert to percent
      const percent = calcPercent(score, maxScore);
      // get leading digit
      const bracket = Math.floor(percent / 10);
      // convert to bracket string
      const bracketString = bracket === 0 ? '0' : String(bracket) + '0';
      scoreDistribution[bracketString]++;
    }

    const id = assessment.cycle
      ? CONSTS[assessment.cycle]
          .split(' ')
          .slice(2)
          .join(' ')
      : 'combined';
    return {
      id,
      data: Object.entries(scoreDistribution).map(
        // @ts-ignore
        ([bracket, count]: [string, number]) => ({
          x: bracket,
          y: count
        })
      )
    };
  }

  getCycleGraphData(assessment: any, maxScore: number) {
    const sortedCycles = this.sortCycleData(assessment.metrics);
    return sortedCycles.map((cycle: any) => this.getGraphData(cycle, maxScore));
  }

  sortCycleData(assessments: Metric[]): any[] {
    const sortedByCycle = {};
    assessments.forEach((assessment: Metric) => {
      if (sortedByCycle[assessment.cycle]) {
        sortedByCycle[assessment.cycle].metrics.push(assessment);
        sortedByCycle[assessment.cycle].scores.push(Number(assessment.Score));
      } else {
        sortedByCycle[assessment.cycle] = {
          cycle: assessment.cycle,
          metrics: [assessment],
          scores: [Number(assessment.Score)]
        };
      }
    });
    return Object.values(sortedByCycle);
  }

  getTableData(metrics: Metric[], scores: number[], maxScore: number): any[] {
    const sortedScores = scores.sort((a: number, b: number) => a - b);

    return metrics.map((metric: Metric) => ({
      name: metric.Person,
      date: metric.Date,
      score: Number(metric.Score),
      percent: `${calcPercent(Number(metric.Score), maxScore)}%`,
      percentile: `${formatPercentile(
        calcPercentiles(sortedScores, Number(metric.Score))
      )}`
    }));
  }

  toggleHandler = () => {
    this.setState((prevState: AssessmentState) => ({
      showCycles: !prevState.showCycles
    }));
  };

  render() {
    const { assessmentAggregations, history } = this.props;
    const { showCycles } = this.state;
    const { url } = getUrlParams(history);
    const assessment = getItemInArrayByName(
      assessmentAggregations[url[2]],
      url[3]
    );
    // assessment type
    const type = Metadata['Interaction Type'][url[2]];
    const maxScore = Metadata[type][assessment.name]['Max Score'];

    return (
      <>
        <Breadcrumbs path={url} root='assessment' />

        <Paper className={styles.Paper}>
          <div className={styles.Header}>
            <Typography variant='h4'>
              {assessment.name.split('_').join(' ')}
            </Typography>
            <Typography variant='subtitle1' color='textSecondary'>
              {assessment.module ? assessment.module : 'Soft Skills'}
            </Typography>
          </div>

          <div className={styles.Divider}>
            <Divider />
          </div>

          <Toggle
            checked={showCycles}
            onChange={this.toggleHandler}
            leftLabel='Combined'
            rightLabel='Per Cycle'
          />

          <div className={styles.Graph}>
            <ResponsiveLine
              data={
                showCycles
                  ? this.getCycleGraphData(assessment, maxScore)
                  : [this.getGraphData(assessment, maxScore)]
              }
              margin={{ top: 30, right: 30, bottom: 100, left: 70 }}
              markers={[
                {
                  axis: 'x',
                  value: assessment.average,
                  lineStyle: { stroke: 'black', strokeWidth: 3 }
                }
              ]}
              xScale={{
                type: 'linear',
                min: 0,
                max: 100
              }}
              yScale={{
                type: 'linear',
                stacked: true,
                min: 0,
                max: 'auto'
              }}
              curve='natural'
              axisTop={null}
              axisRight={null}
              axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Score Percent',
                legendOffset: 36,
                legendPosition: 'middle'
              }}
              axisLeft={{
                orient: 'left',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Count',
                legendOffset: -40,
                legendPosition: 'middle'
              }}
              legends={[
                {
                  anchor: 'bottom',
                  direction: 'row',
                  justify: false,
                  translateX: 0,
                  translateY: 80,
                  itemsSpacing: 60,
                  itemDirection: 'left-to-right',
                  itemWidth: 80,
                  itemHeight: 20,
                  itemOpacity: 0.75,
                  symbolSize: 12,
                  symbolShape: 'square',
                  symbolBorderColor: 'rgba(0, 0, 0, .5)'
                }
              ]}
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

        <div className={styles.Paper}>
          <MaterialTable
            title='Associate Scores & Percentiles'
            columns={[
              { title: 'Person', field: 'name' },
              { title: 'Date', field: 'date' },
              { title: 'Raw Score', field: 'score' },
              { title: 'Percent', field: 'percent' },
              { title: 'Percentile', field: 'percentile' }
            ]}
            data={this.getTableData(
              assessment.metrics,
              assessment.scores,
              maxScore
            )}
            options={{
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50]
            }}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  allCycleAggregations: state.metrics.allCycleAggregations,
  assessmentAggregations: state.metrics.assessmentAggregations
});

export default connect(mapStateToProps)(Assessment);
