import React from 'react';

function ListItem({ children, classList, onChange }) {
  const className = ['ui-list__item'];
  classList && className.push(...classList);

  return <li className={className.join(' ')}>{children}</li>;
}

export default ListItem;
