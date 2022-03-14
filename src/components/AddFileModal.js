import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { recordSet } from '../actions/record';
import { uiFinishLoading, uiStartLoading } from '../actions/ui';
import makeServerRequest from '../helpers/makeServerRequest';

function AddFileModal({ endpoint, setActiveFloating }) {
  const dispatch = useDispatch();
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState(null);

  const handler = async e => {
    dispatch(uiStartLoading());

    const formData = new FormData();

    formData.append('file', file);
    formData.append('fileName', fileName);

    const { status, record, message, error } = await makeServerRequest(
      endpoint,
      'PUT',
      formData
    );

    dispatch(uiFinishLoading());
    dispatch(recordSet(record));
    setActiveFloating(false);
  };

  return (
    <div className='card'>
      <div className='card__header'>
        <div className='left'>
          <h3 className='text-black'>Añadir Documento</h3>
        </div>
      </div>
      <div className='card__body'>
        <div className='full'>
          <input
            type='file'
            name='file'
            onChange={e => setFile(e.target.files[0])}
          />
          <div className='card__body__item mt-1 mb-2'>
            <label htmlFor='fileName'>Nombre del Archivo</label>
            <input
              type='text'
              name='fileName'
              onChange={e => setFileName(e.target.value)}
              value={fileName}
            />
          </div>
          <button className='btn-submit' onClick={handler}>
            Añadir
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddFileModal;
