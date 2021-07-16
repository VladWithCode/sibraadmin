
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getClient, getProject, getProjects } from '../../actions/consults';
import { useForm } from '../../hooks/useForm';
import { redTypes } from '../../types/reduxTypes';
import { setTempSuccessNotice, uiStartLoading, uiFinishLoading } from '../../actions/ui';
import { redirectSet } from '../../actions/redirect';
import { floatingButtonSet } from '../../actions/floatingButton';
import { modalUpdate, modalEnable } from '../../actions/modal';
import { staticURL } from '../../url';
import { projectEnableSvcModal, projectUpdateSvcModal } from '../../actions/project';
import { ModalDoc } from '../ModalDoc';

// floatingButtonSet

export const ProjectAddDocuments = () => {

    const { projectEdit: project } = useSelector(state => state);
    const dispatch = useDispatch();
    const { projectId } = useParams();

    const { name, associationName, description, files } = project;

    const [filesDoc, setFilesDoc] = useState({
        file: null,
        avFile: null
    })

    const [filesNames, handleInputChange, reset] = useForm({
        fileName: ''
    })

    const { fileName } = filesNames;

    const [fileInfo, setFileInfo] = useState({
        fileName: '',
        type: ''
    });

    console.log('holi')


    useEffect(() => {

        dispatch(getProject(projectId));
        dispatch(redirectSet(redTypes.projects, `/proyectos/docs/${projectId}`));
        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));

    }, [dispatch, projectId])

    // FUNCTIONS

    const onFileInput = (e, type) => {
        setFilesDoc(
            { ...filesDoc, [type]: e.target.files[0] }
        )
    }


    const uploadFile = async (file, name) => {

        dispatch(uiStartLoading());

        const newForm = new FormData();

        newForm.set('file', file);
        newForm.set('fileName', name);

        const url = `${staticURL}/projects/${projectId}/file`;


        console.log(file);

        const response = await fetch(url, { // Your POST endpoint
            method: 'PUT',
            body: newForm

        }).then(
            response => {
                console.log(response);
                return response.json();
            } // if the response is a JSON object
        ).then(
            success => {
                console.log(success);
                dispatch(uiFinishLoading());
                dispatch(setTempSuccessNotice(`Archivo ${name} agregado con éxito`));
                dispatch(getProject(success.project._id));
            } // Handle the success response object
        ).catch(
            error => {
                console.log(error)
                dispatch(uiFinishLoading());
            } // Handle the error response object

        );

        reset();



        const inputFile = document.querySelector(`[name=file`);
        inputFile.value = null;
    }



    const handleNext = () => {
        const modalInfo = {
            title: `Terminar registro`,
            text: '¿Desea terminar de subir archivos?',
            link: `/proyectos/ver/${projectId}`,
            okMsg: 'Terminar',
            closeMsg: 'Cancelar',
            type: redTypes.projectCreate
        }

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());

    }

    const handleDeleteFile = (fileName, type) => {

        const modalInfo = {
            title: 'Eliminar documento',
            text: `¿Desea eliminar el documento: ${fileName}?`,
            input: null,
            okMsg: 'Eliminar',
            closeMsg: 'Cancelar'
        }

        setFileInfo({ fileName, type });

        dispatch(projectEnableSvcModal());
        dispatch(projectUpdateSvcModal(modalInfo));
    }

    return (
        <div className="pb-5 project create">

            <ModalDoc fileName={fileInfo.fileName} type={fileInfo.type} id={project._id} />

            {
                project._id && (
                    <>
                        <div className="project__header">
                            <div className="left">
                                <h3> Subida de documentos </h3>
                            </div>
                        </div>

                        <div className="card edit mt-4">
                            <div className="card__header">
                                <img src="../assets/img/info.png" alt="" />
                                <h4>Información del Pryecto</h4>
                            </div>
                            <div className="card__body">
                                <div className="right">
                                    <div className="card__body__item">
                                        <span>Nombre del Proyecto</span>
                                        <p> {name} </p>
                                    </div>
                                    <div className="card__body__item">
                                        <span>Asociación</span>
                                        <p> {associationName} </p>
                                    </div>
                                    <div className="card__body__item description">
                                        <span>Descripción del Proyecto</span>
                                        <p> {description} </p>
                                    </div>
                                    <div className="mt-3 card__header">
                                        <img src="../assets/img/docs.png" alt="" />
                                        <h4>Documentos Disponibles</h4>
                                    </div>
                                    <input onInput={(e) => {
                                        onFileInput(e, 'file');
                                    }} type="file" name="file" />
                                    <div className="file-form mt-2">
                                        <div className={`card__body__item`}>
                                            <label htmlFor="fileName">Nombre del Archivo</label>
                                            <input type="text" name="fileName" onChange={handleInputChange} value={fileName} />
                                        </div>
                                        <button disabled={fileName.length >= 3 && (filesDoc.file) ? false : true} className="upload" onClick={(e) => {
                                            uploadFile(filesDoc.file, fileName)
                                        }}  > Subir archivo</button>
                                    </div>

                                    <div className="scroll mt-3">
                                        <div className="card__body__list">
                                            {
                                                files.map(({ name }) => (
                                                    <div onClick={() => { handleDeleteFile(name, redTypes.project) }} key={name} className="card__body__list__doc">
                                                        <p>
                                                            {name}
                                                        </p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                        <div className="form-buttons">
                            <button onClick={handleNext} className="next">
                                Terminar registro
                            </button>
                        </div>
                    </>
                )
            }

        </div>
    )
}
