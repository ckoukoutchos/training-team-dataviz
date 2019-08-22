import React, { Component } from 'react';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import { History } from 'history';

import styles from './Assessments.module.css';
import { AppState } from '../../redux/reducers/rootReducer';
import { formatPercentile, calcPercentiles } from '../../shared/dataService';
import {
  Paper,
  Typography,
  Divider,
  Tabs,
  Tab,
  Button
} from '@material-ui/core';
import { RecordVoiceOver, School, Web } from '@material-ui/icons';

interface AssessemntsProps {
  allCycleAggregations: any;
  assessmentAggregations: any;
  history: History;
}

interface AssessmentsState {
  activeTab: number;
}

class Assessemnts extends Component<AssessemntsProps, AssessmentsState> {
  state = {
    activeTab: 0
  };

  createTableData(assessments: any, allCycleAggregationsScores: any) {
    return assessments.map((assessment: any) => ({
      name: assessment.name,
      module: assessment.module,
      average: `${assessment.average}% / ${formatPercentile(
        calcPercentiles(allCycleAggregationsScores, assessment.average)
      )}`
    }));
  }

  onTabChange = (event: any, value: number) => {
    this.setState({ activeTab: value });
  };

  render() {
    const {
      allCycleAggregations,
      assessmentAggregations,
      history
    } = this.props;
    const { activeTab } = this.state;

    return (
      <>
        <Paper className={styles.Card}>
          <Typography variant='h2'>Assessments</Typography>

          <Divider style={{ margin: '12px 0' }} />
        </Paper>

        <Paper style={{ margin: '16px auto', width: '800px' }}>
          <Tabs
            value={activeTab}
            indicatorColor='primary'
            textColor='primary'
            onChange={this.onTabChange}
            variant='fullWidth'
          >
            <Tab label='Projects' icon={<Web />} />
            <Tab label='Quizzes' icon={<School />} />
            <Tab label='Soft Skills' icon={<RecordVoiceOver />} />
          </Tabs>
        </Paper>

        {activeTab === 0 && (
          <div className={styles.Paper}>
            <MaterialTable
              columns={[
                {
                  title: 'Assessment',
                  field: 'name',
                  render: rowData => (
                    <Button
                      color='primary'
                      onClick={() =>
                        history.push(`/assessment/projects/${rowData.name}`)
                      }
                    >
                      {rowData.name}
                    </Button>
                  )
                },
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
                pageSizeOptions: [10, 20, 50],
                showTitle: false
              }}
            />
          </div>
        )}

        {activeTab === 1 && (
          <div className={styles.Paper}>
            <MaterialTable
              columns={[
                {
                  title: 'Assessment',
                  field: 'name',
                  render: rowData => (
                    <Button
                      color='primary'
                      onClick={() =>
                        history.push(`/assessment/quizzes/${rowData.name}`)
                      }
                    >
                      {rowData.name}
                    </Button>
                  )
                },
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
                pageSizeOptions: [10, 20, 50],
                showTitle: false
              }}
            />
          </div>
        )}

        {activeTab === 2 && (
          <div className={styles.Paper}>
            <MaterialTable
              columns={[
                {
                  title: 'Assessment',
                  field: 'name',
                  render: rowData => (
                    <Button
                      color='primary'
                      onClick={() =>
                        history.push(`/assessment/softSkills/${rowData.name}`)
                      }
                    >
                      {rowData.name}
                    </Button>
                  )
                },
                { title: 'Average/Percentile', field: 'average' }
              ]}
              data={this.createTableData(
                assessmentAggregations.softSkills,
                allCycleAggregations.softSkillsScores
              )}
              options={{
                sorting: true,
                pageSize: 5,
                pageSizeOptions: [5],
                showTitle: false
              }}
            />
          </div>
        )}
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  allCycleAggregations: state.metrics.allCycleAggregations,
  assessmentAggregations: state.metrics.assessmentAggregations
});

export default connect(mapStateToProps)(Assessemnts);
