
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getClient, getClients } from '../../actions/consults';
import { useForm } from '../../hooks/useForm';
import { redTypes } from '../../types/reduxTypes';
import { setTempSuccessNotice, uiStartLoading, uiFinishLoading, setTempError } from '../../actions/ui';
import { redirectSet } from '../../actions/redirect';
import { floatingButtonSet } from '../../actions/floatingButton';
import { modalUpdate, modalEnable } from '../../actions/modal';
import { staticURL } from '../../url';
import { projectEnableSvcModal, projectUpdateSvcModal } from '../../actions/project';
import { ModalDoc } from '../ModalDoc';

// floatingButtonSet

export const ClientAddDocuments = () => {

    const { client } = useSelector(state => state);
    const dispatch = useDispatch();
    const { clientId } = useParams();

    const { files, refs, names, patLastname, matLastname } = client;

    const [filesDoc, setFilesDoc] = useState({
        file: null
    })

    const [filesNames, handleInputChange, reset] = useForm({
        fileName: ''
    })

    const { fileName } = filesNames;

    const [fileNames, setFileNames] = useState({});

    const [fileInfo, setFileInfo] = useState({
        fileName: '',
        type: ''
    });

    const types = {
        client: 'client',
        aval: 'aval'
    }

    useEffect(() => {

        dispatch(getClient(clientId));
        dispatch(redirectSet(redTypes.clients, `/clientes/docs/${clientId}`));
        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));

        const tempFileNames = {}

        const tempFileDocs = {}

        refs?.forEach((ref, index) => {
            tempFileNames[`fileName${index}`] = '';
            tempFileDocs[`file${index}`] = '';
        })

        setFileNames(tempFileNames);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch, clientId])

    // FUNCTIONS

    const onFileInput = (e, type) => {
        setFilesDoc(
            { ...filesDoc, [type]: e.target.files[0] }
        )
    }


    const uploadFile = async (file, name, type, refId, inputName, inputFileName) => {

        // uploadFile(filesDoc.avFile, currentFileName, types.aval, ref._id)

        if (type === types.aval) {
            setFileNames({
                ...fileNames,
                [inputName]: ''
            })
        }

        dispatch(uiStartLoading());

        const newForm = new FormData();

        newForm.set('file', file);
        newForm.set('fileName', name);

        const url = `${staticURL}/customer/${clientId}/${type === types.client ? 'file' : `ref/${refId}/file`}`;


        await fetch(url, { // Your POST endpoint
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
                dispatch(setTempSuccessNotice(`Archivo ${name} agregado con éxito`));
            } // Handle the success response object
        ).catch(
            error => {
                console.log(error);
                dispatch(setTempError('Ocurrió un error con el servidor'));
            } // Handle the error response object
        );

        dispatch(uiFinishLoading());
        reset();
        dispatch(getClient(clientId));


        const inputFile = document.querySelector(`[name=${type === types.client ? 'file' : inputFileName}]`);
        inputFile.value = null;
    }


    const handleNext = () => {
        const modalInfo = {
            title: `Terminar registro`,
            text: '¿Desea terminar de subir archivos?',
            link: `/clientes/ver/${clientId}`,
            okMsg: 'Terminar',
            closeMsg: 'Cancelar',
            type: redTypes.clientEdit
        }

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
        dispatch(getClients());
    }

    const handleDeleteFile = (fileName, type, refId) => {

        const modalInfo = {
            title: 'Eliminar documento',
            text: `¿Desea eliminar el documento: ${fileName}?`,
            input: null,
            okMsg: 'Eliminar',
            closeMsg: 'Cancelar',
            refId
        }

        setFileInfo({ fileName, type });


        dispatch(projectUpdateSvcModal(modalInfo));
        dispatch(projectEnableSvcModal());
    }

    const handleFileNameChange = (e) => {

        const tempFileNames = fileNames;

        tempFileNames[e.target.name] = e.target.value;

        setFileNames({
            ...tempFileNames,
            [tempFileNames[e.target.name]]: e.target.value
        });

    }

    return (
        <div className="pb-5 project create">

            <ModalDoc fileName={fileInfo.fileName} type={fileInfo.type} id={client._id} />

            {
                client._id && (
                    <>
                        <div className="project__header">
                            <div className="left">
                                <h3> Subida de documentos </h3>
                            </div>
                        </div>

                        <div className="card-grid mt-4">
                            <div className="card">
                                <div className="card__header">
                                    <img src="../assets/img/user.png" alt="" />
                                    <h4>Información del Cliente</h4>
                                </div>
                                <div className="right">
                                    <div className="card__body__item">
                                        <span>Nombre(s)</span>
                                        <p> {names} </p>
                                    </div>
                                    <div className="card__body__item">
                                        <span>Apellido Paterno</span>
                                        <p> {patLastname} </p>
                                    </div>
                                    {
                                        matLastname && (
                                            <div className="card__body__item">
                                                <span>Apellido materno</span>
                                                <p> {matLastname} </p>
                                            </div>
                                        )
                                    }
                                    <div className="card__body__item">
                                        <span>RFC</span>
                                        <p> {clientId} </p>
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
                                            uploadFile(filesDoc.file, fileName, types.client)
                                        }}  > Subir archivo</button>
                                    </div>

                                    <div className="scroll mt-3">
                                        <div className="card__body__list">
                                            {
                                                files?.map(({ name }) => (
                                                    <div onClick={() => { handleDeleteFile(name, types.client) }} key={name} className="card__body__list__doc">
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



                            {
                                refs.map((ref, index) => {

                                    const currentFileName = fileNames[`fileName${index}`];

                                    return (
                                        <div className="card" key={index}>
                                            <div className="card__header">
                                                <img src="../assets/img/aval.png" alt="" />
                                                <h4>Referencia personal {index + 1}</h4>
                                            </div>
                                            <div className='mt-3' key={ref._id}>
                                                <div className="card__body__item">
                                                    <span>Nombre(s)</span>
                                                    <p> {ref.names} </p>
                                                </div>
                                                <div className="card__body__item">
                                                    <span>Apellido Paterno</span>
                                                    <p> {ref.patLastname} </p>
                                                </div>
                                                {
                                                    ref.matLastname && (
                                                        <div className="card__body__item">
                                                            <span>Apellido materno</span>
                                                            <p> {ref.matLastname} </p>
                                                        </div>
                                                    )
                                                }
                                                <div className="mt-3 card__header">
                                                    <img src="../assets/img/docs.png" alt="" />
                                                    <h4>Documentos Disponibles</h4>
                                                </div>
                                                <input onInput={(e) => {
                                                    onFileInput(e, `file${index}`);
                                                }} type="file" name={`file${index}`} />
                                                <div className="file-form mt-2">
                                                    <div className={`card__body__item`}>
                                                        <label htmlFor={`fileName${index}`}>Nombre del Archivo</label>
                                                        <input type="text" name={`fileName${index}`} onChange={handleFileNameChange} value={currentFileName} />
                                                    </div>
                                                    <button disabled={currentFileName?.length >= 3 && (filesDoc[`file${index}`]) ? false : true} className="upload" onClick={(e) => {
                                                        uploadFile(filesDoc[`file${index}`], currentFileName, types.aval, ref._id, `fileName${index}`, `file${index}`)
                                                    }}  > Subir archivo</button>
                                                </div>

                                                <div className="scroll mt-3">
                                                    <div className="card__body__list">
                                                        {
                                                            ref.files.map(({ name }) => (
                                                                <div onClick={() => { handleDeleteFile(name, types.aval, ref._id) }} key={`${ref._id}-${name}`} className="card__body__list__doc">
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
                                    )
                                })
                            }

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
