import React from 'react';

function Button({ classList, onClick, children }) {
  const className = ['ui-btn', classList?.map(c => c)];

  return (
    <button className={className.join(' ')} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
