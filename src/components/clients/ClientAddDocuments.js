
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getClient } from '../../actions/consults';
import { useForm } from '../../hooks/useForm';
import { redTypes } from '../../types/reduxTypes';
import { setTempSuccessNotice, uiStartLoading, uiFinishLoading } from '../../actions/ui';
import { redirectSet } from '../../actions/redirect';
import { floatingButtonSet } from '../../actions/floatingButton';
import { modalUpdate, modalEnable } from '../../actions/modal';
// floatingButtonSet

export const ClientAddDocuments = () => {

    const { client } = useSelector(state => state);
    const dispatch = useDispatch();
    const { clientId } = useParams();

    const { files, aval, names, patLastname, matLastname } = client;

    const [filesDoc, setFilesDoc] = useState({
        file: null,
        avFile: null
    })

    const [filesNames, handleInputChange, reset] = useForm({
        fileName: '',
        avFileName: ''
    })

    const { fileName, avFileName } = filesNames;

    const types = {
        client: 'client',
        aval: 'aval'
    }

    useEffect(() => {

        dispatch(getClient(clientId));
        dispatch(redirectSet(redTypes.clients, `/clientes/docs/${clientId}`));
        dispatch(floatingButtonSet('pencil', redTypes.projectCreate));

    }, [dispatch, clientId])

    // FUNCTIONS

    const onFileInput = (e, type) => {
        setFilesDoc(
            { ...filesDoc, [type]: e.target.files[0] }
        )
    }


    const uploadFile = async (file, name, type) => {

        dispatch(uiStartLoading());

        const newForm = new FormData();

        newForm.set('file', file);
        newForm.set('fileName', name);

        console.log(newForm);

        const url = `http://192.168.1.66:3000/api/customer/${clientId}/${type === types.client ? 'file' : 'aval/file'}`;


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
                dispatch(uiFinishLoading());
                dispatch(setTempSuccessNotice(`Archivo ${name} agregado con éxito`));
            } // Handle the success response object
        ).catch(
            error => console.log(error) // Handle the error response object
        );

        reset();
        dispatch(getClient(clientId));


        const inputFile = document.querySelector(`[name=${type === types.client ? 'file' : 'avFile'}]`);
        inputFile.value = null;
    }

    const handleOpen = (path) => {
        const url = `http://192.168.1.66:3000${path}`;

        window.open(url, "_blank", 'top=500,left=200,frame=false,nodeIntegration=no');
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
    }

    return (
        <div className="pb-5 project create">

            {
                client._id && (
                    <>
                        <div className="project__header">
                            <div className="left">
                                <h3> Subida de documentos </h3>
                            </div>
                        </div>

                        <div className="card edit mt-4">
                            <div className="card__header">
                                <img src="/../assets/img/user.png" alt="" />
                                <h4>Información del Cliente</h4>
                            </div>
                            <div className="card__body">
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
                                        <img src="/../assets/img/docs.png" alt="" />
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
                                                files.map(({ name, staticPath }) => (
                                                    <div onClick={() => { handleOpen(staticPath) }} key={name} className="card__body__list__doc">
                                                        <p>
                                                            {name}
                                                        </p>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    </div>

                                </div>
                                <div className="left">
                                    <div className="card__header">
                                        <img src="/../assets/img/aval.png" alt="" />
                                        <h4>Información del Aval</h4>
                                    </div>
                                    <div className="card__body__item">
                                        <span>Nombre(s)</span>
                                        <p> {aval.names} </p>
                                    </div>
                                    <div className="card__body__item">
                                        <span>Apellido Paterno</span>
                                        <p> {aval.patLastname} </p>
                                    </div>
                                    {
                                        aval.matLastname && (
                                            <div className="card__body__item">
                                                <span>Apellido materno</span>
                                                <p> {aval.matLastname} </p>
                                            </div>
                                        )
                                    }
                                    <div className="mt-3 card__header">
                                        <img src="/../assets/img/docs.png" alt="" />
                                        <h4>Documentos Disponibles</h4>
                                    </div>
                                    <input onInput={(e) => {
                                        onFileInput(e, 'avFile');
                                    }} type="file" name="avFile" />
                                    <div className="file-form mt-2">
                                        <div className={`card__body__item`}>
                                            <label htmlFor="avFileName">Nombre del Archivo</label>
                                            <input type="text" name="avFileName" onChange={handleInputChange} value={avFileName} />
                                        </div>
                                        <button disabled={avFileName.length >= 3 && (filesDoc.avFile) ? false : true} className="upload" onClick={(e) => {
                                            uploadFile(filesDoc.avFile, avFileName, types.aval)
                                        }}  > Subir archivo</button>
                                    </div>

                                    <div className="scroll mt-3">
                                        <div className="card__body__list">
                                            {
                                                aval.files.map(({ name, staticPath }) => (
                                                    <div onClick={() => { handleOpen(staticPath) }} key={name} className="card__body__list__doc">
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
