import React from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getLot } from '../../actions/lot';
import { redirectSet } from '../../actions/redirect';
import { redTypes } from '../../types/reduxTypes';

export const CalendarEvent = ({ event }) => {

    console.log(event);

    const { phoneNumber, title, projectId, lotId } = event;

    const dispatch = useDispatch();

    return (
        <Link
            to={`/proyectos/abonar/${projectId}/lote/${lotId}`}
            onClick={() => {
                dispatch(getLot(lotId));
                dispatch(redirectSet(redTypes.projects, `/proyectos/abonar/${projectId}/lote/${lotId}`));
            }}
        >
            <h4>{title}</h4>
            <p>{phoneNumber}</p>
        </Link>
    )
}
