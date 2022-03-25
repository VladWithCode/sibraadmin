import React from 'react';
import ScreenBody from '../screen/ScreenBody';
import ScreenHeader from '../screen/ScreenHeader';
import StatCard from './StatCard';

function Stats() {
  return (
    <div className='Stats ui-screen'>
      <ScreenHeader heading={'Estadisticas'}>
        <div className='ui-screen__search'></div>
      </ScreenHeader>
      <ScreenBody>
        <StatCard
          title={'Lotes'}
          stats={[
            { name: 'Lotes Vendidos', value: 30 },
            { name: 'Lotes Liquidados', value: 10 },
            { name: 'Lotes Entregados', value: 2 },
          ]}
        />
      </ScreenBody>
    </div>
  );
}

export default Stats;
