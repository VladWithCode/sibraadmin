import React from 'react';
import { useDispatch } from 'react-redux';
import {
  setTempError,
  uiFinishLoading,
  uiStartLoading,
} from '../../actions/ui';
import { useForm } from '../../hooks/useForm';
import { staticURL } from '../../url';

export const QuickRegister = ({
  newCustomer,
  setNewCustomer,
  activeFloating,
  setActiveFloating,
  setClient,
}) => {
  const dispatch = useDispatch();

  const [formValues, handleInputChange] = useForm({
    rfc: '',
    names: '',
    patLastname: '',
    matLastname: '',
    phoneNumber: '',
  });

  const { rfc, names, patLastname, matLastname, phoneNumber } = formValues;

  const handleRegisterFinish = async e => {
    dispatch(uiStartLoading());

    const res = await (
      await fetch(`${staticURL}/customers/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          doc: {
            _id: rfc,
            rfc,
            names,
            patLastname,
            matLastname,
            phoneNumber,
          },
        }),
      })
    ).json();
    dispatch(uiFinishLoading());

    const { customer, status, message } = res;

    if (status !== 'OK') {
      return dispatch(setTempError(message));
    }

    customer.fullName =
      `${customer.names} ${customer.patLastname} ${customer.matLastname}`.trim();

    setNewCustomer(customer);
    setClient(customer);
    setActiveFloating(false);
  };

  return (
    <div className='quick-register'>
      <div className='quick-register__header'>
        <p className='quick-register__title'>Agregar Cliente</p>
        <p className='quick-register__notice'>
          <span>*</span> Campo requerido
        </p>
      </div>
      <div className='quick-register__body'>
        <form className='quick-register__form'>
          <div className='quick-register__input-group'>
            <label htmlFor='rfc' className='quick-register__label'>
              RFC
            </label>
            <input
              type='text'
              className='quick-register__input'
              name='rfc'
              value={rfc}
              onChange={handleInputChange}
            />
          </div>
          <div className='quick-register__input-group' data-required>
            <label htmlFor='names' className='quick-register__label'>
              Nombres
            </label>
            <input
              type='text'
              className='quick-register__input'
              name='names'
              value={names}
              onChange={handleInputChange}
            />
          </div>
          <div className='quick-register__input-group' data-required>
            <label htmlFor='patLastname' className='quick-register__label'>
              Apellido Paterno
            </label>
            <input
              type='text'
              className='quick-register__input'
              name='patLastname'
              value={patLastname}
              onChange={handleInputChange}
            />
          </div>
          <div className='quick-register__input-group'>
            <label htmlFor='matLastname' className='quick-register__label'>
              Apellido Materno
            </label>
            <input
              type='text'
              className='quick-register__input'
              name='matLastname'
              value={matLastname}
              onChange={handleInputChange}
            />
          </div>
          <div className='quick-register__input-group' data-required>
            <label htmlFor='phoneNumber' className='quick-register__label'>
              Teléfono
            </label>
            <input
              type='text'
              className='quick-register__input'
              name='phoneNumber'
              value={phoneNumber}
              onChange={handleInputChange}
            />
          </div>
        </form>
        <div className='quick-register__input-group'>
          <button
            className='quick-register__btn quick-register__btn--finish'
            onClick={handleRegisterFinish}>
            Registrar
          </button>
        </div>
      </div>
    </div>
  );
};
