import React, { Component } from 'react';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import { History } from 'history';

import AssociateInfo from '../../components/associate-info/AssociateInfo';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import Calendar from '../../components/calendar/Calendar';
import MLAssociateProgress from '../../components/progression/ml-associate-progress/MLAssociateProgress';
import RadarGraph from '../../components/radar-graph/RadarGraph';
import TraditionalCycleProgress from '../../components/progression/traditional-cycle-progess/TraditionalCycleProgress';

import styles from './Associate.module.css';
import { getUrlParams, getItemInArrayByName } from '../../shared/dataService';
import { AppState } from '../../redux/reducers/rootReducer';
import {
  CycleAggregation,
  Cycle,
  Associate,
  Aggregation
} from '../../models/types';
import RollUps from '../../components/roll-ups/RollUps';
import MLModuleProgress from '../../components/progression/ml-module-progress/MLModuleProgress';
import { Button } from '@material-ui/core';
import Timeline from '../../components/timeline/Timeline';
import GradEstimate from '../../components/grad-estimates/GradEstimates';

interface AssociateProps {
  cycleAggregations: any[];
  cycles: Cycle[];
  lookup: any;
  history: History;
}

interface AssociateState {
  showComparisons: boolean;
}

class AssociateView extends Component<AssociateProps, AssociateState> {
  state = {
    showComparisons: true
  };

  showComparisonHandler = () => {
    this.setState((prevState: AssociateState) => ({
      showComparisons: !prevState.showComparisons
    }));
  };

  render() {
    const { cycleAggregations, cycles, lookup, history } = this.props;
    const { showComparisons } = this.state;
    const { url, cycle: cycleName, associate: associateName } = getUrlParams(
      history
    );
    const cycle: Cycle = getItemInArrayByName(cycles, cycleName);
    const associate: Associate = getItemInArrayByName(
      cycle.associates,
      associateName
    );
    const cycleAggregation: CycleAggregation = getItemInArrayByName(
      cycleAggregations,
      cycleName
    );
    const associateAggregation: Aggregation = getItemInArrayByName(
      cycleAggregation.aggregations,
      associateName
    );

    return (
      <>
        <div style={{ margin: 'auto' }}>
          <Breadcrumbs path={url} root='cycle' />
          <Button
            variant='contained'
            color='primary'
            style={{ margin: '0 0 3px 16px' }}
            onClick={this.showComparisonHandler}
          >
            {showComparisons ? 'Associate View' : 'Trainer View'}
          </Button>
        </div>

        <div className={styles.Wrapper}>
          <div className={styles.Container}>
            <AssociateInfo
              associate={associate}
              cycleName={lookup[cycleName]}
            />

            <RollUps
              aggregation={associateAggregation}
              showComposite={showComparisons}
            />

            <Calendar
              attendance={associate.attendance}
              endDate={associate.endDate}
              startDate={associate.startDate}
            />

            <RadarGraph
              title='Assessments'
              subtitle='Project, Quiz, and Soft Skill Averages'
              keys={
                showComparisons
                  ? [associateName, 'Cycle Average']
                  : [associateName]
              }
              index='avg'
              data={
                showComparisons
                  ? [
                      {
                        avg: 'Projects',
                        [associateName]: associateAggregation.projects,
                        'Cycle Average': cycleAggregation.projects
                      },
                      {
                        avg: 'Quizzes',
                        [associateName]: associateAggregation.quizzes,
                        'Cycle Average': cycleAggregation.quizzes
                      },
                      {
                        avg: 'Soft Skills',
                        [associateName]: associateAggregation.softSkills,
                        'Cycle Average': cycleAggregation.softSkills
                      },
                      {
                        avg: 'Exercises',
                        [associateName]: associateAggregation.exercises,
                        'Cycle Average': cycleAggregation.exercises
                      }
                    ]
                  : [
                      {
                        avg: 'Projects',
                        [associateName]: associateAggregation.projects
                      },
                      {
                        avg: 'Quizzes',
                        [associateName]: associateAggregation.quizzes
                      },
                      {
                        avg: 'Soft Skills',
                        [associateName]: associateAggregation.softSkills
                      },
                      {
                        avg: 'Exercises',
                        [associateName]: associateAggregation.exercises
                      }
                    ]
              }
            />

            <Timeline associate={associate} />

            {cycleName[0] === 'm' && associate.active && showComparisons && (
              <GradEstimate
                associate={associate}
                aggregation={associateAggregation}
              />
            )}
          </div>

          <div className={styles.Container}>
            {cycleName[0] === 'm' ? (
              <MLAssociateProgress
                associate={associate}
                title='Cycle Progress'
                subtitle='Overall & Per Module'
              />
            ) : (
              <TraditionalCycleProgress
                item={associate}
                title='Cycle Progress'
              />
            )}

            {cycleName[0] === 'm' &&
              !associate.endDate &&
              !associate.modules[5].startDate && (
                <MLModuleProgress associate={associate} />
              )}

            <div className={styles.Paper}>
              <MaterialTable
                title='Associate Metrics'
                columns={[
                  { title: 'Interaction', field: 'Interaction' },
                  { title: 'Interaction Type', field: 'Interaction Type' },
                  { title: 'Score', field: 'Score' },
                  {
                    title: 'Date',
                    field: 'Date',
                    customSort: (a: any, b: any) => {
                      const dateA = a.Date.split('/');
                      const dateB = b.Date.split('/');
                      if (Number(dateA[0]) < Number(dateB[0])) {
                        return -1;
                      } else if (Number(dateA[0]) > Number(dateB[0])) {
                        return 1;
                      } else {
                        return Number(dateA[1]) < Number(dateB[1]) ? -1 : 1;
                      }
                    }
                  }
                ]}
                data={associate.metrics}
                options={{
                  sorting: true,
                  pageSize: 20,
                  pageSizeOptions: [10, 20, 50]
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  cycleAggregations: state.metrics.cycleAggregations,
  cycles: state.metrics.cycles,
  lookup: state.metadata.cycleNameLookup
});

export default connect(mapStateToProps)(AssociateView);
