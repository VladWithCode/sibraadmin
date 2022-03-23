import React from 'react';

function List(props) {
  const { children, classList } = props;
  const className = ['ui-list'];
  classList && className.push(...classList);

  return <ul className={className.join(' ')}>{children}</ul>;
}

export default List;
