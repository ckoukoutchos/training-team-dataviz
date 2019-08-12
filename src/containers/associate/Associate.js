import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCycleMetrics } from '../../redux/actions/cycleActions';
import MaterialTable from 'material-table';
import styles from './Associate.module.css';
import AssociateInfo from '../../components/associate-info/AssociateInfo';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import Calendar from '../../components/calendar/Calendar';
import RadarGraph from '../../components/radar-graph/RadarGraph';
import { getUrlParams } from '../../shared/dataService';
import BulletGraph from '../../components/bullet-graph/BulletGraph';
import Spinner from '../../components/spinner/Spinner';

class Associate extends Component {
  componentDidMount() {
	const { cycle } = getUrlParams(this.props.history);
    // only fetches if not already in memory
    if (!Object.keys(this.props.cycleAggr).includes(cycle)) {
	  const fileId = this.props.cycleMetadata[cycle].fileId;
      this.props.fetchCycle(cycle, fileId);
    }
  }

  render() {
    const { associateMetadata, cycleAggr, cycleMetrics, history } = this.props;
    const { url, cycle, associate } = getUrlParams(history);
    const tradCycle = RegExp('trad').test(cycle);

    return (
      !this.props.loading && cycleMetrics[cycle] && cycleAggr[cycle] && associateMetadata[associate] ?
        <div className={styles.Wrapper}>
          <Breadcrumbs path={url} />

          <AssociateInfo cycle={cycle} associate={cycleMetrics[cycle].find(row => row[0].Person === associate)} />

          <RadarGraph
            title='Running Avg of Assesments'
            subtitle='Compared to Cycle Averages'
            keys={[associate, 'Cycle Average']}
            index='avg'
            data={[
              {
                avg: 'Projects',
                [associate]: cycleAggr[cycle][associate].projectAvg,
                'Cycle Average': cycleAggr[cycle][cycle].projectAvg
              },
              {
                avg: 'Quizzes',
                [associate]: cycleAggr[cycle][associate].quizAvg,
                'Cycle Average': cycleAggr[cycle][cycle].quizAvg,

              },
              {
                avg: 'Soft Skills',
                [associate]: cycleAggr[cycle][associate].softSkillsAvg,
                'Cycle Average': cycleAggr[cycle][cycle].softSkillsAvg,
              },
              {
                avg: 'Attempt/Pass',
                [associate]: cycleAggr[cycle][associate].attemptPass,
                'Cycle Average': cycleAggr[cycle][cycle].attemptAvg
              }
            ]}
          />

          <BulletGraph
            title='Cycle Progress'
            subtitle={tradCycle ? null : 'Overall & Per Module'}
            metadata={associateMetadata[associate]}
            traditional={tradCycle}
          />

          <Calendar metrics={cycleMetrics[cycle].find(row => row[0].Person === associate)} />

          <div className={styles.Paper}>
            <MaterialTable
              title="Associate Metrics"
              columns={[
                { title: 'Interaction', field: 'Interaction' },
                { title: 'Interaction Type', field: 'Interaction Type' },
                { title: 'Score', field: 'Score' },
                { title: 'Date', field: 'Date', type: 'date' }
              ]}
              data={cycleMetrics[cycle].find(row => row[0].Person === associate)}
              options={{
                sorting: true
              }}
            />
          </div>
        </div>
        : <Spinner />
    );
  }
}

const mapStateToProps = state => ({
  associateMetadata: state.cycles.associateMetadata,
  cycleAggr: state.cycles.cycleAggr,
  cycleMetrics: state.cycles.cycleMetrics,
  loading: state.cycles.loading,
  cycleMetadata: state.cycles.cycleMetadata
});

const mapDispatchToProps = dispatch => ({
  fetchCycle: (cycleName, fileId) => dispatch(fetchCycleMetrics(cycleName, fileId))
});

export default connect(mapStateToProps, mapDispatchToProps)(Associate);