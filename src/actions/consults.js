
import { redTypes } from "../types/reduxTypes";
import { uiStartLoading, uiFinishLoading } from './ui';
import { clientSet } from './client';

// http://189.155.253.90:3000/api/proyects/

export const getProjects = () => {

    const url = 'http://192.168.1.149:3000/api/projects/';

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

    const url = 'http://192.168.1.149:3000/api/customers/';

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

    const url = `http://192.168.1.149:3000/api/lots/on-project/${projectId}`;

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

    const url = `http://192.168.1.149:3000/api/customer/${_id}`;

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