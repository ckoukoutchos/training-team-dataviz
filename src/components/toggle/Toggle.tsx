import React from 'react';
import { Grid, Switch, Typography } from '@material-ui/core';
import styles from './Toggle.module.css';

interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  leftLabel: string;
  rightLabel: string;
}

const Toggle = (props: ToggleProps) => {
  const { checked, onChange, leftLabel, rightLabel } = props;

  return (
    <div className={styles.Switch}>
      <Typography component='div'>
        <Grid component='label' container alignItems='center' spacing={1}>
          <Grid item>{leftLabel}</Grid>
          <Grid item>
            <Switch
              color='primary'
              checked={checked}
              onChange={onChange}
              value='checkedC'
            />
          </Grid>
          <Grid item>{rightLabel}</Grid>
        </Grid>
      </Typography>
    </div>
  );
};

export default Toggle;
