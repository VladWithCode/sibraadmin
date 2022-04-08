import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { redTypes } from '../../types/reduxTypes';
import { redirectSet } from '../../actions/redirect';
import { breadcrumbsUpdate } from '../../actions/breadcrumbs';
import { BreadCrumbs } from '../BreadCrumbs';
import { floatingButtonSet } from '../../actions/floatingButton';
import { modalUpdate } from '../../actions/modal';
import { getClient } from '../../actions/consults';
import { setTempError, setTempSuccessNotice } from '../../actions/ui';
import { staticURLDocs } from '../../url';
import { Record } from '../history-globals/Record';
import makeServerRequest from '../../helpers/makeServerRequest';
import RecordSummary from '../records/RecordSummary';

export const Client = () => {
  const { clientId } = useParams();
  const dispatch = useDispatch();
  const { client } = useSelector(state => state);

  const {
    names,
    patLastname,
    matLastname,
    rfc,
    phoneNumber,
    _id,
    address,
    curp,
    email,
    files,
    refs,
    maritalState,
    occupation,
    township,
    pob,
    dob,
    nationality,
    records,
  } = client;

  const activeRecords = records?.filter(rec => rec.state !== 'cancelled');

  useEffect(() => {
    dispatch(getClient(clientId));
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const modalInfo = {
      title: 'Editar Cliente',
      text: `¿Desea editar al cliente ${names} ${patLastname}?`,
      link: `/clientes/edit/${_id}`,
      okMsg: 'Sí',
      closeMsg: 'No',
    };

    dispatch(modalUpdate(modalInfo));

    const breadcrumbs = [
      {
        dispName: 'clientes',
        link: '/clientes',
      },
      {
        dispName: `${client.patLastname} ${client.names}`,
        link: `/clientes/ver/${clientId}`,
      },
    ];

    dispatch(breadcrumbsUpdate(redTypes.clients, breadcrumbs));
    dispatch(redirectSet(redTypes.clients, `/clientes/ver/${clientId}`));
    dispatch(floatingButtonSet('pencil', redTypes.clientEdit));
    // eslint-disable-next-line
  }, [dispatch, client]);

  const handleOpen = path => {
    const url = `${staticURLDocs}${path}`;

    window.open(
      url,
      '_blank',
      'top=500,left=200,frame=true,nodeIntegration=no'
    );
  };

  const deleteCustomer = async () => {
    const { status, message, error } = makeServerRequest(
      '/customer/' + client._id,
      'DELETE'
    );

    if (status !== 'OK') {
      console.log(error);
      dispatch(
        setTempError(
          message ||
            error?.message ||
            'Hubo un error al comunicarse con el servidor'
        )
      );

      return;
    }

    dispatch(setTempSuccessNotice('Se elimino con exito el cliente.'));
  };

  if (!client._id) {
    return <>Cargando...</>;
  }

  return (
    <>
      <BreadCrumbs type={redTypes.clients}></BreadCrumbs>

      <div className='pb-5 project'>
        <div className='project__header'>
          <div className='left'>
            <h3> Cliente </h3>
            <span className='span'> {_id} </span>
          </div>
          <div className='left'>
            <button className='btn btn-delete' onClick={deleteCustomer}>
              Eliminar
            </button>
          </div>
        </div>

        <div className='card'>
          <div className='card__header'>
            <img src='../assets/img/user.png' alt='' />
            <h4>Información General del Cliente</h4>
          </div>
          <div className='card__body'>
            <div className='left'>
              <div className='card__body__item'>
                <span>Nombre(s)</span>
                <p> {names} </p>
              </div>
              <div className='card__body__item'>
                <span>Apellido Paterno</span>
                <p> {patLastname} </p>
              </div>
              {matLastname && (
                <div className='card__body__item'>
                  <span>Apellido Materno</span>
                  <p> {matLastname} </p>
                </div>
              )}
              <div className='card__body__item'>
                <span>RFC</span>
                <p> {rfc} </p>
              </div>
              <div className='card__body__item'>
                <span>Curp</span>
                <p> {curp} </p>
              </div>
              {maritalState && (
                <div className='card__body__item'>
                  <span>Estadi civil</span>
                  <p> {maritalState} </p>
                </div>
              )}
              {occupation && (
                <div className='card__body__item'>
                  <span>Ocupación</span>
                  <p> {occupation} </p>
                </div>
              )}
              {client.state && (
                <div className='card__body__item'>
                  <span>Estado</span>
                  <p> {client.state} </p>
                </div>
              )}
              {township && (
                <div className='card__body__item'>
                  <span>Municipio</span>
                  <p> {township} </p>
                </div>
              )}
              {pob && (
                <div className='card__body__item'>
                  <span>Lugar de nacimiento</span>
                  <p> {pob} </p>
                </div>
              )}
              {dob && (
                <div className='card__body__item'>
                  <span>Fecha de nacimiento</span>
                  <p> {dob} </p>
                </div>
              )}
              {nationality && (
                <div className='card__body__item'>
                  <span>Nacionalidad</span>
                  <p> {nationality} </p>
                </div>
              )}
            </div>
            <div className='left'>
              <div className='mt-4 card__header'>
                <h4>Información de contacto</h4>
              </div>
              <div className='card__body__item'>
                <span>Email</span>
                <p> {email} </p>
              </div>
              <div className='card__body__item'>
                <span>Número de Contacto</span>
                <p>{phoneNumber}</p>
              </div>

              <div className='mt-3 card__header'>
                <h4>Dirección</h4>
              </div>
              <div className='card__body__item'>
                <span>Colonia</span>
                <p>{address?.col}</p>
              </div>
              <div className='card__body__item'>
                <span>Calle</span>
                <p>{address?.street}</p>
              </div>
              <div className='card__body__item'>
                <span>Número exterior</span>
                <p>{address?.extNumber}</p>
              </div>
              {address?.intNumber && (
                <div className='card__body__item'>
                  <span>Número interior</span>
                  <p>{address?.intNumber}</p>
                </div>
              )}
              <div className='card__body__item'>
                <span>Código Postal</span>
                <p>{address?.zip}</p>
              </div>
              <div className='mt-3 card__header'>
                <img src='../assets/img/docs.png' alt='' />
                <h4>Documentos Disponibles</h4>
              </div>
              <div className='scroll'>
                <div className='card__body__list'>
                  {files?.map(({ name, staticPath, _id }) => (
                    <div
                      onClick={() => {
                        handleOpen(staticPath);
                      }}
                      key={_id}
                      className='card__body__list__doc'>
                      <p>{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='project__header'>
          <div className='left'>
            <h3> Referencias </h3>
          </div>
        </div>

        <div className='card-grid'>
          {refs &&
            refs.map((ref, index) => (
              <div className={`card`} key={index}>
                <div className='card__header'>
                  <img src='../assets/img/aval.png' alt='' />
                  <h4>Referencia personal {index + 1}</h4>
                </div>
                <div className='card__body__item'>
                  <span>Nombre(s)</span>
                  <p>{ref.names}</p>
                </div>
                <div className='card__body__item'>
                  <span>Apellido Paterno</span>
                  <p> {ref.patLastname} </p>
                </div>
                {ref.matLastname && (
                  <div className='card__body__item'>
                    <span>Apellido Materno</span>
                    <p> {ref.matLastname} </p>
                  </div>
                )}
                <div className='card__body__item'>
                  <span>Número de Contacto</span>
                  <p> {ref.phoneNumber} </p>
                </div>

                {ref.address && (
                  <>
                    {ref.address.col && (
                      <>
                        <div className='mt-3 card__header'>
                          <h4>Dirección</h4>
                        </div>
                        <div className='card__body__item'>
                          <span>Colonia</span>
                          <p> {ref.address.col} </p>
                        </div>
                      </>
                    )}
                    {ref.address.street && (
                      <div className='card__body__item'>
                        <span>Calle</span>
                        <p> {ref.address.street} </p>
                      </div>
                    )}
                    {ref.address.extNumber && (
                      <div className='card__body__item'>
                        <span>Número exterior</span>
                        <p> {ref.address.extNumber} </p>
                      </div>
                    )}
                    {ref.address.intNumber && (
                      <div className='card__body__item'>
                        <span>Número interior</span>
                        <p> {ref.address.intNumber} </p>
                      </div>
                    )}
                    {ref.address.zip && (
                      <div className='card__body__item'>
                        <span>código postal</span>
                        <p> {ref.address.zip} </p>
                      </div>
                    )}
                  </>
                )}

                <div className='mt-3 card__header'>
                  <img src='../assets/img/docs.png' alt='' />
                  <h4>Documentos Disponibles</h4>
                </div>
                <div className='scroll'>
                  <div className='card__body__list'>
                    {ref.files &&
                      ref.files.map(({ name, staticPath }) => (
                        <div
                          onClick={() => {
                            handleOpen(staticPath);
                          }}
                          key={staticPath}
                          className='card__body__list__doc'>
                          <p>{name}</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {activeRecords?.length > 0 && (
          <>
            <div className='project__header'>
              <div className='left'>
                <h3>Expedientes Activos</h3>
              </div>
            </div>
            {/* {activeRecords.map(record => (
              <Record key={record._id} record={record} lotId={record.lot} />
            ))} */}
            {activeRecords.map((record, i) => {
              return (
                <RecordSummary
                  classList={i < activeRecords.length - 1 ? ['mb-2'] : []}
                  key={record._id}
                  record={record}
                />
              );
            })}
          </>
        )}
      </div>
    </>
  );
};
