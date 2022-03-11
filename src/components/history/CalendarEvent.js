import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { historyGetLot } from '../../actions/historyActions';
import { getLot } from '../../actions/lot';
import { paymentOpen } from '../../actions/payments';
import { redirectSet } from '../../actions/redirect';
import { redTypes } from '../../types/reduxTypes';

export const CalendarEvent = ({ event }) => {
  const { phoneNumber, title, projectId, lotId } = event;

  const dispatch = useDispatch();

  return (
    <Link
      to={`/historial/abonar/${projectId}/lote/${lotId}`}
      onClick={() => {
        dispatch(historyGetLot(lotId));
        dispatch(getLot(lotId));
        dispatch(
          redirectSet(
            redTypes.history,
            `/historial/abonar/${projectId}/lote/${lotId}`
          )
        );
        dispatch(paymentOpen(projectId));
      }}>
      <h4>{title}</h4>
      <p>{phoneNumber}</p>
    </Link>
  );
};
