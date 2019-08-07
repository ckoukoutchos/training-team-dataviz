import React, { Component } from 'react';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import { History } from 'history';

import styles from './Associate.module.css';
import AssociateInfo from '../../components/associate-info/AssociateInfo';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import Calendar from '../../components/calendar/Calendar';
import RadarGraph from '../../components/radar-graph/RadarGraph';
import BulletGraph from '../../components/bullet-graph/BulletGraph';

import { getUrlParams, getItemInArrayByName } from '../../shared/dataService';
import { AppState } from '../../redux/reducers/rootReducer';
import { CycleAggregation, Cycle, Associate } from '../../models/types';

interface AssociateProps {
  allCycleAggregations: CycleAggregation;
  cycleAggregations: CycleAggregation[];
  cycles: Cycle[];
  history: History;
}

class AssociateView extends Component<AssociateProps> {
  render() {
    const {
      allCycleAggregations,
      cycleAggregations,
      cycles,
      history
    } = this.props;
    const { url, cycle: cycleName, associate: associateName } = getUrlParams(
      history
    );
    const cycle = getItemInArrayByName(cycles, cycleName);
    const associate = getItemInArrayByName(cycle.associates, associateName);
    const cycleAggregation = getItemInArrayByName(cycleAggregations, cycleName);
    const associateAggregation = getItemInArrayByName(
      cycleAggregation.aggregations,
      associateName
    );

    return (
      <div className={styles.Wrapper}>
        <Breadcrumbs path={url} />

        <AssociateInfo
          associate={getItemInArrayByName(cycle.associates, associateName)}
        />

        <RadarGraph
          title='Running Average of Assesments'
          subtitle='Compared to Cycle & Training Averages'
          keys={[associateName, 'Cycle Average', 'Training Average']}
          index='avg'
          data={[
            {
              avg: 'Projects',
              [associateName]: associateAggregation.projects,
              'Cycle Average': cycleAggregation.projects,
              'Training Average': allCycleAggregations.projects
            },
            {
              avg: 'Quizzes',
              [associateName]: associateAggregation.quizzes,
              'Cycle Average': cycleAggregation.quizzes,
              'Training Average': allCycleAggregations.quizzes
            },
            {
              avg: 'Soft Skills',
              [associateName]: associateAggregation.softSkills,
              'Cycle Average': cycleAggregation.softSkills,
              'Training Average': allCycleAggregations.softSkills
            },
            {
              avg: 'Attempt/Pass',
              [associateName]: associateAggregation.attemptPass,
              'Cycle Average': cycleAggregation.attemptPass,
              'Training Average': allCycleAggregations.attemptPass
            }
          ]}
        />

        {/* <BulletGraph
          title='Cycle Progress'
          subtitle={tradCycle ? null : 'Overall & Per Module'}
          metadata={associateMetadata[associate]}
          traditional={tradCycle}
        /> */}

        <Calendar
          attendance={associate.attendance}
          endDate={associate.endDate}
          startDate={associate.startDate}
        />

        <div className={styles.Paper}>
          <MaterialTable
            title='Associate Metrics'
            columns={[
              { title: 'Interaction', field: 'Interaction' },
              { title: 'Interaction Type', field: 'Interaction Type' },
              { title: 'Score', field: 'Score' },
              { title: 'Date', field: 'Date', type: 'date' }
            ]}
            data={associate.metrics}
            options={{
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50]
            }}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  allCycleAggregations: state.metrics.allCycleAggregations,
  cycleAggregations: state.metrics.cycleAggregations,
  cycles: state.metrics.cycles
});

export default connect(mapStateToProps)(AssociateView);
