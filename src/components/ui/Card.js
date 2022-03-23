import React from 'react';

function Card({ children, classList }) {
  const className = ['ui-card'];
  classList && className.push(...classList);

  return <div className={className.join(' ')}>{children}</div>;
}

export default Card;
