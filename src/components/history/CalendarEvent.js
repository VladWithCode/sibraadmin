import React from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { historyGetLot } from '../../actions/historyActions';
import { getLot } from '../../actions/lot';
import { redirectSet } from '../../actions/redirect';
import { redTypes } from '../../types/reduxTypes';

export const CalendarEvent = ({ event }) => {

    console.log(event);

    const { phoneNumber, title, projectId, lotId } = event;

    const dispatch = useDispatch();

    return (
        <Link
            to={`/historial/abonar/${projectId}/lote/${lotId}`}
            onClick={() => {
                dispatch(historyGetLot(lotId));
                dispatch(getLot(lotId));
                dispatch(redirectSet(redTypes.history, `/historial/abonar/${projectId}/lote/${lotId}`));
            }}
        >
            <h4>{title}</h4>
            <p>{phoneNumber}</p>
        </Link>
    )
}
