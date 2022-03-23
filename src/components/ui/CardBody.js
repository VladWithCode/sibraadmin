import React from 'react';

function CardBody(props) {
  const { children, classList } = props;
  const className = ['ui-card__body', classList?.map(c => c)];

  return <div className={className.join(' ')}>{children}</div>;
}

export default CardBody;
