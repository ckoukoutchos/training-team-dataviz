import React from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import { ResponsiveRadar } from '@nivo/radar'
import styles from './RadarGraph.module.css';

const RadarGraph = props => {
  const { data, keys, title, subtitle} = props;

  return (
    <Paper className={styles.Paper}>
      <div className={styles.Header}>
        <Typography variant='h5'>
            {title}
          </Typography>
          { subtitle ? <Typography variant='subtitle1' color='textSecondary'>
            {subtitle}
          </Typography> : null}
        </div>

      <div className={styles.Divider}>
        <Divider />
      </div>

      <div className={styles.Graph}>
        <ResponsiveRadar
          data={data}
          keys={keys}
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
              translateX: 120,
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
      </div>
    </Paper>
  )
}

export default RadarGraph;