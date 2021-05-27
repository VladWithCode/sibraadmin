import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { modalDisable } from '../../actions/modal';
import { useForm } from '../../hooks/useForm'

export const ModalInput = () => {

    const [formFields, handleInputChange, reset] = useForm({ docName: '', doc: '' });
    const { docName, doc } = formFields;

    const { active, beenClosed } = useSelector(state => state.modal);

    const dispatch = useDispatch();

    const handleClose = () => {
        dispatch(modalDisable());
    }

    console.log('Soy el modal de UI');


    return (


        <div onClick={handleClose} className={` ${!active ? 'modal-hidden' : 'modal-bc'} ${beenClosed && !active ? 'modal-bc modal-animate-hide' : ''}`} >
            <div className="modal">
                <h3 className="modal__title">
                    Agregar nuevo documento
                </h3>

                <div className="modal__input">
                    <div className="modal__input__field">
                        <span>Nombre del Documento</span>
                        <input type="text" placeholder="Input 1" />
                    </div>
                    <div className="modal__input__field">
                        <span>Nombre del Documento</span>
                        <input type="text" placeholder="Input 1" />
                    </div>

                </div>

                <div className="modal__btns">
                    <p onClick={handleClose} className="modal__btns__link btn btn-err">
                        Cancelar
                    </p>
                    <p className="modal__btns__link btn btn-ok">
                        Agregar
                    </p>
                </div>
            </div>
        </div>


        // <div className={`${!modal.active ? 'modal-hidden' : 'modal-bc'}`}>
        //     <div className="modal">
        //         <h3 className="modal__title">
        //             Nombre de {modal.type === 'svc' ? 'Servicio' : 'Documento'}
        //         </h3>
        //         <form>
        //             <input
        //                 type="text"
        //                 name="docName"
        //                 value={docName}
        //                 onChange={handleInputChange}
        //             />
        //             <div className="modal__btns">
        //                 <button className="modal__btns__link btn-ok">
        //                     Agregar
        //                 </button>
        //                 <p onClick={() => setModal({ ...modal, active: false })} className="modal__btns__link btn-err">
        //                     Cancelar
        //                 </p>
        //             </div>
        //         </form>

        //     </div>
        // </div>
    )
}
