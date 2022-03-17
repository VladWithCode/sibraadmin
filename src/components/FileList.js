import React from 'react';
import FileListItem from './FileListItem';

function FileList({ files }) {
  if (!files || files.length === 0)
    return (
      <h4 style={{ margin: 'auto', fontSize: '2.4rem' }}>
        No hay archivos disponibles
      </h4>
    );

  return (
    <div className='card__body__list'>
      {files.map(f => (
        <FileListItem key={f._id} file={f} />
      ))}
    </div>
  );
}

export default FileList;
