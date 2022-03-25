import React from 'react';

function CardHeader({ classList, content, children }) {
  const className = ['ui-card__header'];
  classList && className.push(...classList);

  return (
    <div className={className.join(' ')}>
      {content && <h4 className='ui-card__heading'>{content}</h4>}
      {children}
    </div>
  );
}

export default CardHeader;
