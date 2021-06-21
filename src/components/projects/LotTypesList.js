import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { lotTypesModalConfirmUpdate, lotTypesModalEnable } from '../../actions/lotTypes';
import { LotTypeCard } from './LotTypeCard';

export const LotTypesList = () => {

    const dispatch = useDispatch();

    const { types: { lotTypes } } = useSelector(state => state);

    const handleOpenAdd = () => {
        dispatch(lotTypesModalConfirmUpdate({action: false}))
        dispatch(lotTypesModalEnable());
    }

    return (
        <div className="lot_types">
            <span onClick={handleOpenAdd} className="add add-svc">
                Agregar tipo
            </span>
            <div className="lot_types_list">
                {
                    lotTypes?.map(({ type, sameArea, pricePerM, cornerPrice, area }) => (
                        <LotTypeCard key={type} type={type} sameArea={sameArea} pricePerM={pricePerM} cornerPrice={cornerPrice} area={area} />
                    ))
                }
            </div>
            
        </div>
    )
}
