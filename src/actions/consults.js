import { redTypes } from '../types/reduxTypes';
import {
  uiStartLoading,
  uiFinishLoading,
  setTempSuccessNotice,
  setTempError,
} from './ui';
import { clientSet } from './client';
import { staticURL } from '../url';
import { redirectSet } from './redirect';
import { modalEnable, modalUpdate } from './modal';
import { projectSet } from './project';
import makeServerRequest from '../helpers/makeServerRequest';

export const getProjects = () => {
  const url = `${staticURL}/projects/`;

  return dispatch => {
    dispatch(uiStartLoading());
    fetch(url)
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        dispatch(uiFinishLoading());
        dispatch(loadProjects(data.projects ? data.projects : []));
      })
      .catch(err => console.log(err));
  };
};

export const getProject = id => {
  const url = `${staticURL}/projects/${id}`;

  return dispatch => {
    dispatch(uiStartLoading());
    fetch(url)
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        dispatch(uiFinishLoading());
        dispatch(projectSet(data.project));
      })
      .catch(err => console.log(err));
  };
};

export const getClients = () => {
  const url = `${staticURL}/customers/`;

  return dispatch => {
    dispatch(uiStartLoading());
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        dispatch(uiFinishLoading());
        dispatch(loadClients(data.customers));
      })
      .catch(err => console.log(err));
  };
};

export const createClient = data => {
  const url = `${staticURL}/customers/`;

  return dispatch => {
    dispatch(uiStartLoading());
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(res => res.json())
      .then(({ status, customer, error }) => {
        if (status !== 'OK' || !customer) return;

        dispatch(uiFinishLoading());

        return customer;
      });
  };
};

export const getLots = projectId => {
  const url = `${staticURL}/lots/on-project/${projectId}`;

  return dispatch => {
    dispatch(uiStartLoading());
    fetch(url)
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        dispatch(uiFinishLoading());
        dispatch(loadLots(data.lots));
      })
      .catch(err => console.log(err));
  };
};

export const getClient = _id => {
  const url = `${staticURL}/customer/${_id}`;

  return dispatch => {
    dispatch(uiStartLoading());
    fetch(url)
      .then(resp => resp.json())
      .then(data => {
        dispatch(uiFinishLoading());
        dispatch(clientSet(data.customer));
      })
      .catch(err => console.log(err));
  };
};

export const deleteFile = (fileName, type, id, refId, projectId) => {
  const url = `${staticURL}/${
    type === redTypes.project
      ? 'projects'
      : type === redTypes.lot
      ? 'lots'
      : 'customers'
  }/${id}${type === redTypes.aval ? `/ref/${refId}` : ''}/file`;

  const data = { fileName };

  return dispatch => {
    dispatch(uiStartLoading());

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        dispatch(uiFinishLoading());
        dispatch(
          setTempSuccessNotice(`Documento ${fileName} eliminado con éxito`)
        );
        type !== redTypes.project
          ? dispatch(getClient(id))
          : dispatch(getProject(id));

        if (projectId) {
          fetch(`${staticURL}/lots/${id}`)
            .then(response => response.json())
            .then(data => {
              data.lot && dispatch(setLot(data.lot));
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(uiFinishLoading());
        dispatch(
          setTempError('No se pudo eliminar el documento, intente más tarde')
        );
      });
  };
};

export const deleteClient = (id, name) => {
  const url = `${staticURL}/customers/${id}`;

  return dispatch => {
    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        dispatch(uiFinishLoading());
        dispatch(redirectSet(redTypes.clients, '/clientes'));
        const modalInfo = {
          title: `Cliente eliminado con éxito`,
          text: `Cliente ${name} ha sido eliminado`,
          link: `/clientes`,
          okMsg: 'Continuar',
          closeMsg: null,
          type: redTypes.clientEdit,
        };

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
      })
      .catch(err => {
        console.log(err);
        dispatch(uiFinishLoading());
        dispatch(
          setTempError('No se pudo eliminar el documento, intente más tarde')
        );
      });
  };
};

export const getRecords = () => {
  return async dispatch => {
    dispatch(uiStartLoading());

    const res = await makeServerRequest('/record');
    dispatch(uiFinishLoading());
    if (res.status !== 'OK') return null;
    return dispatch(loadRecords(res.records));
  };
};

export const getRecord = id => {
  return dispatch => {
    dispatch(uiStartLoading());
    fetch(staticURL + '/record/' + id)
      .then(res => res.json())
      .then(data => {
        dispatch(uiFinishLoading());

        if (data.status !== 'OK') {
          return dispatch(
            setTempError(
              data.message || 'Ocurrio un error al recuperar el expediente'
            )
          );
        }

        return dispatch(loadRecord(data.record));
      });
  };
};

const loadRecord = record => ({
  type: redTypes.recordsSet,
  payload: record,
});

const loadRecords = records => ({
  type: redTypes.recordsSet,
  payload: records,
});

const loadProjects = projects => {
  return {
    type: redTypes.getProjects,
    payload: projects,
  };
};

export const loadLots = lots => {
  return {
    type: redTypes.getLots,
    payload: lots,
  };
};

export const setLot = lot => {
  return {
    type: redTypes.setLot,
    payload: lot,
  };
};

const loadClients = clients => {
  return {
    type: redTypes.getClients,
    payload: clients,
  };
};
