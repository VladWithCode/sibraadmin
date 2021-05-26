import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { modalEnable } from '../actions/modal';

export const FloatingButton = () => {

    // const icon = type === types.projects ? 'plus' : type === types.project || type === types.lot ? 'pencil' : 'bill';

    const { iconName } = useSelector(state => state.floatingButton)

    const dispatch = useDispatch();

    const handleOpenModal = () => {
        dispatch(modalEnable());
    }


    return (

        <>
            <div className="floating-btn" onClick={handleOpenModal} >
                <svg><use href={`/../assets/svg/${iconName}.svg#${iconName}`} ></use></svg>
            </div>           
        </>

    )
}
