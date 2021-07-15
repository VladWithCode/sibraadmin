
import { redTypes } from "../types/reduxTypes";
import { uiStartLoading, uiFinishLoading, setTempSuccessNotice, setTempError, setTempWarning } from './ui';
import { clientSet } from './client';
import { staticURL } from '../url';
import { redirectSet } from './redirect';
import { modalEnable, modalUpdate } from './modal';

// http://189.155.253.90:3000/api/proyects/

export const getProjects = () => {

    const url = `${staticURL}/projects/`;

    console.log('obteniendo proyectos');

    return (dispatch) => {
        dispatch(uiStartLoading());
        fetch(url)
            .then(resp => {
                console.log(resp);
                return resp.json();
            })
            .then(data => {
                dispatch(uiFinishLoading());
                dispatch(loadProjects(data.projects))
            })
            .catch(err => console.log(err))
    }

}

export const getClients = () => {

    const url = `${staticURL}/customers/`;

    console.log('obteniendo clientes');

    return (dispatch) => {
        dispatch(uiStartLoading());
        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                dispatch(uiFinishLoading());
                dispatch(loadClients(data.customers.docs));
            })
            .catch(err => console.log(err))
    }

}

export const getLots = (projectId) => {

    const url = `${staticURL}/lots/on-project/${projectId}`;

    console.log('obteniendo lotes');

    return (dispatch) => {
        dispatch(uiStartLoading());
        fetch(url)
            .then(resp => {
                console.log(resp);
                return resp.json();
            })
            .then(data => {
                dispatch(uiFinishLoading());
                dispatch(loadLots(data.lots))
            })
            .catch(err => console.log(err))
    }

}

export const getClient = _id => {

    const url = `${staticURL}/customer/${_id}`;

    console.log('obteniendo cliente');

    return (dispatch) => {
        dispatch(uiStartLoading());
        fetch(url)
            .then(resp => resp.json())
            .then(data => {
                dispatch(uiFinishLoading());
                dispatch(clientSet(data.customer));

            })
            .catch(err => console.log(err))
    }
}

export const deleteFile = (fileName, type, id) => {

    const url = `${staticURL}/${type === redTypes.project ? 'projects' : 'customers'}/${id}${type === redTypes.aval ? '/aval' : ''}/file`;

    const data = { fileName };


    return (dispatch) => {

        dispatch(uiStartLoading);

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(response => {
                return response.json();
            })
            .then((data) => {
                console.log('data', data);
                dispatch(uiFinishLoading());
                dispatch(setTempSuccessNotice(`Documento ${fileName} eliminado con éxito`));
                type !== redTypes.project && (
                    dispatch(getClient(id))
                )
            })
            .catch(err => {
                console.log(err);
                dispatch(uiFinishLoading());
                dispatch(setTempError('No se pudo eliminar el documento, intente más tarde'));
            });
    }

}

export const deleteClient = (id, name) => {

    const url = `${staticURL}/customers/${id}`;

    return (dispatch) => {

        fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(response => {
                return response.json();
            })
            .then((data) => {
                console.log('data', data);
                dispatch(uiFinishLoading());
                dispatch(redirectSet(redTypes.clients, '/clientes'));
                const modalInfo = {
                    title: `Cliente eliminado con éxito`,
                    text: `Cliente ${name} ha sido eliminado`,
                    link: `/clientes`,
                    okMsg: 'Continuar',
                    closeMsg: null,
                    type: redTypes.clientEdit
                }

                dispatch(modalUpdate(modalInfo));
                dispatch(modalEnable());

            })
            .catch(err => {
                console.log(err);
                dispatch(uiFinishLoading());
                dispatch(setTempError('No se pudo eliminar el documento, intente más tarde'));
            });
    }

}

const loadProjects = (projects) => {
    return {
        type: redTypes.getProjects,
        payload: projects
    }
}

const loadLots = (lots) => {
    return {
        type: redTypes.getLots,
        payload: lots
    }
}

const loadClients = (clients) => {
    return {
        type: redTypes.getClients,
        payload: clients
    }
}