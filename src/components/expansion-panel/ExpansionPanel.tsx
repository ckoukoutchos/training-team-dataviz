import React, { ReactElement } from 'react';
import {
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

interface ExpansionPanelsProps {
  children: ReactElement;
  panelTitle: string;
}

const ExpansionPanels = (props: ExpansionPanelsProps) => {
  const { children, panelTitle } = props;
  return (
    <ExpansionPanel>
      <ExpansionPanelSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls='panel1a-content'
        id='panel1a-header'
      >
        <Typography>{panelTitle}</Typography>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>{children}</ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default ExpansionPanels;
