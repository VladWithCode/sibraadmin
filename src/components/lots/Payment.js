import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { floatingButtonSet } from '../../actions/floatingButton';
import { historyGetLot } from '../../actions/historyActions';
import { getLot } from '../../actions/lot';
import { modalEnable, modalUpdate } from '../../actions/modal';
import { paymentSetInfo } from '../../actions/payments';
import { redirectSet } from '../../actions/redirect';
import {
  setTempError,
  setTempSuccessNotice,
  uiFinishLoading,
  uiStartLoading,
} from '../../actions/ui';
import { redTypes } from '../../types/reduxTypes';
import { staticURL } from '../../url';
import { ClientShort } from '../clients/ClientShort';
import { Record } from '../history-globals/Record';
import { TextEditor } from '../templates/TextEditor';

const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export const Payment = () => {
  const dispatch = useDispatch();

  const { projectId, lotId } = useParams();

  const {
    historyActions: { lot: currentLot },
    clients,
    payments,
  } = useSelector(state => state);

  const { record } = currentLot;

  const currentClient = clients.find(c => c._id === record?.customer);

  const [emptyFields, setEmptyFields] = useState([]);

  const [formValues, setFormValues] = useState(payments);

  const {
    amount,
    markAsNextPayment,
    prorogateTo,
    payer,
    prorogate,
    editTemplate,
    templates,
    payedAt,
  } = formValues;

  const currentTemplate = templates.find(t => t.type === 'PAGO');

  useEffect(() => {
    dispatch(floatingButtonSet('pencil', redTypes.projectCreate));
    dispatch(
      redirectSet(
        redTypes.history,
        `/historial/abonar/${projectId}/lote/${lotId}`
      )
    );
    //
    // dispatch(paymentsGetTemplates(projectId));

    setFormValues(payments);
  }, [dispatch, projectId, lotId, payments]);

  useEffect(() => {
    dispatch(historyGetLot(lotId));
  }, [lotId, dispatch]);

  const inputChange = ({ target }) => {
    checkEmptyField({ target });
    setFormValues({ ...formValues, [target.name]: target.value });
    dispatch(paymentSetInfo({ ...formValues, [target.name]: target.value }));
  };

  const pay = async () => {
    if (+amount === 0) {
      const tempEmptyFields = emptyFields;

      if (tempEmptyFields.includes('amount')) {
        const index = tempEmptyFields.indexOf('amount');

        tempEmptyFields.splice(index, 1);
      } else {
        tempEmptyFields.push('amount');
      }

      setEmptyFields(tempEmptyFields);
      dispatch(setTempError('Debe ingresar una cantidad de pago'));

      return;
    }

    const exp = new RegExp(
      /<([a-z]+)\s?(style=".*?")?>(<([a-z]+)\s?(style=".*?")?>(.*?)<\/\4>)<\/\1>/gi
    );

    const strContent = currentTemplate
      ? draftToHtml(
          convertToRaw(currentTemplate.state.editorState.getCurrentContent())
        )
      : null;

    const tempContent = strContent?.replace(
      exp,
      (str, g1, g2, g3, g4, g5, g6) => {
        return `<${g1}${g2 ? ' ' + g2 : ''}>${
          !g3
            ? ''
            : `<${g4}${g5 ? ' ' + g5 : ''}>${g6.replaceAll(
                ' ',
                '&nbsp;'
              )}</${g4}>`
        }</${g1}>`;
      }
    );

    const templateContent = tempContent?.replaceAll('<p></p>', '<p><br></p>');

    const data = {
      type:
        +amount >= record.paymentInfo.lotAmountDue ? 'liquidation' : 'payment',
      amount: +amount,
      markAsNextPayment,
      payer: payer?.trim().length > 3 || null,
      content: editTemplate && !prorogate ? templateContent : null,
      payedAt: payedAt,
    };

    dispatch(uiStartLoading());

    const res = await postPayment(data);

    dispatch(uiFinishLoading());

    if (res) {
      if (res.status === 'OK') {
        const modalInfo = {
          title: 'Pago realizado con éxito',
          text: `pago por la cantidad de $${amount}`,
          link: `/proyectos/ver/${projectId}/lote/${lotId}`,
          okMsg: 'Continuar',
          closeMsg: null,
          type: redTypes.project,
        };

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
        dispatch(getLot(lotId));
      } else {
        dispatch(
          setTempError(res.message || 'Hubo un problema con la base de datos')
        );

        return;
      }
    }
  };

  const postPayment = data => {
    const url = `${staticURL}/records/${record._id}/pay`;

    const res = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        console.log(err);
        // dispatch(uiFinishLoading());
      });

    return res;
  };

  const postProrogation = async () => {
    if (prorogateTo === '') {
      const tempEmptyFields = emptyFields;

      if (tempEmptyFields.includes('prorogateTo')) {
        const index = tempEmptyFields.indexOf('prorogateTo');

        tempEmptyFields.splice(index, 1);
      } else {
        tempEmptyFields.push('prorogateTo');
      }

      setEmptyFields(tempEmptyFields);
      dispatch(setTempError('Debe ingresar una fecha para la prórroga'));

      return;
    }

    const data = {
      prorogateTo,
    };

    const url = `${staticURL}/records/${record._id}/prorogate`;

    dispatch(uiStartLoading());

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        return response.json();
      })
      .then(data => {
        return data;
      })
      .catch(err => {
        console.log(err);
        // dispatch(uiFinishLoading());
      });

    if (res) {
      if (res.status === 'OK') {
        const modalInfo = {
          title: `Prórroga programada con éxito`,
          text: `El pago se ha programado para el ${new Date(
            prorogateTo
          ).toLocaleDateString('es-MX', dateOptions)}`,
          link: `/historial`,
          okMsg: 'Continuar',
          closeMsg: null,
          type: redTypes.history,
        };

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
        dispatch(getLot(lotId));
      } else {
        dispatch(setTempError('Hubo un problema con la base de datos'));

        return;
      }
    }

    dispatch(uiFinishLoading());
  };

  const checkEmptyField = e => {
    if (e.target.value?.trim().length > 0) {
      const tempEmptyFields = emptyFields;

      if (tempEmptyFields.includes(e.target.name)) {
        const index = tempEmptyFields.indexOf(e.target.name);

        tempEmptyFields.splice(index, 1);
      }

      setEmptyFields(tempEmptyFields);
    }
  };

  const cancel = () => {
    const modalInfo = {
      title: 'Cancelar pago',
      text: '¿Desea cancelar el pago del lote?',
      link: `/historial`,
      okMsg: 'Sí',
      closeMsg: 'No',
      type: redTypes.history,
    };

    dispatch(modalUpdate(modalInfo));
    dispatch(modalEnable());
  };

  const handleCopy = ({ target }) => {
    navigator.clipboard.writeText(`%%${target.id.toUpperCase()}%%`);

    dispatch(
      setTempSuccessNotice(`Variable ${target.id} copiada al porta papeles`)
    );
  };

  return (
    <div className='pb-5 project create'>
      <div className='project__header'>
        <div className='left'>
          <h3> Pagar lote </h3>
        </div>

        <div className='options'>
          {prorogate ? (
            <input
              type='checkbox'
              value={true}
              onClick={() => {
                setFormValues(fv => ({
                  ...fv,
                  prorogate: !prorogate,
                }));
                dispatch(
                  paymentSetInfo({
                    ...formValues,
                    prorogate: !prorogate,
                  })
                );
              }}
              id='preReserve'
              name='action'
              defaultChecked
            />
          ) : (
            <input
              type='checkbox'
              value={true}
              onClick={() => {
                setFormValues(fv => ({
                  ...fv,
                  prorogate: !prorogate,
                }));
                dispatch(
                  paymentSetInfo({
                    ...formValues,
                    prorogate: !prorogate,
                  })
                );
              }}
              id='preReserve'
              name='action'
            />
          )}

          <label htmlFor='preReserve'>
            <div className='option'>Solicitar prórroga</div>
          </label>
        </div>
      </div>

      <div className='card edit my-2'>
        <div className='card__header'>
          <img src='../assets/img/payment.png' alt='' />
          <h4>Información del pago</h4>
        </div>
        <div className='card__body'>
          <div className='right'>
            {prorogate ? (
              <div
                className={`card__body__item ${
                  emptyFields.includes('prorogateTo') && 'error'
                }`}>
                <label htmlFor='prorogateTo'>Fecha límite de pago</label>
                <input
                  autoFocus
                  name='prorogateTo'
                  type='date'
                  autoComplete='off'
                  value={prorogateTo}
                  onChange={inputChange}
                />
              </div>
            ) : (
              <>
                <div
                  className={`card__body__item ${
                    emptyFields.includes('amount') && 'error'
                  }`}>
                  <label htmlFor='amount'>Cantidad del pago</label>
                  <input
                    autoFocus
                    name='amount'
                    type='number'
                    autoComplete='off'
                    value={amount}
                    onChange={inputChange}
                  />
                </div>

                <div
                  className={`card__body__item ${
                    emptyFields.includes('markAsNextPayment') && 'error'
                  }`}>
                  <label>acción</label>
                  <div className='options'>
                    <input
                      type='radio'
                      name='markAsNextPayment'
                      onClick={() => {
                        setFormValues(fv => ({
                          ...fv,
                          amount: record.paymentInfo.minimumPaymentAmount,
                          markAsNextPayment: true,
                        }));
                        dispatch(
                          paymentSetInfo({
                            ...formValues,
                            amount: record.paymentInfo.minimumPaymentAmount,
                            markAsNextPayment: true,
                          })
                        );
                      }}
                      id='no'
                    />
                    <label htmlFor='no'>Pagar mensualidad</label>

                    <input
                      defaultChecked
                      type='radio'
                      name='markAsNextPayment'
                      onClick={() => {
                        setFormValues(fv => ({
                          ...fv,
                          amount: '',
                          markAsNextPayment: false,
                        }));
                        dispatch(
                          paymentSetInfo({
                            ...formValues,
                            amount: '',
                            markAsNextPayment: false,
                          })
                        );
                      }}
                      id='yes'
                    />
                    <label htmlFor='yes'>Abonar</label>
                  </div>
                </div>

                <div
                  className={`card__body__item ${
                    emptyFields.includes('payer') && 'error'
                  }`}>
                  <label htmlFor='payer'>Quién paga</label>
                  <input
                    name='payer'
                    type='text'
                    autoComplete='off'
                    value={payer}
                    onChange={inputChange}
                  />
                </div>
                <div className='card__body__item'>
                  <label htmlFor='payedAt'>Fecha del Pago</label>
                  <input
                    onChange={inputChange}
                    type='date'
                    name='payedAt'
                    value={payedAt}
                  />
                </div>
              </>
            )}
          </div>
          <div className='left'></div>
        </div>
      </div>

      <div className='project__header'>
        <div className='left'></div>

        {!prorogate && (
          <div className='options'>
            {editTemplate ? (
              <input
                className='ok'
                type='checkbox'
                value={true}
                onClick={() => {
                  setFormValues(fv => ({
                    ...fv,
                    editTemplate: !editTemplate,
                  }));
                  dispatch(
                    paymentSetInfo({
                      ...formValues,
                      editTemplate: !editTemplate,
                    })
                  );
                }}
                id='editTemplate'
                defaultChecked
              />
            ) : (
              <input
                className='ok'
                type='checkbox'
                value={false}
                onClick={() => {
                  setFormValues(fv => ({
                    ...fv,
                    editTemplate: !editTemplate,
                  }));
                  dispatch(
                    paymentSetInfo({
                      ...formValues,
                      editTemplate: !editTemplate,
                    })
                  );
                }}
                id='editTemplate'
              />
            )}

            <label htmlFor='editTemplate'>
              <div className='option'>Editar recibo</div>
            </label>
          </div>
        )}
      </div>

      {editTemplate && currentTemplate && !prorogate && (
        <div className='card'>
          <div className='card__body'>
            <div className='paraphs'>
              <TextEditor template={currentTemplate} payment={true} />
              <div className='my-3'></div>
            </div>
            <div className='variables'>
              <h4>Variables de la plantilla</h4>

              {currentTemplate.variables.sort().map(variable => (
                <p onClick={handleCopy} id={variable.title}>
                  {variable.title}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}

      {record?._id && <Record record={record} payment={true} />}

      {currentClient && <ClientShort client={currentClient} />}

      <div className='form-buttons'>
        <button className='cancel' onClick={cancel}>
          Cancelar
        </button>
        <button
          className='next'
          onClick={() => (prorogate ? postProrogation() : pay())}>
          Realizar Pago
        </button>
      </div>
    </div>
  );
};
