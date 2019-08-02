import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCycleMetrics } from '../../redux/actions';
import MaterialTable, { MTableToolbar } from 'material-table';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import CycleInfo from '../../components/cycle-info/CycleInfo';
import RadarGraph from '../../components/radar-graph/RadarGraph';
import Spinner from '../../components/spinner/Spinner';
import Toggle from '../../components/toggle/Toggle';
import AssociateInfo from '../../components/associate-info/AssociateInfo';
import { getUrlParams, getAssessmentTableData } from '../../shared/dataService';
import CONSTS from '../../shared/constants';
import styles from './Cycle.module.css';

class Cycle extends Component {
  state = {
    showInactive: false,
  }

  componentDidMount() {
    const { cycle } = getUrlParams(this.props.history);
    // only fetches if not already in memory
    if (!Object.keys(this.props.cycleAggr).includes(cycle)) {
      this.props.fetchCycle(cycle);
    }
  }

  toggleHandler = () => {
    this.setState(prevState => ({ showInactive: !prevState.showInactive }));
  }

  createTableData = (cycleAggr, allCycleAggr, cycleMetadata, cycle, showInactive) => {
    const tableData = [];
    let leftCycle = [];
    if (cycleMetadata[cycle]['Associate Leave']) {
      leftCycle = cycleMetadata[cycle]['Associate Leave'].map(associate => associate.name);
    }
    Object.entries(cycleAggr[cycle]).forEach(([name, values]) => {
      if (showInactive && leftCycle.includes(name)) {
        tableData.push(getAssessmentTableData(name, values, allCycleAggr));
      }
      if (!showInactive && !leftCycle.includes(name)) {
        tableData.push(getAssessmentTableData(name, values, allCycleAggr));
      }
    });
    return tableData;
  }

  handleChange = name => evt => {
    this.setState({ [name]: evt.target.checked });
  };

  render() {
    const { allCycleAggr, cycleAggr, cycleMetadata, cycleMetrics, history } = this.props;
    const { showInactive } = this.state;
    const { url, cycle } = getUrlParams(history);

    return (
      !this.props.loading && cycleAggr[cycle] && cycleMetadata[cycle] && cycleMetrics[cycle] && Object.keys(allCycleAggr).length ?
        <div className={styles.Wrapper}>
          <Breadcrumbs path={url} />

          <CycleInfo cycleName={CONSTS[cycle]} metadata={cycleMetadata[cycle]} />

          <RadarGraph
            title='Running Averages of Assessments'
            subtitle='Including the Max and Min Associate Running Average'
            index='avg'
            data={[
              {
                avg: 'Projects',
                'Max': cycleAggr[cycle][cycle].projectMax,
                'Min': cycleAggr[cycle][cycle].projectMin,
                'Average': cycleAggr[cycle][cycle].projectAvg
              },
              {
                avg: 'Quizzes',
                'Max': cycleAggr[cycle][cycle].quizMax,
                'Min': cycleAggr[cycle][cycle].quizMin,
                'Average': cycleAggr[cycle][cycle].quizAvg
              },
              {
                avg: 'Soft Skills',
                'Max': cycleAggr[cycle][cycle].softSkillsMax,
                'Min': cycleAggr[cycle][cycle].softSkillsMin,
                'Average': cycleAggr[cycle][cycle].softSkillsAvg
              },
              {
                avg: 'Attempt/Pass',
                'Max': cycleAggr[cycle][cycle].attemptMax,
                'Min': cycleAggr[cycle][cycle].attemptMin,
                'Average': cycleAggr[cycle][cycle].attemptAvg
              }
            ]}
            keys={['Average', 'Max', 'Min']}
          />

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
              data={this.createTableData(cycleAggr, allCycleAggr, cycleMetadata, cycle, showInactive)}
              options={{
                sorting: true,
                pageSize: 10,
                pageSizeOptions: [10, 20, 50]
              }}
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
              detailPanel={[
                {
                  tooltip: 'Show Details',
                  render: rowData => {
                    return <AssociateInfo bodyOnly cycle={cycle} associate={cycleMetrics[cycle].find(row => row[0].Person === rowData.name)} />;
                  },
                }
              ]}
              actions={[
                {
                  icon: 'search',
                  tooltip: 'View Associate',
                  onClick: (event, rowData) => {
                    if (rowData.name !== cycle) {
                      this.props.history.push(`/cycle/${cycle}/associate/${rowData.name.split(' ').join('-')}`)
                    }
                  }
                }
              ]}
            />
          </div>
        </div>
        : <Spinner />
    );
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
  fetchCycle: (cycleName) => dispatch(fetchCycleMetrics(cycleName))
});

export default connect(mapStateToProps, mapDispatchToProps)(Cycle);