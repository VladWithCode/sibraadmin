import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { breadcrumbsUpdate } from '../../actions/breadcrumbs';
import { modalUpdate } from '../../actions/modal';
import { redirectSet } from '../../actions/redirect';
import { redTypes } from '../../types/reduxTypes';
import { BreadCrumbs } from '../BreadCrumbs';
import { staticURLDocs } from '../../url';
import { getLot } from '../../actions/lot';
import {
  floatingButtonSet,
  secondaryFloatingButtonSet,
} from '../../actions/floatingButton';
import { FloatingButtonSecondary } from '../FloatingButtonSecondary';
import { Record } from '../history-globals/Record';
import { PriceHistory } from './PriceHistory';
import { ClientShort } from '../clients/ClientShort';
import { Cancellations } from '../history-globals/Cancellations';
import Cessions from '../history-globals/Cessions';
import { getCessionInfo } from '../../helpers/lotHelpers';
import UnofficialManager from '../records/UnofficialManager';
import { isEmptyObject } from '../../helpers/generalHelpers';
import makeServerRequest from '../../helpers/makeServerRequest';
import { setTempError } from '../../actions/ui';
import { recordSet } from '../../actions/record';

export const Lot = () => {
  const dispatch = useDispatch();
  const { lotId, projectId } = useParams();

  const {
    lots,
    projects,
    lot: tempLot,
    clients,
    record,
  } = useSelector(state => state);

  const currentProject = projects.find(p => p._id === projectId);

  const [currentLot, setCurrentLot] = useState({});

  useEffect(() => {
    if (tempLot && Object.keys(tempLot).length > 0) setCurrentLot(tempLot);

    if (!tempLot.record || isEmptyObject(tempLot.record))
      dispatch(recordSet(null));
  }, [tempLot]);

  const [currentClient, setCurrentClient] = useState(
    clients.find(c => c._id === currentLot?.record)
  );

  const { name, availableServices } = currentProject;

  const stateName =
    tempLot.state === 'available'
      ? 'Disponible'
      : tempLot.state === 'delivered'
      ? 'Entregado'
      : tempLot.state === 'reserved'
      ? 'Comprado'
      : 'Liquidado';

  const cession = getCessionInfo(currentLot);

  useEffect(() => {
    const modalInfo = {
      title: 'Editar lote',
      text: `¿Desea editar el lote ${currentLot?.lotNumber}?`,
      link: `/proyectos/edit/${projectId}/lote/${lotId}`,
      okMsg: 'Sí',
      closeMsg: 'No',
    };

    dispatch(modalUpdate(modalInfo));

    const breadcrumbs = [
      {
        dispName: 'proyectos',
        link: '/proyectos',
      },
      {
        dispName: `${name}`,
        link: `/proyectos/ver/${projectId}`,
      },
      {
        dispName: `Lote ${currentLot.lotNumber}`,
        link: `/proyectos/ver/${projectId}/lote/${lotId}`,
      },
    ];

    dispatch(breadcrumbsUpdate(redTypes.projects, breadcrumbs));
    dispatch(floatingButtonSet('pencil', redTypes.projectEdit));
    dispatch(
      redirectSet(
        redTypes.projects,
        `/proyectos/ver/${projectId}/lote/${lotId}`
      )
    );
    dispatch(getLot(lotId));
    dispatch(
      secondaryFloatingButtonSet(
        'bill',
        currentLot?.state === 'reserved' ||
          currentLot?.state === 'delivered' ||
          currentLot?.state === 'payed' ||
          currentLot?.state === 'liquidated'
          ? redTypes.lotReserved
          : null,
        projectId,
        lotId
      )
    );
  }, [
    dispatch,
    lotId,
    currentLot?.lotNumber,
    name,
    projectId,
    currentLot?.state,
  ]);

  useEffect(() => {
    const setRecord = async () => {
      if (!(typeof currentLot.record === 'string')) {
        if (!currentLot.record?._id) return;

        const { status, record, message, error } = await makeServerRequest(
          '/records/' + currentLot?.record._id
        );

        if (status) {
          dispatch(
            setTempError(
              error?.message || message || 'Error al recuperar el expediente'
            )
          );
          return;
        }

        dispatch(recordSet(record));
      }
    };

    if (!record) {
      setRecord();
    }
  }, [record]);

  useEffect(() => {
    setCurrentClient(clients.find(c => c._id === currentLot?.customer));

    setCurrentLot(tempLot._id ? tempLot : lots.find(lot => lot._id === lotId));
  }, [clients, currentLot?.customer, lotId, lots, tempLot]);

  const handleOpen = path => {
    const url = `${staticURLDocs}${path}`;

    window.open(
      url,
      '_blank',
      'top=500,left=200,frame=true,nodeIntegration=no'
    );
  };

  if (
    !currentLot ||
    isEmptyObject(currentLot) ||
    (currentLot.record && (!record || Object.keys(record).length === 0))
  )
    return <>loading...</>;

  const {
    area,
    isCorner,
    lotNumber,
    measures,
    state,
    manzana,
    files,
    priceHistory,
    bindings,
    cancellations,
    cessions,
  } = currentLot;

  return (
    <>
      <BreadCrumbs type={redTypes.projects} />
      <FloatingButtonSecondary pay />

      <div className='project'>
        <div className='project__header'>
          <div className='left'>
            <h3>
              Lote {lotNumber} - Manzana {manzana}
            </h3>
            <span> {name} </span>
          </div>
          <div className='right'>
            <div className={`item state ${state}`}>
              <p> {stateName} </p>
            </div>
          </div>
        </div>

        <div className='card'>
          <div className='card__header'>
            <img src='../assets/img/lots.png' alt='' />
            <h4>Información General del Lote</h4>
          </div>
          <div className='card__body'>
            <div className='right'>
              <div className='card__body__item'>
                <span>Número de Lote</span>
                <p> {lotNumber} </p>
              </div>
              <div className='card__body__item'>
                <span>Número de Manzana</span>
                <p> {manzana} </p>
              </div>
              <div className='card__body__item'>
                <span>Proyecto</span>
                <p> {name} </p>
              </div>
              <div className='card__body__item'>
                <span>Esquina</span>
                <p> {isCorner ? 'Sí' : 'No'} </p>
              </div>
              <div className='card__body__item'>
                <span>Área</span>
                <p>
                  {' '}
                  {area}m<sup>2</sup>{' '}
                </p>
              </div>
              <div className='card__body__item'>
                <span>Precio</span>
                <p className='price'>
                  {' '}
                  ${currentLot?.price?.toLocaleString()}{' '}
                </p>
              </div>
            </div>
            <div className='left'>
              <div className='card__header'>
                <h4>Medidas</h4>
              </div>
              {measures?.length > 0 &&
                measures.map(measure => (
                  <div key={measure._id} className='card__body__item'>
                    <span>{measure.title}</span>
                    <p>
                      {measure.value}m<sup>2</sup>
                    </p>
                  </div>
                ))}

              {bindings?.length > 0 && (
                <>
                  <div className='card__header mt-3'>
                    <h4>Colinancias</h4>
                  </div>

                  {bindings.map((binding, index) => (
                    <div key={`binding-${index}`} className='card__body__item'>
                      <span>Colinancia {index + 1}</span>
                      <p>{binding}</p>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>

        <div className='card scroll mt-2'>
          <div className='full'>
            <div className='card__header'>
              <img src='../assets/img/services.png' alt='' />
              <h4>Servicios Disponibles</h4>
            </div>
            <div className='card__body__list'>
              {availableServices?.map(
                service =>
                  service.length > 0 && (
                    <div key={service} className='card__body__list__item'>
                      <p>{service}</p>
                    </div>
                  )
              )}
            </div>
            <div className='card__header mt-4'>
              <img src='../assets/img/docs.png' alt='' />
              <h4>Documentos Disponibles</h4>
            </div>
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

        {currentClient && (
          <>
            <div className='project__header'>
              <div className='left'>
                <h3> Cliente Comprador </h3>
              </div>
            </div>
            <ClientShort client={currentClient} cession={cession} />
          </>
        )}

        {record && !isEmptyObject(record) && (
          <>
            <div className='project__header'>
              <div className='left'>
                <h3>Expedientes</h3>
              </div>
            </div>

            <Record key={record._id} record={record} lotId={lotId} />
          </>
        )}

        {record && !isEmptyObject(record) && (
          <>
            <div className='project__header'>
              <div className='left'>
                <h3>Gestor Oficioso</h3>
              </div>
            </div>
            <UnofficialManager
              unofficialManager={record.unofficialManager}
              recordId={record._id}
              lot={currentLot}
            />
          </>
        )}

        {priceHistory && (
          <>
            <div className='project__header'>
              <div className='left'>
                <h3>Historial de precios</h3>
              </div>
            </div>
            <PriceHistory priceHistory={priceHistory} />
          </>
        )}

        {cancellations?.length > 0 && (
          <>
            <div className='project__header'>
              <div className='left'>
                <h3>Cancelaciones</h3>
              </div>
            </div>
            <Cancellations cancellations={cancellations} />
          </>
        )}

        {cessions?.length > 0 ? <Cessions cessions={cessions} /> : ''}
      </div>

      {/* <FloatingButton type='lotAvailable' />
            <FloatingButtonSecondary type='lotAvailable' /> */}
    </>
  );
};
