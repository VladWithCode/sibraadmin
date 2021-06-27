import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { lotTypesModalConfirmReset } from '../../actions/lotTypes';
import { projectSetPage } from '../../actions/project';

export const Create3 = () => {

    const dispatch = useDispatch();
    const { project: page } = useSelector(state => state)


    const handlePrevPage = () => {
        dispatch(lotTypesModalConfirmReset());
        dispatch(projectSetPage(page - 1));
    }

    const handleNextPage = () => {
        dispatch(projectSetPage(page));

    }

    return (

        <>
            <h1>
                Registro de lotes
            </h1>
            <form className="manzanas">

                <div className="manzanas__card" >
                    <h3>Manzana </h3>
                    <div className={` form-field`}>
                        <label htmlFor={``}>
                            Numero de lotes:
                        </label>
                        <input type="number" name={``} />
                    </div>
                    <div className={`form-field`}>
                        <label htmlFor={``}>
                            Número de lotes tipo:
                        </label>
                        <input type="number" name={``} />
                    </div>

                    <div className={`form-field`}>
                        <label htmlFor={``}>
                            Número de lotes en equinas
                        </label>
                        <input type="number" name={``} />
                    </div>
                </div>

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
