import React, { Component } from 'react';
import { connect } from 'react-redux';
import MaterialTable, { MTableToolbar } from 'material-table';

import styles from './Staff.module.css';
import { AppState } from '../../redux/reducers/rootReducer';
import { Cycle, Staff } from '../../models/types';
import { Paper, Typography, Divider } from '@material-ui/core';
import CONSTS from '../../shared/constants';
import Toggle from '../../components/toggle/Toggle';

interface StaffProps {
  cycles: Cycle[];
}

interface StaffState {
  showInactive: boolean;
}

class StaffView extends Component<StaffProps, StaffState> {
  state = {
    showInactive: false
  };

  createTableData = (staff: Staff[]) =>
    staff.map((person: Staff) => ({
      name: person.name,
      cycle: CONSTS[person.cycle],
      role: person.role,
      startDate: person.startDate.toDateString(),
      endDate: person.endDate ? person.endDate.toDateString() : 'Active'
    }));

  filterStaff = (staff: Staff[], showInactive: boolean) =>
    staff.filter((member: Staff) => !member.active === showInactive);

  toggleHandler = () => {
    this.setState((prevState: StaffState) => ({
      showInactive: !prevState.showInactive
    }));
  };

  render() {
    const { cycles } = this.props;
    const { showInactive } = this.state;

    const staff = cycles.reduce(
      (acc: any, curr: any) => acc.concat(curr.staff),
      []
    );
    const filtededStaff = this.filterStaff(staff, showInactive);

    return (
      <>
        <Paper className={styles.Card}>
          <Typography variant='h2'>Training Staff</Typography>

          <Divider style={{ margin: '12px 0' }} />

          <div className={styles.Body}>
            <Typography variant='subtitle1'>
              <strong>Total Staff: </strong>
              {staff.length}
            </Typography>

            <Typography variant='subtitle1'>
              <strong>Active Staff: </strong>
              {filtededStaff.length}
            </Typography>
          </div>
        </Paper>

        <div className={styles.Paper}>
          <MaterialTable
            columns={[
              { title: 'Name', field: 'name' },
              { title: 'Cycle', field: 'cycle' },
              { title: 'Role', field: 'role' },
              { title: 'Start Date', field: 'startDate' },
              { title: 'End Date', field: 'endDate' }
            ]}
            data={this.createTableData(filtededStaff)}
            options={{
              sorting: true,
              pageSize: 10,
              pageSizeOptions: [10, 20, 50],
              showTitle: false
            }}
            components={{
              Toolbar: props => (
                <div className={styles.Rows}>
                  <div className={styles.Toggle}>
                    <Toggle
                      checked={showInactive}
                      onChange={this.toggleHandler}
                      leftLabel='Active'
                      rightLabel='Inactive'
                    />
                  </div>
                  <MTableToolbar {...props} />
                </div>
              )
            }}
          />
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  cycles: state.metrics.cycles
});

export default connect(mapStateToProps)(StaffView);
