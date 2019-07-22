import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCycleMetrics } from '../../redux/actions';

import { CircularProgress, Paper } from '@material-ui/core';
import { ResponsiveRadar } from '@nivo/radar'
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import MetricsRollUp from '../../components/metricsRollUp/MetricsRollUp';
import { calcProjectScoreMinMax, calcSoftSkillsScoreMinMax, calcQuizScoreMinMax, calcProjectScoreAvg, calcSoftSkillsScoreAvg, calcQuizScoreAvg } from '../../shared/dataService';
import styles from './Cycle.module.css';

class Cycle extends Component {
  componentDidMount() {
    if (!this.props.mlPortland2019.length) {
      this.props.fetchCycle();
    }
  }

  render() {
    const projectMinMax = calcProjectScoreMinMax(this.props.mlPortland2019);
    const quizMinMax = calcQuizScoreMinMax(this.props.mlPortland2019);
    const softSkillsMinMax = calcSoftSkillsScoreMinMax(this.props.mlPortland2019);

    return (
      !this.props.loading ?
        <div className={styles.Wrapper}>
          <Breadcrumbs path={this.props.history.location.pathname.split('/')} />

          <Paper style={{ height: '400px', margin: '16px auto', width: '900px' }}>
            <ResponsiveRadar
              data={[
                {
                  avg: 'Projects',
                  'Max': projectMinMax[1],
                  'Min': projectMinMax[0],
                  'Cycle Average': calcProjectScoreAvg([].concat(...this.props.mlPortland2019))
                },
                {
                  avg: 'Quizzes',
                  'Max': quizMinMax[1],
                  'Min': quizMinMax[0],
                  'Cycle Average': calcQuizScoreAvg([].concat(...this.props.mlPortland2019))
                },
                {
                  avg: 'Soft Skills',
                  'Max': softSkillsMinMax[1],
                  'Min': softSkillsMinMax[0],
                  'Cycle Average': calcSoftSkillsScoreAvg([].concat(...this.props.mlPortland2019))
                }
              ]}
              keys={['Cycle Average', 'Max', 'Min']}
              indexBy='avg'
              maxValue={100}
              margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
              curve='catmullRomClosed'
              borderWidth={2}
              borderColor={{ from: 'color' }}
              gridLevels={3}
              gridShape='circular'
              gridLabelOffset={15}
              enableDots={true}
              dotSize={10}
              dotColor={{ theme: 'background' }}
              dotBorderWidth={3}
              dotBorderColor={{ from: 'color' }}
              enableDotLabel={false}
              dotLabel='value'
              dotLabelYOffset={-12}
              colors={{ scheme: 'category10' }}
              fillOpacity={0.1}
              blendMode='multiply'
              legends={[
                {
                  anchor: 'top-left',
                  direction: 'column',
                  translateX: -50,
                  translateY: -40,
                  itemWidth: 80,
                  itemHeight: 20,
                  itemTextColor: '#999',
                  symbolSize: 12,
                  symbolShape: 'circle',
                  effects: [
                    {
                      on: 'hover',
                      style: {
                        itemTextColor: '#000'
                      }
                    }
                  ]
                }
              ]}
            />
          </Paper>

          <MetricsRollUp associate={[].concat(...this.props.mlPortland2019)} />
          <MetricsRollUp associates={this.props.mlPortland2019} cycleName='mlPortland2019' showName />
        </div>
        : <CircularProgress />
    );
  }
}

const mapStateToProps = state => ({
  loading: state.cycles.loading,
  mlPortland2019: state.cycles.mlPortland2019
});

const mapDispatchToProps = dispatch => ({
  fetchCycle: () => dispatch(fetchCycleMetrics())
});

export default connect(mapStateToProps, mapDispatchToProps)(Cycle);