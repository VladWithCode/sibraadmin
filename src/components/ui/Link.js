import React from 'react';
import { Link } from 'react-router-dom';

function Link({ classList, onClick, to, children }) {
  const className = ['ui-link', ...classList];

  return (
    <Link className={className.join(' ')} onClick={onClick} to={to}>
      {...children}
    </Link>
  );
}

export default Link;
