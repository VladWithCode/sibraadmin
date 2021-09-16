import React from 'react'
import { useDispatch } from 'react-redux';
import { setTempSuccessNotice } from '../../actions/ui';
import { TextEditor } from './TextEditor';

export const SingleTemplate = ({ template }) => {

    const dispatch = useDispatch();

    const { variables, type } = template;

    const handleCopy = ({ target }) => {

        navigator.clipboard.writeText(`%%${target.id.toUpperCase()}%%`);

        dispatch(setTempSuccessNotice(`Variable ${target.id} copiada al porta papeles`))

    }


    return (
        <>
            <div className="card template">
                <div className="card__header">
                    <img src="../assets/img/docs.png" alt="" />
                    <h4>Contenido de {type}</h4>
                </div>

                <div className="card__body">

                    {/* <div className="paraphs">
                    {
                        paraphs.map((paraph, index) => (
                            <Paraphs key={index + +paraph._id} paraph={paraph} index={index + 1} templateId={_id} />
                        ))
                    }
                </div> */}
                    <div className="paraphs">
                        {
                            template?.content && (
                                <TextEditor template={template} />
                            )
                        }
                    </div>
                    <div className="variables">

                        <h4>Variables de la plantilla</h4>

                        {
                            variables.sort().map(variable => (
                                <p onClick={handleCopy} id={variable.title} >{variable.title}</p>
                            ))
                        }

                    </div>



                </div>



            </div>


        </>
    )
}
