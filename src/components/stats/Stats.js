import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClients, getProjects } from '../../actions/consults';
import ScreenBody from '../screen/ScreenBody';
import ScreenHeader from '../screen/ScreenHeader';
import StatCard from './StatCard';
import StatFilter from './StatFilter';

function Stats() {
  const dispatch = useDispatch();
  const { projects, clients } = useSelector(state => state);

  useEffect(() => {
    if (!projects || projects.length === 0) dispatch(getProjects());

    if (!clients || clients.length === 0) dispatch(getClients());
  }, []);

  return (
    <div className='Stats ui-screen'>
      <ScreenHeader heading={'Estadisticas'}>
        <div className='ui-screen__search'></div>
      </ScreenHeader>
      <ScreenBody>
        <div className='Stats__filters mb-3'>
          <div className='Stats__filter'>
            <h4 className='title'>Proyecto</h4>
            <StatFilter
              options={projects.map(p => ({
                name: p.name,
                value: p._id,
                key: p._id,
              }))}
            />
          </div>
          <div className='Stats__filter'>
            <h4 className='title'>Cliente</h4>
            <StatFilter
              options={clients.map(p => ({
                name: p.fullname || p.names + ' ' + p.patLastname,
                value: p._id,
                key: p._id,
              }))}
            />
          </div>
        </div>
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
