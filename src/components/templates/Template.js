


import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { redirectSet } from '../../actions/redirect';
import { templatesUpdate } from '../../actions/templates';
import { setTempSuccessNotice } from '../../actions/ui';
import { redTypes } from '../../types/reduxTypes';
import { SingleTemplate } from './SingleTemplate';

export const Template = () => {

    const dispatch = useDispatch();

    const { projects, templates: { currentTemplates } } = useSelector(state => state);
    const { projectId } = useParams();

    const [currentTemplate, setCurrentTemplate] = useState(currentTemplates[0]);

    const projectName = projects.find(p => p._id === projectId)?.name;

    useEffect(() => {

        setCurrentTemplate(currentTemplates[0]);
        dispatch(redirectSet(redTypes.templates, `/plantillas/${projectId}`));

    }, [currentTemplates, dispatch, projectId])

    const { templates: { variables } } = useSelector(state => state)

    const handleCopy = ({ target }) => {

        navigator.clipboard.writeText(`%%${target.id.toUpperCase()}%%`);

        dispatch(setTempSuccessNotice(`Variable ${target.id} copiada al porta papeles`))

    }

    const cancel = () => {
        const modalInfo = {
            title: `Cancelar edición`,
            text: `¿Desea cancelar la edición de las pantillas de ${projectName}?`,
            link: `/plantillas`,
            okMsg: 'Sí',
            closeMsg: 'No',
            type: redTypes.templates
        }

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
    }

    return (

        <div className="pb-5 project create template">
            <div className="project__header">
                <div className="left">
                    <h3> {projectName ? `Plantillas de ${projectName}` : 'Plantilas base'} </h3>
                </div>

                <div className="options">

                    {
                        currentTemplates.map((template) => (

                            <>
                                {
                                    currentTemplate?._id === template._id ? (
                                        <>
                                            <input type="radio" id={template.type} name="action" defaultChecked
                                                onClick={() => setCurrentTemplate(template)} />

                                            <label htmlFor={template.type}>
                                                <div className="option">
                                                    {template.type}
                                                </div>
                                            </label>
                                        </>
                                    ) : (
                                        <>
                                            <input type="radio" id={template.type} name="action"
                                                onClick={() => setCurrentTemplate(template)} />

                                            <label htmlFor={template.type}>
                                                <div className="option">
                                                    {template.type}
                                                </div>
                                            </label>
                                        </>
                                    )
                                }
                            </>

                        ))
                    }

                </div>
            </div>

            {
                currentTemplate?.content && (
                    <SingleTemplate template={currentTemplate} />
                )
            }


            <div className="form-buttons">
                <button className="cancel" onClick={cancel} >
                    Cancelar
                </button>
                <button className="next" onClick={() => dispatch(templatesUpdate(currentTemplates))} >
                    Guardar Cambios
                </button>
            </div>

            <div className="card mt-2">
                <div className="card__header">
                    <h3>Todas las variables</h3>
                </div>

                <div className="card__variables">
                    {
                        variables.sort().map(variable => (
                            <p onClick={handleCopy} id={variable} key={variable} >{variable}</p>
                        ))
                    }
                </div>
            </div>


        </div>
    )
}
