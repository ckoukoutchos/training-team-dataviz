import React from 'react';
import { Paper } from '@material-ui/core';
import { ResponsiveRadar } from '@nivo/radar'
import styles from './RadarGraph.module.css';

const RadarGraph = props => {
  return (
    <Paper className={styles.Paper}>
      <ResponsiveRadar
        data={props.data}
        keys={props.keys}
        indexBy='avg'
        maxValue={100}
        margin={{ top: 70, right: 80, bottom: 40, left: 80 }}
        curve='catmullRomClosed'
        borderWidth={2}
        borderColor={{ from: 'color' }}
        gridLevels={3}
        gridShape='circular'
        gridLabelOffset={15}
        enableDots={true}
        dotSize={10}
        dotColor={{ theme: 'background' }}
        dotBorderWidth={3}
        dotBorderColor={{ from: 'color' }}
        enableDotLabel={false}
        dotLabel='value'
        dotLabelYOffset={-12}
        colors={{ scheme: 'category10' }}
        fillOpacity={0.1}
        blendMode='multiply'
        legends={[
          {
            anchor: 'top-left',
            direction: 'column',
            translateX: -50,
            translateY: -40,
            itemWidth: 80,
            itemHeight: 20,
            itemTextColor: '#999',
            symbolSize: 12,
            symbolShape: 'circle',
            effects: [
              {
                on: 'hover',
                style: {
                  itemTextColor: '#000'
                }
              }
            ]
          }
        ]}
      />
    </Paper>
  )
}

export default RadarGraph;