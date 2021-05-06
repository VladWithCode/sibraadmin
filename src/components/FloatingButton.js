import React, { useContext, useEffect } from 'react';
import { AppContext } from '../AppContext';
import { ModalConfirm } from './ModalConfirm';

export const FloatingButton = ({type}) => {

    const { appData, appData:{modalActive}, setAppData } = useContext(AppContext);

    useEffect(() => {
        
        setAppData({...appData, modalType: type});
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const icon = type;

    console.log(icon);

    return (

        <>
            <div className="floating-btn" onClick={() => setAppData({...appData, modalActive: !modalActive})} >
                <svg><use href="/../assets/svg/plus.svg#plus" ></use></svg>
            </div>

            <ModalConfirm />            
        </>

    )
}
