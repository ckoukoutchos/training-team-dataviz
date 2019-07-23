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
        margin={{ top: 35, right: 20, bottom: 35, left: 20 }}
        curve='catmullRomClosed'
        borderWidth={2}
        borderColor={{ from: 'color' }}
        gridLevels={3}
        gridShape='circular'
        gridLabelOffset={20}
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
            translateX: 150,
            translateY: 0,
            itemWidth: 60,
            itemHeight: 20,
            itemTextColor: '#555',
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