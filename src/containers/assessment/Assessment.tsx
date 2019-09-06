import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';
import {
  Divider,
  Paper,
  Typography,
  Tabs,
  Tab,
  Button
} from '@material-ui/core';
import MaterialTable from 'material-table';
import { ResponsiveLine } from '@nivo/line';

import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import Toggle from '../../components/toggle/Toggle';
import styles from './Assessment.module.css';

import {
  getUrlParams,
  calcScoreAvg,
  combineScores
} from '../../shared/dataService';
import { AppState } from '../../redux/reducers/rootReducer';
import CONSTS from '../../shared/constants';
import Metadata from '../../shared/metadata';
import {
  Assessment,
  AssessmentType,
  AssessmentTypeAggregation,
  AssessmentAggregation
} from '../../models/types';
import { Autorenew, Replay, RotateLeft } from '@material-ui/icons';

interface AssessmentProps {
  assessments: AssessmentTypeAggregation;
  assessmentAggregations: AssessmentTypeAggregation;
  history: History;
}

interface AssessmentState {
  activeTab: number;
  firstAttempts: boolean;
  showCycles: boolean;
  [key: string]: any;
}

class AssessmentView extends Component<AssessmentProps, AssessmentState> {
  state = {
    activeTab: 0,
    firstAttempts: false,
    showCycles: false
  };

  filterAssessments(assessments: any, url: string[], activeTab: number) {
    return assessments.filter((assessment: any) => {
      if (activeTab === 1) {
        return assessment.name === url[3] && assessment.cycle[0] === 'm';
      } else if (activeTab === 2) {
        return assessment.name === url[3] && assessment.cycle[0] !== 'm';
      } else {
        return assessment.name === url[3];
      }
    });
  }

