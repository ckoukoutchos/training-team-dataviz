import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchAllCyclesMetrics } from '../../redux/actions';
import MaterialTable, { MTableToolbar } from 'material-table';
import Toggle from '../../components/toggle/Toggle';
import Spinner from '../../components/spinner/Spinner';
import AssociateInfo from '../../components/associate-info/AssociateInfo';
import { getAssessmentTableData } from '../../shared/dataService';
import styles from './Associates.module.css';

class Associates extends Component {
  state = {
    showInactive: false
  }

  componentDidMount() {
    if (!Object.keys(this.props.allCycleAggr).length) {
      this.props.fetchAllCycles();
    }
  }

  createTableData(cycleAggr, allCycleAggr, cycleMetadata, showInactive) {
    const associateScores = [];
    for (const cycle in cycleAggr) {
      let leftCycle = [];
      if (cycleMetadata[cycle]['Associate Leave']) {
        leftCycle = cycleMetadata[cycle]['Associate Leave'].map(associate => associate.name);
      }
      Object.entries(cycleAggr[cycle]).forEach(([name, values]) => {
        if (showInactive && leftCycle.includes(name)) {
          associateScores.push(getAssessmentTableData(name, values, allCycleAggr));
        }
        if (!showInactive && !leftCycle.includes(name)) {
          associateScores.push(getAssessmentTableData(name, values, allCycleAggr));
        }
      });
    }
    return associateScores;
  }

  toggleHandler = () => {
    this.setState(prevState => ({ showInactive: !prevState.showInactive }));
  }


  render() {
    const { allCycleAggr, cycleAggr, cycleMetadata, cycleMetrics, loading } = this.props;
    const { showInactive } = this.state;
    let table = <Spinner />;

    if (!loading && Object.keys(cycleAggr).length && Object.keys(cycleMetrics).length && Object.keys(allCycleAggr).length && Object.keys(cycleMetadata).length) {
      table = (
        <div className={styles.Paper}>
          <MaterialTable
            title="Associate Assessment Average & Percentile"
            columns={[
              { title: 'Associate', field: 'name' },
              { title: 'Projects', field: 'projectAvg' },
              { title: 'Quizzes', field: 'quizAvg' },
              { title: 'Soft Skills', field: 'softSkillsAvg' },
              { title: 'Attempt/Pass', field: 'attemptPass' }
            ]}
            data={this.createTableData(cycleAggr, allCycleAggr, cycleMetadata, showInactive)}
            options={{
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50]
            }}
            detailPanel={[
              {
                tooltip: 'Show Name',
                render: rowData => {
                  let cycleName = 'mlPortland2019';
                  for (const cycle in cycleAggr) {
                    if (cycleAggr[cycle][rowData.name]) {
                      cycleName = cycle;
                    }
                  }
                  return <AssociateInfo bodyOnly cycle={cycleName} associate={cycleMetrics[cycleName].find(row => row[0].Person === rowData.name)} />;
                },
              }
            ]}
            components={{
              Toolbar: props => (
                <>
                  <MTableToolbar {...props} />
                  <Toggle
                    checked={showInactive}
                    onChange={this.toggleHandler}
                    leftLabel='Active'
                    rightLabel='Inactive'
                  />
                </>
              )
            }}
            actions={[
              {
                icon: 'search',
                tooltip: 'View Associate',
                onClick: (event, rowData) => {
                  let cycleName = 'mlPortland2019';
                  for (const cycle in cycleAggr) {
                    if (cycleAggr[cycle][rowData.name]) {
                      cycleName = cycle;
                    }
                  }
                  this.props.history.push(`/cycle/${cycleName}/associate/${rowData.name.split(' ').join('-')}`)
                }
              }
            ]}
          />
        </div>
      );
    }

    return table;
  }
}

const mapStateToProps = state => ({
  allCycleAggr: state.cycles.allCycleAggr,
  cycleAggr: state.cycles.cycleAggr,
  cycleMetadata: state.cycles.cycleMetadata,
  cycleMetrics: state.cycles.cycleMetrics,
  loading: state.cycles.loading
});

const mapDispatchToProps = dispatch => ({
  fetchAllCycles: () => dispatch(fetchAllCyclesMetrics())
});

export default connect(mapStateToProps, mapDispatchToProps)(Associates);