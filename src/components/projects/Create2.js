import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { lotTypesModalConfirmReset } from '../../actions/lotTypes';
import { manzanasSet } from '../../actions/manzanas';
import { projectSetPage } from '../../actions/project';
import { setTempError, unSetError } from '../../actions/ui';

export const Create2 = () => {

    const { project, project: { lots, page }, types: { lotTypes } } = useSelector(state => state);

    const dispatch = useDispatch();

    const handlePrevPage = () => {
        dispatch(lotTypesModalConfirmReset());
        dispatch(projectSetPage(page - 1));
    }

    const [manzanas, setManzanas] = useState([]);
    const [formValues, setFormValues] = useState([]);
    const [error, setError] = useState(null);
    const [typesErrors, setTypesErrors] = useState([]);
    const [cornersErrors, setCornersErrors] = useState([]);

    const state = useSelector(state => state);

    useEffect(() => {

        if ((+project.manzanas === state.manzanas.length) && (state.manzanas.length >= 1)) {
            setFormValues([...state.manzanas]);
            setManzanas([...state.manzanas]);

            dispatch(manzanasSet([...state.manzanas]));

            const typesErrors = state.manzanas.map(manzana => ({
                manzana: manzana.num,
                error: false
            }));

            const cornersErrors = state.manzanas.map(manzana => ({
                manzana: manzana.num,
                error: false
            }));

            let counter = 0;
            let counterTypes = 0;

            state.manzanas.forEach((manzana) => {
                counter += Number(manzana.lots)
                manzana.lotTypes.forEach(lotType => {
                    counterTypes += lotType.quantity;
                })


                if (+manzana.corners > +manzana.lots) {
                    setCornersErrors(
                        cornersErrors.map(cornerError => {
                            if (cornerError.manzana === manzana.num) {
                                cornerError.error = true;
                            }
                            return cornerError;
                        })
                    )
                } else {
                    setCornersErrors(
                        cornersErrors.map(cornerError => {
                            if (cornerError?.manzana === manzana.num) {
                                cornerError.error = false
                            }
                            return cornerError;
                        })
                    )
                }
                

                if (+counterTypes > +manzana.lots) {
                    setTypesErrors(
                        typesErrors.map(typeError => {
                            if (typeError?.manzana === manzana.num) {
                                typeError.error = true
                            }
                            return typeError;
                        })
                    )
                } else {
                    setTypesErrors(
                        typesErrors.map(typeError => {
                            if (typeError?.manzana === manzana.num) {
                                typeError.error = false
                            }
                            return typeError;
                        })
                    )
                }

                counterTypes = 0;
            })

            if (counter > lots) {
                setError(`Has excedido el número de lotes (${lots} lotes)`);
            }

        } else {

            const newArr = [];
            for (let i = 1; i <= project.manzanas; i++) {
                newArr.push((
                    {
                        num: i,
                        lots: '',
                        lotTypes: lotTypes.map(lotType => ({ ...lotType, quantity: '' })),
                        corners: '',
                        lotsErr: null
                    }
                ))
            }
            setFormValues(newArr);
            setManzanas(newArr);

            dispatch(manzanasSet(newArr));

            setTypesErrors(newArr.map(manzana => ({
                manzana: manzana.num,
                error: false
            })));

            setCornersErrors(newArr.map(manzana => ({
                manzana: manzana.num,
                error: false
            })));
        }



        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, lots, project.manzanas, lotTypes]);

    const handleLotsChange = ({ value }, num) => {

        let counter = 0;
        let counterTypes = 0;

        setFormValues(
            formValues.map((manzana) => {

                manzana.lotTypes.forEach(lotType => {
                    counterTypes += +lotType.quantity
                })

                if (manzana.num === num) {
                    manzana.lots = value;
                }

                counter += Number(manzana.lots)
                return manzana;
            })
        )


        if (counter > lots) {
            setError(true);
            dispatch(setTempError(`Has excedido el número de lotes (${+lots} lotes)`))
        } else {
            setError(false);
            dispatch(unSetError());
        }

        dispatch(manzanasSet(formValues));

        if (counterTypes > counter) {
            setTypesErrors(
                typesErrors.map(typeError => {
                    if (typeError?.manzana === num) {
                        typeError.error = true
                    }
                    return typeError;
                })
            )
            dispatch(setTempError(`Has excedido el número de lotes de la manzana ${num} (${counter} lotes)`))
        } else {
            setTypesErrors(
                typesErrors.map(typeError => {
                    if (typeError?.manzana === num) {
                        typeError.error = false
                    }
                    return typeError;
                })
            )
        }

    }

    const handlelotTypeChange = ({ value }, type, num) => {

        let counter = 0;
        let currentLots;

        setFormValues(
            formValues.map((manzana) => {
                if (manzana.num === num) {

                    currentLots = manzana.lots;

                    manzana.lotTypes.map(lotType => {

                        if (lotType.type === type) {
                            lotType.quantity = value
                        }

                        counter += +lotType.quantity
                        return lotType;
                    })
                }
                return manzana;

            })
        );


        if (counter > currentLots) {
            setTypesErrors(
                typesErrors.map(typeError => {
                    if (typeError?.manzana === num) {
                        typeError.error = true
                    }
                    return typeError;
                })
            )
            dispatch(setTempError(`Has excedido el número de lotes de la manzana ${num} (${currentLots} lotes)`))
        } else {
            setTypesErrors(
                typesErrors.map(typeError => {
                    if (typeError?.manzana === num) {
                        typeError.error = false
                    }
                    return typeError;
                })
            )
            dispatch(unSetError());
        }


        dispatch(manzanasSet(formValues));

    }

    const isFormValid = () => {

        if (error) {
            return false;
        }

        if (typesErrors.find(({ error }) => error)) {
            return false;
        }

        let counter = 0;

        formValues.forEach(manzana => counter+= Number(manzana.lots));

        if(counter !== +lots){
            dispatch(setTempError(`Faltan ${Number(lots) - +counter} lotes por registrar`))
            return 'error';
        }

        return true;

    }

    const handleNextPage = () => {
        if (isFormValid()) {
            if (isFormValid() !== 'error') {
                dispatch(projectSetPage(page + 1));
            }
        } else {
            dispatch(setTempError('Debe llenar todos los campos y no tener errores'))
        }
    }



    const handleCornerChange = ({ value }, num) => {

        let counter = 0;
        let currentManzana;

        setFormValues(
            formValues.map((manzana) => {

                if (manzana.num === num) {
                    manzana.corners = value;
                    currentManzana = manzana;
                }

                counter += Number(manzana.corners)
                return manzana;
            })
        )

        if (counter > currentManzana.lots) {
            setCornersErrors(
                cornersErrors.map(cornerError => {
                    if (cornerError.manzana === num) {
                        cornerError.error = true;
                    }
                    return cornerError;
                })
            )
            dispatch(setTempError(`No puede haber más esquinas que lotes (${+currentManzana.lots} lotes)`))
        } else {
            setCornersErrors(
                cornersErrors.map(cornerError => {
                    if (cornerError.manzana === num) {
                        cornerError.error = false;
                    }
                    return cornerError;
                })
            )
            dispatch(unSetError());
        }

        dispatch(manzanasSet(formValues));
    }



    return (

        <>
            <h1>
                Registro de manzanas
            </h1>
            <form className="manzanas">
                {
                    manzanas.map(({ num, lots, corners }, index) => (
                        <div className="manzanas__card" key={num}>
                            <h3>Manzana {num}</h3>
                            <div className={`${error && 'error'} form-field`}>
                                <label htmlFor={`manzana${num}-lots`}>
                                    Numero de lotes:
                                </label>
                                <input onChange={(e) => {
                                    handleLotsChange(e.target, num)
                                }} type="number" name={`manzana${num}-lots`} value={lots} />
                            </div>
                            {
                                manzanas[0].lotTypes?.length > 1 && (
                                    manzanas[index].lotTypes.map(({ type, quantity }, index) => (
                                        <div key={type} className={`${typesErrors?.find(typeError => typeError.manzana === num)?.error && 'error'} form-field`}>
                                            <label htmlFor={`manzana${num}-type-${type}`}>
                                                Número de lotes tipo "{type.toUpperCase()}":
                                            </label>
                                            <input onChange={(e) => handlelotTypeChange(e.target, type, num, index)} type="number" name={`manzana${num}-type-${type}`} value={quantity} />
                                        </div>
                                    ))
                                )
                            }
                            <div className={`${cornersErrors?.find(cornerError => cornerError.manzana === num)?.error && 'error'} form-field`}>
                                <label htmlFor={`manzana${num}-corners`}>
                                    Número de lotes en equinas
                                </label>
                                <input onChange={(e) => handleCornerChange(e.target, num)} type="number" name={`manzana${num}-corners`} value={corners} />
                            </div>
                        </div>
                    ))
                }
            </form>


            <div className="project-create-btns">
                <button onClick={handlePrevPage} className="btn btn-cancel">
                    Anterior
                </button>
                <button onClick={handleNextPage} className="btn btn-next">
                    Siguiente
                </button>
            </div>

        </>

    )
}
