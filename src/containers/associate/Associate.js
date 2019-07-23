import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetchCycleMetrics } from '../../redux/actions';
import { CircularProgress, Paper, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import styles from './Associate.module.css';
import AssociateInfo from '../../components/associateInfo/AssociateInfo';
import Breadcrumbs from '../../components/breadcrumbs/Breadcrumbs';
import RadarGraph from '../../components/radar-graph/RadarGraph';
import { getUrlParams } from '../../shared/dataService';

class Associate extends Component {
  componentDidMount() {
    const { cycle } = getUrlParams(this.props.history);
    // only fetches if not already in memory
    if (!Object.keys(this.props.cycleAggr).includes(cycle)) {
      this.props.fetchCycle(cycle);
    }
  }

  render() {
    const { cycleAggr, cycleMetrics, history } = this.props;
    const { url, cycle, associate } = getUrlParams(history);

    return (
      !this.props.loading && cycleMetrics[cycle] && cycleAggr[cycle] ?
        <div className={styles.Wrapper}>
          <Breadcrumbs path={url} />

          <AssociateInfo cycle={cycle} associate={cycleMetrics[cycle].find(row => row[0].Person === associate)} />

          <RadarGraph
            keys={['Cycle Average', associate]}
            data={[
              {
                avg: 'Projects',
                [associate]: cycleAggr[cycle][associate].projectAvg,
                'Cycle Average': cycleAggr[cycle][cycle].projectAvg
              },
              {
                avg: 'Quizzes',
                [associate]: cycleAggr[cycle][associate].quizAvg,
                'Cycle Average': cycleAggr[cycle][cycle].quizAvg
              },
              {
                avg: 'Soft Skills',
                [associate]: cycleAggr[cycle][associate].softSkillsAvg,
                'Cycle Average': cycleAggr[cycle][cycle].softSkillsAvg
              }
            ]}
          />

          <Paper className={styles.Container}>
            <Table className={styles.Table}>
              <TableHead>
                <TableRow>
                  <TableCell align='left'>Interaction</TableCell>
                  <TableCell align='left'>Interaction Type</TableCell>
                  <TableCell align='left'>Score</TableCell>
                  <TableCell align='left'>Date</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {cycleMetrics[cycle].find(row => row[0].Person === associate).map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align='left'>{row.Interaction}</TableCell>
                    <TableCell align='left'>{row['Interaction Type']}</TableCell>
                    <TableCell align='left'>{row.Score}</TableCell>
                    <TableCell align='left'>{row.Date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </div>
        : <CircularProgress />
    );
  }
}

const mapStateToProps = state => ({
  cycleAggr: state.cycles.cycleAggr,
  cycleMetrics: state.cycles.cycleMetrics,
  loading: state.cycles.loading
});

const mapDispatchToProps = dispatch => ({
  fetchCycle: (cycleName) => dispatch(fetchCycleMetrics(cycleName))
});

export default connect(mapStateToProps, mapDispatchToProps)(Associate);