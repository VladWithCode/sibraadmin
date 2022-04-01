import React from 'react';

function Button({ classList, onClick, children }) {
  const className = ['ui-btn'];
  classList && className.push(...classList);

  return (
    <button className={className.join(' ')} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
