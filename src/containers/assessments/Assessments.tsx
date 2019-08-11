import React, { Component } from 'react';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import { History } from 'history';

import styles from './Assessments.module.css';
import { AppState } from '../../redux/reducers/rootReducer';
import { formatPercentile, calcPercentiles } from '../../shared/dataService';

interface AssessemntsProps {
  allCycleAggregations: any;
  assessmentAggregations: any;
  history: History;
}

class Assessemnts extends Component<AssessemntsProps> {
  createTableData(assessments: any, allCycleAggregationsScores: any) {
    return assessments.map((assessment: any) => ({
      name: assessment.name,
      module: assessment.module,
      average: `${assessment.average}% / ${formatPercentile(
        calcPercentiles(allCycleAggregationsScores, assessment.average)
      )}`
    }));
  }

  render() {
    const {
      allCycleAggregations,
      assessmentAggregations,
      history
    } = this.props;

    return (
      <>
        <div className={styles.Paper}>
          <MaterialTable
            title='Project Averages & Percentiles'
            columns={[
              { title: 'Assessment', field: 'name' },
              { title: 'Module', field: 'module' },
              { title: 'Average/Percentile', field: 'average' }
            ]}
            data={this.createTableData(
              assessmentAggregations.projects,
              allCycleAggregations.projectScores
            )}
            options={{
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50]
            }}
            actions={[
              {
                icon: 'search',
                tooltip: 'View Assessment',
                onClick: (event, rowData) => {
                  history.push(`/assessment/projects/${rowData.name}`);
                }
              }
            ]}
          />
        </div>

        <div className={styles.Paper}>
          <MaterialTable
            title='Quiz Averages & Percentiles'
            columns={[
              { title: 'Assessment', field: 'name' },
              { title: 'Module', field: 'module' },
              { title: 'Average/Percentile', field: 'average' }
            ]}
            data={this.createTableData(
              assessmentAggregations.quizzes,
              allCycleAggregations.quizScores
            )}
            options={{
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50]
            }}
            actions={[
              {
                icon: 'search',
                tooltip: 'View Assessment',
                onClick: (event, rowData) => {
                  history.push(`/assessment/quizzes/${rowData.name}`);
                }
              }
            ]}
          />
        </div>

        <div className={styles.Paper}>
          <MaterialTable
            title='Soft Skill Averages & Percentiles'
            columns={[
              { title: 'Assessment', field: 'name' },
              { title: 'Average/Percentile', field: 'average' }
            ]}
            data={this.createTableData(
              assessmentAggregations.softSkills,
              allCycleAggregations.softSkillsScores
            )}
            options={{
              sorting: true,
              pageSize: 5,
              pageSizeOptions: [5]
            }}
            actions={[
              {
                icon: 'search',
                tooltip: 'View Assessment',
                onClick: (event, rowData) => {
                  history.push(`/assessment/softSkills/${rowData.name}`);
                }
              }
            ]}
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

export default connect(mapStateToProps)(Assessemnts);
