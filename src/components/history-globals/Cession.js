import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLot } from '../../actions/lot';
import { dateToReadableString } from '../../helpers/dateHelpers';
import { staticURLDocs } from '../../url';
import AddFileModal from '../AddFileModal';
import FileList from '../FileList';
import { Floating } from '../Floating';

function Cession({ cession }) {
  const dispatch = useDispatch();
  const {
    _id,
    assignor,
    assignee,
    notes,
    requestDate,
    cessionDate,
    completed,
    files,
  } = cession;
  const { _id: lotId } = useSelector(state => state.lot);

  const [activeModal, setActiveModal] = useState(false);

  return (
    <div className='card mb-3' key={_id}>
      <div className='card__header'>
        <div className='left'>
          <h3 className='text-black mb-1'>Cesión de {assignor}</h3>
          <span className='status'>{completed ? '' : 'Pendiente'}</span>
        </div>
      </div>

      <div className='card__body'>
        <div className='left mb-3'>
          <h4 className='mb-1'>Datos del Cedente</h4>
          <div className='card__body__item'>
            <span>Nombre:</span>
            <p>{assignor}</p>
          </div>
          <div className='card__body__item'>
            <span>Fecha en que solicitó la Cesión:</span>
            <p>{dateToReadableString(requestDate) || 'Por definir'}</p>
          </div>
          <div className='card__body__item'>
            <span>Fecha en que se completó la Cesión</span>
            <p>{dateToReadableString(cessionDate) || 'Por definir'}</p>
          </div>
        </div>
        <div className='left mb-3'>
          <h4 className='mb-1'>Datos del Cesionado</h4>
          <div className='card__body__item'>
            <span>Nombre:</span>
            <p>{assignee}</p>
          </div>
        </div>
        {notes?.length > 0 && (
          <div className='left'>
            <h4 className='mb-1'>Notas</h4>
            <div className='card__body__item'>
              <span>Nota</span>
              <p>{notes}</p>
            </div>
          </div>
        )}
      </div>
      <div className='card__body files mt-3 p-2'>
        <div className='card__header'>
          <div className='left'>
            <h4>Documentos</h4>
          </div>
          <div className='left'>
            <button className='btn-edit' onClick={() => setActiveModal(true)}>
              Añadir documento
            </button>
          </div>
        </div>
        <div className='card__body__list'>
          <FileList files={files} />
        </div>
      </div>
      {activeModal && (
        <Floating setActiveFloating={setActiveModal}>
          <AddFileModal
            endpoint={`/record/${lotId}/cession/${_id}/file`}
            setActiveFloating={setActiveModal}
            stateUpdater={res => dispatch(setLot(res.lot))}
          />
        </Floating>
      )}
    </div>
  );
}

export default Cession;
