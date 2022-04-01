import React from 'react';
import ScreenHeading from './ScreenHeading';

function ScreenHeader({ children, classList, heading, subheading }) {
  const className = ['ui-screen__header'];
  classList && className.push(...classList);

  return (
    <div className={className.join(' ')}>
      <ScreenHeading heading={heading} subheading={subheading} />
      {children}
    </div>
  );
}

export default ScreenHeader;
