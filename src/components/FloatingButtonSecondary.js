import React from 'react';
// import { types } from '../types';
import { ModalConfirm } from './ModalConfirm';

export const FloatingButtonSecondary = ({ type }) => {



    return (

        <>
            <div className="floating-btn floating-btn-secondary" >
                <svg><use href="../assets/svg/bill.svg#bill" ></use></svg>
            </div>

            <ModalConfirm />
        </>

    )
}
