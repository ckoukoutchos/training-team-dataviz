import React, { Component } from 'react';
import { connect } from 'react-redux';
import MaterialTable from 'material-table';
import { History } from 'history';

import styles from './Assessments.module.css';
import { AppState } from '../../redux/reducers/rootReducer';
import {
  Paper,
  Typography,
  Divider,
  Tabs,
  Tab,
  Button
} from '@material-ui/core';
import { RecordVoiceOver, School, Web } from '@material-ui/icons';
import Metadata from '../../shared/metadata';
import { AssessmentType } from '../../models/types';

interface AssessemntsProps {
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

  createTableData(type: string) {
    const assessments = Object.entries(Metadata[type]);
    return assessments.map(([key, value]: any) => ({
      name: key,
      module: value.Module,
      average: 50
    }));
  }

  onTabChange = (event: any, value: number) => {
    this.setState({ activeTab: value });
  };

  render() {
    const { assessmentAggregations, history } = this.props;
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
                { title: 'Module', field: 'module' }
              ]}
              data={this.createTableData(AssessmentType.PROJECT)}
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
                { title: 'Module', field: 'module' }
              ]}
              data={this.createTableData(AssessmentType.QUIZ)}
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
                }
              ]}
              data={this.createTableData(AssessmentType.SOFT_SKILLS)}
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
  assessmentAggregations: state.metrics.assessmentAggregations
});

export default connect(mapStateToProps)(Assessemnts);
