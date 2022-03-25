import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { recordSet } from '../../actions/record';
import { priceToString } from '../../helpers/generalHelpers';
import { useRecordDependencies } from '../../hooks/useRecordDependencies';
import { staticURLDocs } from '../../url';
import RecordChecks from './RecordChecks';
import RecordNotes from './RecordNotes';

function RecordSummary({ record, classList }) {
  const dispatch = useDispatch();
  const className = ['RecordSummary', 'ui-card--shadow'];
  classList && className.push(...classList);

  const [lot, project, depsLoaded] = useRecordDependencies(record);

  if (!depsLoaded) return <>Cargando</>;

  const readableState =
    record.state === 'lotpayed'
      ? 'Pago de Servicios o extras pendientes'
      : record.state === 'liquidated'
      ? 'Liquidado'
      : 'Pagos de Lote Pedientes';
  const delivered = lot.state === 'delivered' ? 'Si' : 'No';

  const handleOpen = path => {
    const url = `${staticURLDocs}${path}`;

    window.open(
      url,
      '_blank',
      'top=500,left=200,frame=true,nodeIntegration=no'
    );
  };

  console.log(record.paymentInfo);

  return (
    <div className='card mb-3'>
      <div className='card__header'>
        <img src='../assets/img/info.png' alt='' />
        <h4>
          <Link
            to={`/proyectos/ver/${project._id}/lote/${lot._id}`}
            onClick={() => dispatch(recordSet(record))}>
            <span className='main text-black'>
              Expediente del lote {record.lotNumber} en la manzana{' '}
              {record.manzana}
            </span>
            <span className='sub'>{project.name}</span>
          </Link>
        </h4>
      </div>
      <div className='card__body mb-2'>
        <div className='right'>
          <div className='card__body__item'>
            <span>Estado del expediente</span>
            <p>{readableState}</p>
          </div>
          <div className='card__body__item'>
            <span>Área</span>
            <p>
              {lot.area}m<sup>2</sup>
            </p>
          </div>
          <div className='card__body__item'>
            <span>Fue entregado</span>
            <p>{delivered}</p>
          </div>
        </div>
        <div className='left'>
          <div className='card__body__item'>
            <span>Precio de venta</span>
            <p className='price'>
              ${priceToString(record.paymentInfo.lotPrice)}
            </p>
          </div>
          <div className='card__body__item'>
            <span>Cantidad pagada (Lote)</span>
            <p className='payed'>
              ${priceToString(record.paymentInfo.lotAmountPayed)}
            </p>
          </div>
          {record.paymentInfo.lotAmountDue > 0 && (
            <div className='card__body__item'>
              <span>Cantidad por pagar (Lote)</span>
              <p className='debt'>
                ${priceToString(record.paymentInfo.lotAmountDue)}
              </p>
            </div>
          )}
          <div className='card__body__item'>
            <span>Cantidad pagada (Servicios/Extras)</span>
            <p className='payed'>
              ${priceToString(record.paymentInfo.chargeAmountPayed)}
            </p>
          </div>
          {record.paymentInfo.chargeAmountDue > 0 && (
            <div className='card__body__item'>
              <span>Cantidad por pagar (Servicios/Extras)</span>
              <p className='debt'>
                ${priceToString(record.paymentInfo.chargeAmountDue)}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className='card__body' style={{ position: 'initial' }}>
        <div className='left'>
          <RecordNotes notes={record.notes} recordId={record._id} />
        </div>
        <div className='left'>
          <RecordChecks checks={record.checks} record={record}></RecordChecks>
        </div>
      </div>
      <div className='card__header mt-2'>
        <img src='../assets/img/docs.png' alt='docs' />
        <h4>Documentos disponibles</h4>
      </div>
      <div className='scroll'>
        <div className='card__body__list'>
          {lot.files?.map(f => (
            <div
              onClick={() => {
                handleOpen(f.staticPath);
              }}
              key={f.staticPath}
              className='card__body__list__doc'>
              <p>{f.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RecordSummary;