  getGraphData(scores: number[], type: string, cycle: string | null) {
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

    if (type === AssessmentType.SOFT_SKILLS) {
      scoreDistribution = {
        '0': 0,
        '1': 0,
        '2': 0,
        '3': 0,
        '4': 0,
        '5': 0
      };
    }
    for (const score of scores) {
      let bracketString = '';

      if (type === AssessmentType.SOFT_SKILLS) {
        // get leading digit
        const bracket = Math.floor(score / 10) / 2;
        // convert to bracket string
        bracketString = bracket === 0 ? '0' : String(bracket);
      } else {
        // get leading digit
        const bracket = Math.floor(score / 10);
        // convert to bracket string
        bracketString = bracket === 0 ? '0' : String(bracket) + '0';
      }
      scoreDistribution[bracketString]++;
    }
    const id = cycle ? CONSTS[cycle] : 'Combined';
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

  getCycleGraphData(assessments: AssessmentAggregation[]) {
    return assessments.map((aggregation: AssessmentAggregation) =>
      this.getGraphData(aggregation.scores, aggregation.type, aggregation.cycle)
    );
  }

  getDataObject(assessments: any[], showCycles: boolean, type: string) {
    const scores = combineScores(assessments, 'scores');
    const avg =
      type === AssessmentType.SOFT_SKILLS
        ? Math.round(calcScoreAvg(scores) / 10 / 2)
        : calcScoreAvg(scores);
    if (!showCycles) {
      return {
        avg,
        data: [this.getGraphData(scores, type, null)]
      };
    } else {
      return {
        avg,
        data: this.getCycleGraphData(assessments)
      };
    }
  }

  getFirstAttempts = (assessments: Assessment[], url: string[]) => {
    const filteredAssessments = assessments.filter(
      (assessment: Assessment) =>
        assessment.cycle[0] === 'm' && assessment.name === url[3]
    );
    const associateMap = {};
    for (const assessment of filteredAssessments) {
      if (associateMap[assessment.associate]) {
        if (associateMap[assessment.associate].date > assessment.date) {
          associateMap[assessment.associate] = assessment;
        }
      } else {
        associateMap[assessment.associate] = assessment;
      }
    }
    return Object.values(associateMap);
  };

  getTableData(assessments: Assessment[]) {
    return assessments.map((assessment: Assessment) => ({
      name: assessment.associate,
      cycle: CONSTS[assessment.cycle],
      date: assessment.date.toDateString(),
      score: `${assessment.score}%`,
      rawScore: assessment.rawScore
    }));
  }

  onTabChange = (event: any, value: number) => {
    this.setState({ activeTab: value });
  };

  toggleHandler = (section: string) => () => {
    this.setState((prevState: AssessmentState) => ({
      [section]: !prevState[section]
    }));
  };

  render() {
    const { assessments, assessmentAggregations, history } = this.props;
    const { activeTab, firstAttempts, showCycles } = this.state;
    const { url } = getUrlParams(history);
    const type = Metadata['Interaction Type'][url[2]];

    const currentAssessmentAggr = this.filterAssessments(
      assessmentAggregations[url[2]],
      url,
      activeTab
    );
    const currentAssessment = this.filterAssessments(
      assessments[url[2]],
      url,
      activeTab
    );

    let data;
    let firstOnly = [];

    if (firstAttempts && activeTab === 1) {
      firstOnly = this.getFirstAttempts(assessments[url[2]], url);
      const scores = combineScores(firstOnly, 'score');
      data = {
        avg: calcScoreAvg(scores),
        data: [this.getGraphData(scores, type, null)]
      };
    } else {
      data = this.getDataObject(currentAssessmentAggr, showCycles, type);
    }

    return (
      <>
        <Breadcrumbs path={url} root='assessment' />

        <Paper className={styles.Card}>
          <Typography variant='h3'>{url[3].split('_').join(' ')}</Typography>
          <Typography variant='h6' color='textSecondary'>
            {type !== AssessmentType.SOFT_SKILLS
              ? Metadata[type].Module
              : 'Soft Skills'}
          </Typography>

          <Divider style={{ margin: '12px 0' }} />

          <div className={styles.Body}>
            <Typography variant='subtitle1'>
              <strong>Assessment Average: </strong>
              {data.avg}%
            </Typography>

            <Typography variant='subtitle1'>
              <strong>Total Submitted: </strong>
              {firstAttempts
                ? firstOnly.length
                : combineScores(currentAssessmentAggr, 'scores').length}
            </Typography>
          </div>
        </Paper>

        <Paper style={{ margin: '16px auto', width: '800px' }}>
          <Tabs
            value={activeTab}
            indicatorColor='primary'
            textColor='primary'
            onChange={this.onTabChange}
            variant='fullWidth'
          >
            <Tab label='All Cycles' icon={<Autorenew />} />
            <Tab label='Mastery Learning' icon={<RotateLeft />} />
            <Tab label='Traditional' icon={<Replay />} />
          </Tabs>
        </Paper>

        <Paper className={styles.Paper}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-around',
              margin: '4px 16px 0 16px'
            }}
          >
            <Toggle
              checked={showCycles}
              onChange={this.toggleHandler('showCycles')}
              leftLabel='Combined'
              rightLabel='Per Cycle'
            />

            {activeTab === 1 && type === AssessmentType.PROJECT && (
              <Toggle
                checked={firstAttempts}
                onChange={this.toggleHandler('firstAttempts')}
                leftLabel='All Attempts'
                rightLabel='1st Attempts'
              />
            )}
          </div>

          <div className={styles.GraphPaper}>
            <ResponsiveLine
              data={data.data}
              margin={{ top: 30, right: 30, bottom: 100, left: 70 }}
              markers={[
                {
                  axis: 'x',
                  value: data.avg,
                  lineStyle: { stroke: 'black', strokeWidth: 3 }
                }
              ]}
              xScale={{
                type: type === AssessmentType.SOFT_SKILLS ? 'point' : 'linear',
                min: 0,
                max: type === AssessmentType.SOFT_SKILLS ? 5 : 100
              }}
              yScale={{
                type: 'linear',
                stacked: false,
                min: 0,
                max: 'auto'
              }}
              //@ts-ignore
              curve='catmullRom'
              axisTop={null}
              axisRight={null}
              axisBottom={{
                orient: 'bottom',
                tickSize: 5,
                tickPadding: 5,
                tickRotation: 0,
                legend: 'Score',
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
              lineWidth={3}
              enableArea={true}
              enableSlices='x'
              areaBlendMode='normal'
              areaOpacity={0.05}
              isInteractive={true}
              enableCrosshair={true}
              animate={false}
            />
          </div>
        </Paper>

        <div className={styles.Paper}>
          <MaterialTable
            columns={[
              {
                title: 'Associate',
                field: 'name',
                render: (rowData: any) => (
                  <Button
                    color='primary'
                    onClick={() =>
                      history.push(
                        `/cycle/${CONSTS[rowData.cycle]}/associate/${
                          rowData.name
                        }`
                      )
                    }
                  >
                    {rowData.name}
                  </Button>
                )
              },
              { title: 'Cycle', field: 'cycle' },
              {
                title: 'Date',
                field: 'date',
                customSort: (a: any, b: any) =>
                  new Date(a.date).valueOf() - new Date(b.date).valueOf()
              },
              {
                title: 'Score',
                field: 'score',
                customSort: (a: any, b: any) =>
                  a.score.split('%')[0] - b.score.split('%')[0]
              },
              { title: 'Raw Score', field: 'rawScore' }
            ]}
            data={this.getTableData(currentAssessment)}
            options={{
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50],
              showTitle: false
            }}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  assessments: state.metrics.assessments,
  assessmentAggregations: state.metrics.assessmentAggregations
});

export default connect(mapStateToProps)(AssessmentView);
