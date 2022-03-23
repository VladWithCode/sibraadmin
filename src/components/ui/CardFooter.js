import React from 'react';

function CardFooter(props) {
  const { children, classList } = props;
  const className = ['ui-card__footer', classList.map(c => c)];

  return <div className={className}>{children}</div>;
}

export default CardFooter;
