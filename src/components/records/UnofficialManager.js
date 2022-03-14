import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { isEmptyObject } from '../../helpers/generalHelpers';
import { staticURLDocs } from '../../url';
import AddFileModal from '../AddFileModal';
import { Floating } from '../Floating';

function UnofficialManager({ unofficialManager, recordId }) {
  const registerManager = e => {};

  const [activeModal, setActiveModal] = useState(false);

  if (isEmptyObject(unofficialManager))
    return (
      <div className='card'>
        <div className='card__header mb-3'>
          <div className='links'>
            <Link
              className='edit'
              to={'/historial/registar-gestor/' + recordId}
              onClick={registerManager}>
              Registar Gestor
            </Link>
          </div>
        </div>
        <h3 className='card__center'>Sin Gestor</h3>
      </div>
    );

  const {
    fullName,
    email,
    phoneNumber,
    occupation,
    township,
    state,
    address,
    files,
  } = unofficialManager;

  return (
    <div className='card'>
      {/* GO Info */}
      <div className='card__body pt-2'>
        <div className='left'>
          <div className='card__header'>
            <h4>Informacion del Gestor</h4>
          </div>
          <div className='card__body__item'>
            <span>Nombre Completo</span>
            <p>{fullName}</p>
          </div>
          <div className='card__body__item'>
            <span>Ocupación</span>
            <p>{occupation}</p>
          </div>
          <div className='card__body__item'>
            <span>Ciudad de residencia</span>
            <p>{township}</p>
          </div>
          <div className='card__body__item'>
            <span>Estado de Residencia</span>
            <p>{state}</p>
          </div>
          <div className='card__body__item'>
            <span>Domicilio</span>
            <p>{address}</p>
          </div>
        </div>
        <div className='left'>
          <div className='card__header'>
            <h4>Informacion de Contacto</h4>
          </div>
          <div className='card__body__item'>
            <span>Email</span>
            <p>{email}</p>
          </div>
          <div className='card__body__item'>
            <span>Numero Telefonico</span>
            <p>{phoneNumber}</p>
          </div>
        </div>
      </div>
      {/* Files */}
      <div className='card__body files mt-3 p-2'>
        <div className='card__header'>
          <div className='left'>
            <h4>Documentos</h4>
          </div>
          <div className='left' onClick={() => setActiveModal(true)}>
            <button className='btn-edit'>Añadir documento</button>
          </div>
        </div>
        <div className='card__body__list'>
          {files?.map(f => {
            return (
              <div
                key={f._id}
                onClick={() =>
                  window.open(
                    staticURLDocs + f.staticPath,
                    '_blank',
                    'top=500,left=200,frame=true,nodeIntegration=no'
                  )
                }
                className='card__body__list__doc'>
                <p style={{ backgroundColor: 'white' }}>{f.name}</p>
              </div>
            );
          })}
        </div>
      </div>
      {activeModal && (
        <Floating setActiveFloating={setActiveModal}>
          <AddFileModal
            endpoint={`/record/${recordId}/manager/file`}
            setActiveFloating={setActiveModal}
          />
        </Floating>
      )}
    </div>
  );
}

export default UnofficialManager;
