import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { lotTypesCreate, lotTypesEdit, lotTypesModalDisable } from '../../actions/lotTypes';
import { setTempError, unSetError } from '../../actions/ui';
import { useForm } from '../../hooks/useForm';
import { redTypes } from '../../types/reduxTypes';

export const ModalLotType = () => {

    const dispatch = useDispatch();

    const { active, beenClosed, lotTypes, modalConfirm } = useSelector(state => state.types);

    const handleClose = () => {
        dispatch(lotTypesModalDisable());
    }

    const initialForm = {
        type: '',
        sameArea: false,
        pricePerM: '',
        cornerPrice: '',
        area: ''
    }

    const [formValues, handleInputChange, reset, , setValues] = useForm(initialForm);

    const { type, pricePerM, cornerPrice, area } = formValues;

    const [sameArea, setsameArea] = useState(undefined);

    useEffect(() => {
        if (modalConfirm?.action === redTypes.edit) {
            const newValues = lotTypes.find(lot => lot.type === modalConfirm.type)
            setValues(newValues);
            setsameArea(newValues.sameArea);
        } else {
            setValues(initialForm);
            setsameArea(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modalConfirm?.action, modalConfirm?.type, setValues, lotTypes])

    const addLotType = () => {

        if (isFormValid()) {
            const newType = {
                type,
                pricePerM,
                cornerPrice,
                sameArea,
                area: sameArea ? area : undefined
            }

            dispatch(lotTypesCreate(newType));
            dispatch(lotTypesModalDisable());
            reset();
        }

    }

    const updateLotType = () => {
        if (isFormValid()) {
            const newType = {
                newType: type,
                pricePerM,
                cornerPrice,
                sameArea,
                area: sameArea ? area : undefined
            }

            dispatch(lotTypesEdit(modalConfirm.type, newType));
            dispatch(lotTypesModalDisable());
            reset();
        }
    }

    const isFormValid = () => {

        if (type.trim().length === 0) {
            dispatch(setTempError('El tipo de lote debe tener un nombre'));

            return false;
        }

        if (modalConfirm?.action !== redTypes.edit) {
            if (lotTypes?.find(lot => lot.type.toUpperCase() === type.toUpperCase())) {
                dispatch(setTempError(`El tipo "${type}" ya existe, intente otro nombre`));

                return false
            }
        }

        if ((Number(pricePerM) === 0) || (Number(cornerPrice) === 0) || sameArea === undefined) {
            dispatch(setTempError('Todos los campos son obligatorios'));

            return false;
        }

        if (Number(pricePerM) >= Number(cornerPrice)) {
            dispatch(setTempError('El precio en esquinas debe ser mayor'));

            return false;
        }

        if (sameArea) {
            if (area) {
                if (area.toString().trim().length === 0) {
                    dispatch(setTempError('Necesita agregar un área'));

                    return false;
                }
            } else {
                dispatch(setTempError('Necesita agregar un área'));

                return false;
            }
        }



        dispatch(unSetError());
        return true;

    }

    return (
        <div className={` ${!active ? 'modal-hidden' : 'modal-bc'} ${beenClosed && !active ? 'modal-bc modal-animate-hide' : ''}`} >
            <div className="modal">
                <h3 className="modal__title mb-5">
                    {modalConfirm?.action === redTypes.edit ? `Editar tipo de lotes "${modalConfirm.type}"` : 'Nuevo tipo de lotes'}
                </h3>

                <div className="modal__input">
                    <div className="modal__input__field">
                        <span>Nombre de tipo:</span>
                        <input type="text" onChange={handleInputChange} value={type} name="type" />
                    </div>
                    <div className="modal__input__field">
                        <span>Precio por m<sup>2</sup>:</span>
                        <input type="number" onChange={handleInputChange} value={pricePerM} name="pricePerM" />
                    </div>
                    <div className="modal__input__field">
                        <span>Precio por m<sup>2</sup> en esquinas:</span>
                        <input type="number" onChange={handleInputChange} value={cornerPrice} name="cornerPrice" />
                    </div>
                    <div className="modal__input__field mt-3 mb-2">
                        <span>Misma área:</span>
                        <div className="options">
                            {
                                sameArea ? (
                                    <input type="radio" id="yes" name="sameArea" defaultChecked />
                                ) : (
                                    <input type="radio" id="yes" name="sameArea" />
                                )
                            }
                            <label onClick={() => setsameArea(true)} htmlFor="yes">
                                <div className="option">
                                    Sí
                                </div>
                            </label>
                            {
                                sameArea === false ? (
                                    <input type="radio" id="no" name="sameArea" defaultChecked />
                                ) : (
                                    <input type="radio" id="no" name="sameArea" />
                                )
                            }
                            <label onClick={() => setsameArea(false)} htmlFor="no">
                                <div className="option">
                                    No
                                </div>
                            </label>
                        </div>
                    </div>
                    {
                        sameArea &&
                        (
                            <div className="modal__input__field">
                                <span>Área:</span>
                                <input type="number" onChange={handleInputChange} value={area} name="area" />
                            </div>
                        )
                    }

                </div>

                <div className="modal__btns">
                    <p onClick={handleClose} className="modal__btns__link btn btn-err">
                        Cancelar
                    </p>
                    {
                        modalConfirm?.action === redTypes.edit ? (
                            <p onClick={updateLotType} className="modal__btns__link btn btn-ok">
                                Actualizar
                            </p>
                        ) : (
                            <p onClick={addLotType} className="modal__btns__link btn btn-ok">
                                Agregar
                            </p>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
