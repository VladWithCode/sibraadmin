import React from 'react';
import { staticURLDocs } from '../url';

function FileListItem({ file }) {
  const clicHandler = e => {
    window.open(
      staticURLDocs + file.staticPath,
      '_blank',
      'top=500,left=200,frame=true,nodeIntegration=no'
    );
  };

  return (
    <div className='card__body__list__doc' onClick={clicHandler}>
      <p style={{ backgroundColor: 'white' }}>{file.name}</p>
    </div>
  );
}

export default FileListItem;
