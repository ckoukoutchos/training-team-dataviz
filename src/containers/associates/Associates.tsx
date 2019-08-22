import React, { Component } from 'react';
import { connect } from 'react-redux';
import { History } from 'history';

import styles from './Associates.module.css';
import { AppState } from '../../redux/reducers/rootReducer';
import { CycleAggregation, Cycle } from '../../models/types';
import { Typography, Paper, Divider } from '@material-ui/core';
import AssociatesTable from '../../components/associates-table/AssociatesTable';

interface AssociatesProps {
  cycleAggregations: CycleAggregation[];
  cycles: Cycle[];
  lookup: any;
  history: History;
}

class Associates extends Component<AssociatesProps> {
  render() {
    const { cycleAggregations, cycles, lookup, history } = this.props;
    const associates = cycles.reduce(
      (acc: any, curr: any) => acc.concat(curr.associates),
      []
    );

    return (
      <>
        <Paper className={styles.Card}>
          <Typography variant='h2'>Associates</Typography>

          <Divider style={{ margin: '12px 0' }} />

          <div className={styles.Body}>
            <Typography variant='subtitle1'>
              <strong>Total Associates: </strong>
              {associates.length}
            </Typography>

            <Typography variant='subtitle1'>
              <strong>Active Associates: </strong>
              75
            </Typography>
          </div>
        </Paper>

        <AssociatesTable
          associates={associates}
          cycleAggregations={cycleAggregations}
          lookup={lookup}
          history={history}
        />
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  cycleAggregations: state.metrics.cycleAggregations,
  cycles: state.metrics.cycles,
  lookup: state.metadata.cycleNameLookup
});

export default connect(mapStateToProps)(Associates);
