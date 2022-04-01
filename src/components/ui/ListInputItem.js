import React from 'react';

function ListInputItem({ label, name, classList, onChange, value, type }) {
  const className = ['ui-listinput'];
  classList && className.push(...classList.map(c => c));

  return (
    <div className={className.join(' ')}>
      <label htmlFor={name} className='ui-listinput__label'>
        {label}
      </label>
      <input
        type={type || 'text'}
        onChange={onChange}
        value={value}
        name={name}
        className='ui-listinput__control'
      />
    </div>
  );
}

export default ListInputItem;
