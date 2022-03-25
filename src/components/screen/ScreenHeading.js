import React from 'react';

function ScreenTitle({ heading, subheading, classList }) {
  const className = ['ui-screen__title'];
  classList && className.push(...classList);

  return (
    <div className={className}>
      <h1 className='ui-screen__heading'>{heading}</h1>
      <p className='ui-screen__subheading'>{subheading}</p>
    </div>
  );
  // return ;
}

export default ScreenTitle;
