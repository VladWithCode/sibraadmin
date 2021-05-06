import React, { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
// import { types } from '../types';
import { ModalConfirm } from './ModalConfirm';

export const FloatingButtonSecondary = ({type}) => {

    const { appData, appData:{modalActive}, setAppData } = useContext(AppContext);

    useEffect(() => {
        
        setAppData({...appData, modalType: type});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (

        <>
            <div className="floating-btn" onClick={() => setAppData({...appData, modalActive: !modalActive})} >
                <svg><use href="/../assets/svg/plus.svg#plus" ></use></svg>
            </div>

            <ModalConfirm  />            
        </>

    )
}
