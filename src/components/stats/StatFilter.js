import React from 'react';
import SearchSelect from '../ui/SearchSelect';

function StatFilter({ options }) {
  return (
    <div className='StatFilter'>
      <SearchSelect options={options} />
    </div>
  );
}

export default StatFilter;
