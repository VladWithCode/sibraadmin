import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { recordSet } from '../../actions/record';
import {
  setTempError,
  uiFinishLoading,
  uiStartLoading,
} from '../../actions/ui';
import makeServerRequest from '../../helpers/makeServerRequest';
import { useForm } from '../../hooks/useForm';

function RegisterUM({}) {
  const dispatch = useDispatch();
  const { lot, record } = useSelector(state => state);
  const history = useHistory();

  const [formValues, setFormValues] = useForm({
    name: '',
    patLastname: '',
    matLastname: '',
    rfc: '',
    curp: '',
    maritalState: '',
    occupation: '',
    state: '',
    township: '',
    pob: '',
    dob: '',
    nationality: '',
    email: '',
    phoneNumber: '',
    address: '',
  });

  const {
    name,
    patLastname,
    matLastname,
    rfc,
    curp,
    maritalState,
    occupation,
    state,
    township,
    pob,
    dob,
    nationality,
    email,
    phoneNumber,
    address,
  } = formValues;

  const handleGoBack = () => history.goBack();

  const handleRegister = async e => {
    dispatch(uiStartLoading());

    const {
      status,
      record: resRecord,
      message,
      error,
    } = await makeServerRequest(
      `/record/${record._id}/manager`,
      'POST',
      formValues,
      { 'Content-Type': 'application/json' }
    );

    dispatch(uiFinishLoading());

    if (status !== 'OK') {
      console.log(error);
      dispatch(
        setTempError(
          message || error.message || 'Hubo un error al registar al Gestor'
        )
      );
      return;
    }

    dispatch(
      modalUpdate({
        title: 'Se registró al Gestor correctamente.',
        text: `Se ha añadido al gestor ${name} con exito.`,
        link: `/proyectos/ver/${record.project}/lote/${record.lot}`,
        okMsg: 'Continuar',
        // type: t
      })
    );
    dispatch(modalEnable());
    dispatch(recordSet(resRecord));
  };

  return (
    <div className='pb-5 project create'>
      <div className='project__header'>
        <div className='left'>
          <h3>Registrar Gestor Oficioso</h3>
          <p className='small'>
            Lote {lot.lotNumber} - Manzana - {lot.manzana}
          </p>
        </div>
        <div className='left'>
          <button className='card__register-btn danger' onClick={handleGoBack}>
            Regresar
          </button>
        </div>
      </div>
      <div className='card edit'>
        <div className='card__header'>
          <img src='../assets/img/aval.png' alt='aval' />
          <h4>Informacion del Gestor</h4>
        </div>
        <div className='card__body'>
          <div className='left'>
            <div className='card__body__item'>
              <label htmlFor='name'>Nombre(s)</label>
              <input
                autoFocus
                name='name'
                onChange={setFormValues}
                value={name}
                type='text'
                autoComplete='off'
              />
            </div>
            <div className='card__body__item'>
              <label htmlFor='patLastname'>Apellido Paterno</label>
              <input
                name='patLastname'
                onChange={setFormValues}
                value={patLastname}
                type='text'
                autoComplete='off'
              />
            </div>
            <div className='card__body__item'>
              <label htmlFor='matLastname'>Apellido Materno</label>
              <input
                name='matLastname'
                onChange={setFormValues}
                value={matLastname}
                type='text'
                autoComplete='off'
              />
            </div>
            <div className='card__body__item'>
              <label htmlFor='rfc'>RFC</label>
              <input
                minLength='12'
                maxLength='13'
                name='rfc'
                onChange={setFormValues}
                value={rfc}
                type='text'
                autoComplete='off'
              />
            </div>
            <div className='card__body__item'>
              <label htmlFor='curp'>CURP</label>
              <input
                minLength='18'
                maxLength='18'
                name='curp'
                onChange={setFormValues}
                value={curp}
                type='text'
                autoComplete='off'
              />
            </div>
            <div className='card__body__item'>
              <label htmlFor='maritalState'>Estado civil</label>
              <input
                name='maritalState'
                onChange={setFormValues}
                value={maritalState}
                type='text'
                autoComplete='off'
              />
            </div>
            <div className='card__body__item'>
              <label htmlFor='occupation'>Ocupación</label>
              <input
                name='occupation'
                onChange={setFormValues}
                value={occupation}
                type='text'
                autoComplete='off'
              />
            </div>
            <div className='card__body__item'>
              <label htmlFor='state'>Estado</label>
              <input
                name='state'
                onChange={setFormValues}
                value={state}
                type='text'
                autoComplete='off'
              />
            </div>

            <div className='card__body__item'>
              <label htmlFor='township'>Municipio</label>
              <input
                name='township'
                onChange={setFormValues}
                value={township}
                type='text'
                autoComplete='off'
              />
            </div>
            <div className='card__body__item'>
              <label htmlFor='pob'>Lugar de nacimiento</label>
              <input
                name='pob'
                onChange={setFormValues}
                value={pob}
                type='text'
                autoComplete='off'
              />
            </div>
            <div className='card__body__item'>
              <label htmlFor='dob'>Fecha de nacimiento</label>
              <input
                name='dob'
                onChange={setFormValues}
                value={dob}
                type='text'
                autoComplete='off'
              />
            </div>
            <div className='card__body__item'>
              <label htmlFor='nationality'>Nacionalidad</label>
              <input
                name='nationality'
                onChange={setFormValues}
                value={nationality}
                type='text'
                autoComplete='off'
              />
            </div>
            <div className='mt-4 card__header'>
              <h4>Información de contacto</h4>
            </div>
            <div className='card__body__item'>
              <label htmlFor='email'>Email</label>
              <input
                name='email'
                onChange={setFormValues}
                value={email}
                type='email'
              />
            </div>
            <div className='card__body__item'>
              <label htmlFor='phoneNumber'>Número de Contacto</label>
              <input
                minLength='10'
                maxLength='10'
                name='phoneNumber'
                onChange={setFormValues}
                value={phoneNumber}
                type='text'
              />
            </div>
            <div className='card__body__item'>
              <label htmlFor='address'>Domicilio</label>
              <input
                type='text'
                name='address'
                onChange={setFormValues}
                value={address}
              />
            </div>
          </div>
        </div>
      </div>

      <div className='form-buttons'>
        <button className='next' onClick={handleRegister}>
          Registrar Gestor
        </button>
      </div>
    </div>
  );
}

export default RegisterUM;
