import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getLot } from '../../actions/lot';
import { recordSet } from '../../actions/record';
import { redirectSet } from '../../actions/redirect';
import { redTypes } from '../../types/reduxTypes';

export const LateRecords = ({ lateRecords }) => {
  const dispatch = useDispatch();

  const goToLot = record => {
    dispatch(recordSet(record));
    dispatch(getLot(record.lot));
    dispatch(
      redirectSet(
        redTypes.projects,
        `/proyectos/ver/${record.project}/lote/${record.lot}`
      )
    );
  };

  return (
    <div className='card'>
      <div className='card__body'>
        {lateRecords.map(record => {
          return (
            <Link
              onClick={() => goToLot(record)}
              to={`/proyectos/ver/${record.project}/lote/${record.lot}`}
              className='card__body__item late'
              key={record._id}>
              <span>{record.customer.fullName}</span>
              <p>{record.customer.phoneNumber}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

// lotId: record.lot,
// projectId: record.project,
// title: record.customer.fullName,
// start: eventdate,
// end: eventdate,
// bgcolor: '#fafafa',
// isLate: record.paymentInfo.isLate,
// hasProrogation: record.paymentInfo.hasProrogation,
// allDay: true,
// phoneNumber: record.customer.phoneNumber,
// event: 'Pago del lote'
