import React from 'react';

export const Floating = ({ children, setActiveFloating }) => {
  const handleOnClick = e => {
    if (e.target.dataset['backdrop']) {
      setActiveFloating(false);
    }
  };

  return (
    <div className='floating' onClick={handleOnClick} data-backdrop>
      <div className='window'>{children}</div>
    </div>
  );
};
