import React from 'react';
import { Divider, Paper, Typography } from '@material-ui/core';
import { ResponsiveBullet } from '@nivo/bullet'
import styles from './BulletGraph.module.css';

const BulletGraph = props => {
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
        <ResponsiveBullet
          data={[
              {
                "id": "temp.",
                "ranges": [
                  27,
                  31,
                  28,
                  0,
                  100
                ],
                "measures": [
                  74
                ],
                "markers": [
                  71
                ]
              },
              {
                "id": "power",
                "ranges": [
                  1.6176649785923283,
                  0.007553081192264437,
                  1.9590286366558287,
                  0,
                  2
                ],
                "measures": [
                  1.210065964084255,
                  1.2359946945656102
                ],
                "markers": [
                  1.8830730233247515
                ]
              },
              {
                "id": "volume",
                "ranges": [
                  27,
                  5,
                  29,
                  9,
                  3,
                  31,
                  0,
                  40
                ],
                "measures": [
                  10
                ],
                "markers": [
                  40
                ]
              },
              {
                "id": "cost",
                "ranges": [
                  15293,
                  21964,
                  370563,
                  0,
                  500000
                ],
                "measures": [
                  51566,
                  105264
                ],
                "markers": [
                  443759
                ]
              },
              {
                "id": "revenue",
                "ranges": [
                  6,
                  3,
                  1,
                  0,
                  9
                ],
                "measures": [
                  3
                ],
                "markers": [
                  6.631357300511784,
                  8.495226893413687
                ]
              }
            ]}
          margin={{ top: 50, right: 90, bottom: 50, left: 90 }}
          spacing={46}
          titleAlign="start"
          titleOffsetX={-70}
          measureSize={0.2}
          animate={true}
          motionStiffness={90}
          motionDamping={12}
        />
      </div>
    </Paper>
  )
}

export default BulletGraph;