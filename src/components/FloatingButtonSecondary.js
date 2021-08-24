import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { redTypes } from '../types/reduxTypes';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { buyLotReset } from '../actions/payments';


export const FloatingButtonSecondary = () => {

    const dispatch = useDispatch();

    const { iconName, type, projectId, lotId } = useSelector(state => state.secFloatingButton);

    const link = type === redTypes.lotReserved ? `/proyectos/abonar/${projectId}/lote/${lotId}` : `/proyectos/comprar/${projectId}/lote/${lotId}`

    useEffect(() => {

        dispatch(buyLotReset())

    }, [dispatch])

    return (

        <>
            {
                type !== redTypes.projectCreate && (
                    <Link to={link} className="floating-btn floating-btn-secondary" >
                        <svg><use href={`../assets/svg/${iconName}.svg#${iconName}`} ></use></svg>
                    </Link>
                )
            }
        </>

    )
}
