import React from 'react';
import { dateToReadableString } from '../../helpers/dateHelpers';

function Cession({ cession }) {
  const { assignor, assignee, notes, requestDate, cessionDate } = cession;

  return (
    <div className='card mb-3' key={cession._id}>
      <div className='card__header'>
        <h3 className='text-black'>Cesión de {assignor}</h3>
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
            <p>{dateToReadableString(requestDate)}</p>
          </div>
          <div className='card__body__item'>
            <span>Fecha en que se completó la Cesión</span>
            <p>{dateToReadableString(cessionDate)}</p>
          </div>
        </div>
        <div className='left mb-3'>
          <h4 className='mb-1'>Datos del Cesionado</h4>
          <div className='card__body__item'>
            <span>Nombre:</span>
            <p>{assignee}</p>
          </div>
        </div>
        <div className='left'>
          <h4 className='mb-1'>Notas</h4>
          <div className='card__body__item'>
            <span>Nota</span>
            <p>{notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cession;
