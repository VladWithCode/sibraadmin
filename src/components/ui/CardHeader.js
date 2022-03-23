import React from 'react';

function CardHeader(props) {
  const { classList, content, children } = props;
  const className = ['ui-card__header', classList?.map(c => c)];

  return (
    <div className={className.join(' ')} {...props}>
      {content && <h4 className='ui-card__heading'>{content}</h4>}
      {children}
    </div>
  );
}

export default CardHeader;
