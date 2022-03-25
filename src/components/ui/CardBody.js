import React from 'react';

function CardBody({ children, classList }) {
  const className = ['ui-card__body'];
  classList && className.push(...classList);

  return <div className={className.join(' ')}>{children}</div>;
}

export default CardBody;
