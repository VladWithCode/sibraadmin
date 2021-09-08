


import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router';
import { redTypes } from '../../types/reduxTypes';
import { SingleTemplate } from './SingleTemplate';

export const Template = () => {

    const dispatch = useDispatch();

    const { projects, templates: { currentTemplates } } = useSelector(state => state);
    const { projectId } = useParams();

    const [currentTemplate, setCurrentTemplate] = useState(currentTemplates[0]);

    const projectName = projects.find(p => p._id === projectId).name;

    return (

        <div className="pb-5 project create template">
            <div className="project__header">
                <div className="left">
                    <h3> Plantillas de {projectName} </h3>
                </div>

                <div className="options">

                    {
                        currentTemplates.map((template) => (

                            <>
                                {
                                    currentTemplate._id === template._id ? (
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

            <SingleTemplate template={currentTemplate} />

            <div className="form-buttons">
                <button className="cancel" >
                    Cancelar
                </button>
                <button className="next">
                    Guardar Cambios
                </button>
            </div>


        </div>
    )
}
