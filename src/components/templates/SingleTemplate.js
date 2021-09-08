import React, { useState } from 'react'
import { useDispatch } from 'react-redux';
import { templatesAddParaph } from '../../actions/templates';
import { setTempSuccessNotice } from '../../actions/ui';
import { Paraphs } from './Paraphs';

export const SingleTemplate = ({ template }) => {

    const dispatch = useDispatch();

    const { variables, paraphs, signatures, _id, type } = template;

    const handleCopy = ({ target }) => {

        navigator.clipboard.writeText(`%%${target.id.toUpperCase()}%%`);

        dispatch(setTempSuccessNotice(`Variable ${target.id} copiada al porta papeles`))

    }

    return (
        <div className="card template">
            <div className="card__header">
                <img src="../assets/img/docs.png" alt="" />
                <h4>Párrafos de {type}</h4>
            </div>

            <div className="card__body">

                <div className="paraphs">
                    {
                        paraphs.map((paraph, index) => (
                            <Paraphs key={index + +paraph._id} paraph={paraph} index={index + 1} templateId={_id} />
                        ))
                    }
                </div>
                <div className="variables">
                    <button
                        onClick={() => dispatch(templatesAddParaph(_id))}
                        className="add-par ok">
                        Agregar párrafo
                    </button>

                    <h4>Variables Disponibles</h4>

                    {
                        variables.map(variable => (
                            <p onClick={handleCopy} id={variable.title} >{variable.title}</p>
                        ))
                    }

                </div>

            </div>



        </div>
    )
}
