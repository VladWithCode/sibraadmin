import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { redirectSet } from '../../actions/redirect';
import { useForm } from '../../hooks/useForm';
import { redTypes } from '../../types/reduxTypes';
import { floatingButtonSet } from '../../actions/floatingButton';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { setLot } from '../../actions/consults';
import {
  setTempError,
  uiStartLoading,
  uiFinishLoading,
  setTempSuccessNotice,
} from '../../actions/ui';
import { staticURL } from '../../url';
import { getLots } from '../../actions/consults';
import { ModalDoc } from '../ModalDoc';
import {
  projectEnableSvcModal,
  projectUpdateSvcModal,
} from '../../actions/project';
import { Bindings } from './Bindings';

export const LotEdit = () => {
  const dispatch = useDispatch();
  const { lotId, projectId } = useParams();
  const { lots, projects, lot } = useSelector(state => state);

  const currentLot = lot ? lot : lots.find(lot => lot._id === lotId);
  const currentProject = projects.find(p => p._id === projectId);

  const { lotNumber, manzana } = currentLot;
  const { name: projectName } = currentProject;
  const { files, bindings } = lot;

  const [emptyFields, setEmptyFields] = useState([]);
  const [hasChanged, setHasChanged] = useState([]);
  const [measures, setMeasures] = useState(lot.measures);

  const [filesDoc, setFilesDoc] = useState({
    file: null,
  });

  const [fileInfo, setFileInfo] = useState({
    fileName: '',
  });

  const [filesNames, handleInputFileChange, reset] = useForm({
    fileName: '',
  });

  const { fileName } = filesNames;

  const [formFields, handleInputChange] = useForm({
    area: lot.area,
    price: lot.price,
  });

  const { area, price } = formFields;

  useEffect(() => {
    dispatch(
      redirectSet(
        redTypes.projects,
        `/proyectos/edit/${projectId}/lote/${lotId}`
      )
    );
    dispatch(floatingButtonSet('pencil', redTypes.projectCreate));

    for (let key in formFields) {
      checkChanges(key, formFields[key]);
    }
    checkEmptyFields();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, projectId, lotId]);

  const checkEmptyFields = () => {
    const tempEmptyFields = [];

    for (let key in formFields) {
      if (formFields[key].toString().trim() === '') {
        tempEmptyFields.push(key);
        dispatch(setTempError('Todos los campos son obligatorios'));
      }
    }

    measures.forEach((measure, index) => {
      for (let key in measure) {
        if (measure[key].toString().trim() === '') {
          tempEmptyFields.push(`measure-${key}${index}`);
          dispatch(setTempError('Todos los campos son obligatorios'));
        }
      }
    });

    setEmptyFields(tempEmptyFields);

    return tempEmptyFields.length === 0 ? false : true;
  };

  const cancel = () => {
    const modalInfo = {
      title: 'Cancelar edición',
      text: '¿Desea cancelar la edición del lote?',
      link: `/proyectos/ver/${projectId}/lote/${lotId}`,
      okMsg: 'Sí',
      closeMsg: 'No',
      type: redTypes.projectCreate,
    };

    dispatch(modalUpdate(modalInfo));
    dispatch(modalEnable());
  };

  const addRef = () => {
    const newMeasure = {
      title: '',
      value: '',
    };

    setMeasures([...measures, newMeasure]);

    dispatch(
      setLot({
        ...currentLot,
        measures: [...measures, newMeasure],
      })
    );
  };

  const deleteMeasure = index => {
    measures.splice(index, 1);
    setMeasures(measures);

    dispatch(
      setLot({
        ...currentLot,
        measures: [...measures],
      })
    );
  };

  const checkEmptyField = e => {
    const tempEmptyFields = emptyFields;

    if (e.target.value?.trim().length > 0) {
      if (tempEmptyFields.includes(e.target.name)) {
        const index = tempEmptyFields.indexOf(e.target.name);

        tempEmptyFields.splice(index, 1);
      }
    } else {
      if (!tempEmptyFields.includes(e.target.name)) {
        tempEmptyFields.push(e.target.name);
      }
    }

    setEmptyFields(tempEmptyFields);
  };

  const handleChange = e => {
    handleInputChange(e);
    checkEmptyField(e);
    checkChanges(e.target.name, e.target.value);

    dispatch(
      setLot({
        ...lot,
        [e.target.name]: e.target.value,
      })
    );
  };

  const checkChanges = (attribute, value) => {
    const tempHasChanged = hasChanged;

    if (value.toString() === currentLot[attribute].toString()) {
      if (tempHasChanged.includes(attribute)) {
        const index = tempHasChanged.indexOf(attribute);

        tempHasChanged.splice(index, 1);
      }
    } else {
      if (!tempHasChanged.includes(attribute)) {
        tempHasChanged.push(attribute);
      }
    }

    setHasChanged(tempHasChanged);

    dispatch(setLot({ ...lot, ...formFields, [attribute]: value }));
  };

  const handleChangeMeasure = (index, e, key) => {
    checkEmptyField(e);

    const tempMeasuresArr = measures;

    tempMeasuresArr[index][key] = e.target.value;

    setMeasures(tempMeasuresArr);
    dispatch(setLot({ ...lot, ...formFields, measures: tempMeasuresArr }));
  };

  const handleSave = async () => {
    if (isFormValid()) {
      dispatch(uiStartLoading());

      const data = {
        area: +area,
        price: +price,
        measures: measures.map(m => ({
          title: m.title,
          value: +m.value,
        })),
        bindings,
      };

      const url = `${staticURL}/lot/${lot._id}`;

      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doc: data,
        }),
      })
        .then(res => res.json())
        .then(data => data)
        .catch(err => {
          console.log(err);
          return err;
        });

      dispatch(uiFinishLoading());

      if (res.status !== 'OK') {
        console.log(res);
        dispatch(
          setTempError(res.message || 'Hubo un error al actualizar el lote')
        );
        return;
      }

      const modalInfo = {
        title: 'Lote actualizado',
        text: 'Se ha actualizado con éxito',
        link: `/proyectos/ver/${projectId}/lote/${lotId}`,
        okMsg: 'Continuar',
        closeMsg: null,
        type: redTypes.projectCreate,
      };

      dispatch(modalUpdate(modalInfo));
      dispatch(modalEnable());
      dispatch(getLots(projectId));
    }
  };

  const isFormValid = () => {
    checkEmptyFields();

    for (const binding of bindings) {
      if (binding.length === 0) {
        dispatch(setTempError('No puede haber colindancias vacías'));
        return false;
      }
    }

    if (emptyFields.length > 0) {
      return false;
    }

    if (checkEmptyFields()) {
      return false;
    }

    return true;
  };

  const onFileInput = (e, type) => {
    setFilesDoc({ ...filesDoc, [type]: e.target.files[0] });
  };

  const uploadFile = async (file, name) => {
    dispatch(uiStartLoading());

    const newForm = new FormData();

    newForm.set('file', file);
    newForm.set('fileName', name);

    const url = `${staticURL}/lots/${lotId}/file`;

    await fetch(url, {
      // Your POST endpoint
      method: 'PUT',
      body: newForm,
    })
      .then(res => res.json())
      .then(data => {
        dispatch(uiFinishLoading());
        dispatch(setTempSuccessNotice(`Archivo ${name} agregado con éxito`));

        dispatch(uiStartLoading());
        fetch(`${staticURL}/lots/${lotId}`)
          .then(res => res.json())
          .then(data => {
            dispatch(uiFinishLoading());
            dispatch(setLot(data.lot));
          })
          .catch(err => console.log(err));
      })
      .catch(
        error => {
          console.log(error);
          dispatch(setTempError('No se pudo subir el archivo'));
          dispatch(uiFinishLoading());
        } // Handle the error response object
      );

    reset();

    const inputFile = document.querySelector(`[name=file]`);
    inputFile.value = null;
  };

  const handleDeleteFile = fileName => {
    const modalInfo = {
      title: 'Eliminar documento',
      text: `¿Desea eliminar el documento: ${fileName}?`,
      input: null,
      okMsg: 'Eliminar',
      closeMsg: 'Cancelar',
    };

    setFileInfo({ fileName });

    dispatch(projectEnableSvcModal());
    dispatch(projectUpdateSvcModal(modalInfo));
  };

  return (
    <div className='pb-5 project create'>
      <ModalDoc
        fileName={fileInfo.fileName}
        type={redTypes.lot}
        id={lotId}
        projectId={projectId}
      />

      <div className='project__header'>
        <div className='left'>
          <h3> Edición del Lote </h3>
        </div>
        {/* <div className="right">
                    <button className="cancel">
                        Eliminar Lote
                    </button>
                </div> */}
      </div>

      <div className='card edit'>
        <div className='card__header'>
          <img src='../assets/img/lots.png' alt='' />
          <h4>Información del Lote</h4>
        </div>
        <div className='card__body'>
          <div className='right'>
            <div className='card__body__item'>
              <span>Proyecto</span>
              <p> {projectName} </p>
            </div>
            <div className='card__body__item'>
              <span>Número de Lote</span>
              <p> {lotNumber} </p>
            </div>
            <div className='card__body__item'>
              <span>Número de Manzana</span>
              <p> {manzana} </p>
            </div>
            <div
              className={`card__body__item ${
                emptyFields.includes('area') && 'error'
              } mt-5`}>
              <label htmlFor='area'>Área</label>
              <input
                onChange={handleChange}
                className={`${hasChanged.includes('area') && 'changed'}`}
                name='area'
                type='number'
                autoComplete='off'
                value={area}
              />
            </div>
            <div
              className={`card__body__item ${
                emptyFields.includes('price') && 'error'
              }`}>
              <label htmlFor='price'>Precio</label>
              <input
                onChange={handleChange}
                className={`${hasChanged.includes('price') && 'changed'}`}
                autoFocus
                name='price'
                type='number'
                autoComplete='off'
                value={price}
              />
            </div>
          </div>
          <div className='left'>
            <div className='card__header'>
              <img src='../assets/img/info.png' alt='' />
              <h4>Medidas</h4>

              <button onClick={addRef} className='add-ref'>
                Agregar medida
              </button>
            </div>
            {measures.length > 0 &&
              measures.map((measure, index) => (
                <div key={`measure${index}`}>
                  <div
                    className={`card__body__item ${
                      emptyFields.includes(`measure-title${index}`) && 'error'
                    } mt-3`}>
                    <button
                      onClick={e => deleteMeasure(index)}
                      className='delete-area measure'>
                      &times;
                    </button>
                    <label htmlFor={`measure-title${index}`}>
                      Nombre de medida
                    </label>
                    <input
                      onChange={e => handleChangeMeasure(index, e, `title`)}
                      className={`${
                        hasChanged.includes(`measure-title${index}`) &&
                        'changed'
                      }`}
                      name={`measure-title${index}`}
                      type='text'
                      autoComplete='off'
                      value={measure.title}
                    />
                  </div>
                  <div
                    key={measure._id}
                    className={`card__body__item ${
                      emptyFields.includes(`measure-value${index}`) && 'error'
                    }`}>
                    <label htmlFor={`measure-value${index}`}>
                      Medida en m<sup>2</sup>{' '}
                    </label>
                    <input
                      onChange={e => handleChangeMeasure(index, e, 'value')}
                      className={`${
                        hasChanged.includes(`measure-value${index}`) &&
                        'changed'
                      }`}
                      name={`measure-value${index}`}
                      type='text'
                      autoComplete='off'
                      value={measure.value}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className='card-grid mt-2'>
        <div className='card edit'>
          <div className='card__body'>
            <div className='full'>
              <div className=' card__header'>
                <img src='../assets/img/docs.png' alt='' />
                <h4>Documentos Disponibles</h4>
              </div>
              <input
                onInput={e => {
                  onFileInput(e, 'file');
                }}
                type='file'
                name='file'
              />
              <div className='file-form mt-2'>
                <div className={`card__body__item`}>
                  <label htmlFor='fileName'>Nombre del Archivo</label>
                  <input
                    type='text'
                    name='fileName'
                    onChange={handleInputFileChange}
                    value={fileName}
                  />
                </div>
                <button
                  disabled={
                    fileName.length >= 3 && filesDoc.file ? false : true
                  }
                  className='upload'
                  onClick={e => {
                    uploadFile(filesDoc.file, fileName);
                  }}>
                  Subir archivo
                </button>
              </div>

              <div className='scroll mt-3'>
                <div className='card__body__list'>
                  {files.map(({ name }) => (
                    <div
                      onClick={() => {
                        handleDeleteFile(name, redTypes.project);
                      }}
                      key={name}
                      className='card__body__list__doc'>
                      <p>{name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {bindings && <Bindings bindings={bindings} />}
      </div>

      <div className='form-buttons'>
        <button className='cancel' onClick={cancel}>
          Cancelar
        </button>
        <button className='next' onClick={handleSave}>
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};
