import React from 'react';

function ScreenBody({ children, classList }) {
  const className = ['ui-screen__body'];
  classList && className.push(...classList);

  return <div className={className.join(' ')}>{children}</div>;
}

export default ScreenBody;
