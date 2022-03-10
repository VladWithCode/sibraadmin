import React from 'react';
import Cession from './Cession';

function Cessions({ cessions }) {
  return (
    <>
      <div className='project__header'>
        <div className='left'>
          <h3>Cesiónes</h3>
        </div>
      </div>
      {cessions.map(c => (
        <Cession cession={c} key={c._id} />
      ))}
    </>
  );
}

export default Cessions;
