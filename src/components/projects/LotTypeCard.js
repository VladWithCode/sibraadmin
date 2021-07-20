import React from 'react'
import { useDispatch } from 'react-redux'
import { lotTypesModalConfirmEnable, lotTypesModalConfirmUpdate } from '../../actions/lotTypes';
import { redTypes } from '../../types/reduxTypes';

export const LotTypeCard = ({ type, sameArea, pricePerM, area, front, side }) => {

    const dispatch = useDispatch();

    const openEdit = (type) => {

        const modalInfo = {
            title: 'Editar tipo de lote',
            text: `Desea editar el tipo de lote: "${type.toUpperCase()}" ?`,
            okMsg: 'Editar',
            closeMsg: 'Cancelar',
            action: redTypes.edit,
            type
        }

        dispatch(lotTypesModalConfirmUpdate(modalInfo));
        dispatch(lotTypesModalConfirmEnable());
    }

    const openDelete = (type) => {
        const modalInfo = {
            title: 'Eliminar tipo de lote',
            text: `Desea eliminar el tipo de lote: "${type.toUpperCase()}" ?`,
            okMsg: 'Eliminar',
            closeMsg: 'Cancelar',
            action: redTypes.delete,
            type
        }

        dispatch(lotTypesModalConfirmUpdate(modalInfo));
        dispatch(lotTypesModalConfirmEnable());
    }

    return (

        <div className="card__body__list__lotType">
            <div className="header">
                <h4>Tipo de lote "{type?.toUpperCase()}"</h4>
                <div className="edit-btns">
                    <button onClick={() => openEdit(type)} className="edit">
                        Editar
                    </button>
                    <button onClick={() => openDelete(type)} className="delete">
                        Eliminar
                    </button>
                </div>
            </div>
            <div className="body">
                <div className="body">
                    <div className="card__body__item">
                        <span>
                            Misma área
                        </span>
                        <p>
                            {sameArea ? 'Sí' : 'No'}
                        </p>
                    </div>
                    {
                        area && (
                            <div className="card__body__item">
                                <span>Área</span>
                                <p>{area}m<sup>2</sup> </p>
                            </div>
                        )
                    }


                    {
                        sameArea && (

                            <>
                                <div className="prices">
                                    <div className="card__body__item">
                                        <span>
                                            Precio
                                        </span>
                                        <p>
                                            ${pricePerM}
                                        </p>
                                    </div>
                                    {/* <div className="card__body__item">
                            <span>
                                Esquinas
                            </span>
                            <p>
                                $
                            </p>
                        </div> */}
                                </div>

                                <div className="measures">
                                    <h5>Medidas</h5>

                                    <div className="card__body__item">
                                        <span>
                                            Frente
                                        </span>
                                        <p>
                                            {front}m<sup>2</sup>
                                        </p>
                                    </div>
                                    <div className="card__body__item">
                                        <span>
                                            Fondo
                                        </span>
                                        <p>
                                            {side}m<sup>2</sup>
                                        </p>
                                    </div>

                                </div>
                            </>
                        )

                    }
                </div>


            </div>

        </div>
        // lotTypes.map(({_id, code, pricesPerSqMeter: {corner, regular}, area, measures }) => (
        //     <div key={_id} className="card__body__list__lotType">
        //         <div className="header">
        //             <h4>Tipo de lote "{code}"</h4>
        //         </div>
        //         <div className="body">
        //             {
        //                 area && (
        //                     <div className="card__body__item">
        //                         <span>Área</span>
        //                         <p>{area}m<sup>2</sup> </p>
        //                     </div>
        //                 )
        //             }
        //             <div className="prices">
        //                 <h5>
        //                     Precios por m<sup>2</sup>
        //                 </h5>
        //                 <div className="card__body__item">
        //                     <span>
        //                         Regular
        //                     </span>
        //                     <p>
        //                         ${regular}
        //                     </p>
        //                 </div>
        //                 <div className="card__body__item">
        //                     <span>
        //                         Esquinas
        //                     </span>
        //                     <p>
        //                         ${corner}
        //                     </p>
        //                 </div>
        //             </div>
        //             {
        //                 measures?.length > 0 && (
        //                     <div className="measures">
        //                         <h5>Medidas</h5>
        //                         {
        //                             measures.map((measure) => (
        //                                 <div key={measure._id} className="card__body__item">
        //                                     <span>
        //                                         {measure.title}
        //                                     </span>
        //                                     <p>
        //                                         {measure.value}m<sup>2</sup>
        //                                     </p>
        //                                 </div>
        //                             )
        //                             )
        //                         }
        //                     </div>
        //                 )
        //             }
        //         </div>
        //     </div>
        // ))
    )
}
