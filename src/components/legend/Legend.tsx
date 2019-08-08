import React from 'react';
import CONSTS from '../../shared/constants';
import styles from './Legend.module.css';

interface LegendProps {
  colors: string;
  items: any[];
}

const Legend = (props: LegendProps) => {
  const { items, colors } = props;

  return (
    <div className={styles.Legend}>
      {items.map((item: any, index: number) => (
        <div key={index} className={styles.Legend}>
          <div
            style={{
              background: CONSTS[colors][index],
              height: '15px',
              width: '15px',
              margin: '0 4px'
            }}
          />
          <p className={styles.Label}>
            {item
              .split(' ')
              .splice(0, 2)
              .join(' ')}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Legend;
