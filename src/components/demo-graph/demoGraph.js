<div style={{ height: '500px', width: '500px'}}>
      <ResponsiveBullet
            data={[
              {
                id: 'Basics',
                ranges: [8, 16],
                measures: [7],
                markers: [5, 10]
              },
              {
                id: 'Databases',
                ranges: [4, 8],
                measures: [3],
                markers: [2, 6]
              },
              {
                id: 'Java',
                ranges: [10, 20],
                measures: [9],
                markers: [6, 13]
              },
              {
                id: 'React',
                ranges: [8, 16],
                measures: [11],
                markers: [6, 13]
              }
            ]}
            margin={{ top: 50, right: 90, bottom: 50, left: 90 }}
            layout='vertical'
            spacing={50}
            titleOffsetY={-19}
            markerSize={0.9}
            measureSize={0.5}
            rangeColors={['rgb(98, 207, 107)', 'rgb(207, 98, 98)']}
            measureColors='rgb(233, 233, 233)'
            markerColors={['rgb(56, 121, 61)', 'rgb(117, 55, 55)']}
          />
          </div>