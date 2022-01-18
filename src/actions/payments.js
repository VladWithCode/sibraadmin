import {
  ContentState,
  convertFromHTML,
  convertFromRaw,
  convertToRaw,
  EditorState,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { redTypes } from '../types/reduxTypes';
import { staticURL } from '../url';
import { getLot } from './lot';
import { modalEnable, modalUpdate } from './modal';
import { setTempError, uiFinishLoading, uiStartLoading } from './ui';

export const buyLotSet = payment => ({
  type: redTypes.buyLotSet,
  payload: payment,
});

export const buyLotReset = () => ({
  type: redTypes.buyLotReset,
});

export const buyLotSetExtraCharges = extraCharges => ({
  type: redTypes.buyLotSetExtraCharges,
  payload: extraCharges,
});

export const paymentsGetTemplates = projectId => {
  const url = `${staticURL}/templates/${projectId}`;

  return dispatch => {
    dispatch(uiStartLoading());

    fetch(url)
      .then(res => {
        return res.json();
      })
      .then(data => {
        const editorTemplates = data.templates.map(template => {
          const blocks = convertFromHTML(template.content);

          const blocksContent = ContentState.createFromBlockArray(...blocks);

          console.log(
            draftToHtml(
              convertToRaw(
                EditorState.createWithContent(blocksContent).getCurrentContent()
              )
            )
          );
          return {
            ...template,
            content: {
              editorState: EditorState.createWithContent(blocksContent),
            },
          };
        });

        dispatch(paymentsSetTemplates(editorTemplates));
      })
      .catch(err => console.log(err));

    dispatch(uiFinishLoading());
  };
};

const paymentsSetTemplates = templates => ({
  type: redTypes.paymentsGetTemplates,
  payload: templates,
});

export const paymentSetInfo = paymentInfo => ({
  type: redTypes.paymentSetInfo,
  payload: paymentInfo,
});

export const extraPaymentSetInfo = extraPaymentInfo => ({
  type: redTypes.extraPaymentSetInfo,
  payload: extraPaymentInfo,
});

// export const paymentRestart = projectId => ({
//     type: redTypes.paymentRestart,
//     payload: p
// })

export const paymentOpen = projectId => {
  const url = `${staticURL}/templates/${projectId}`;

  return dispatch => {
    dispatch(uiStartLoading());

    fetch(url)
      .then(res => {
        return res.json();
      })
      .then(data => {
        const editorTemplates = data.templates.map(template => {
          if (!template.state) {
            return {
              ...template,
              state: {
                editorState: EditorState.createEmpty(),
              },
            };
          }

          return {
            ...template,
            state: {
              editorState: EditorState.createWithContent(
                convertFromRaw(JSON.parse(template.state?.toString()))
              ),
            },
          };
        });

        dispatch(paymentRestart(editorTemplates));

        return data.templates;
      })
      .catch(err => {
        console.log(err);
        dispatch(uiFinishLoading());
      });

    dispatch(uiFinishLoading());
  };
};

const paymentRestart = templates => ({
  type: redTypes.paymentRestart,
  payload: templates,
});

export const paymentTemplateSet = template => ({
  type: redTypes.paymentTemplateSet,
  payload: template,
});

const isFormValid = paymentInfo => {
  const {
    liquidate,
    preReserved,
    depositAmount,
    reservationDate,
    preReservationAmount,
    preReservationDate,
    history,
    payments,
    lapseToPay,
    recordOpenedAt,
    paymentsDate,
    lapseType,
  } = paymentInfo;

  if (+depositAmount === 0) {
    return 'No puede haber un enganche de $0 (cero pesos)';
  }

  if (liquidate) {
    if (!reservationDate) {
      return 'Necesita proporcionar una fecha de compra';
    }
  }

  if (preReserved) {
    if (+preReservationAmount === 0) {
      return 'El monto de preapartado no puede ser $0 (cero pesos)';
    }
    if (!preReservationDate) {
      return 'Necesita proporcionar una fecha de preapartado';
    }
  }

  if (history) {
    for (const payment in payments) {
      // amount: +p.amount,
      //                 ogPaymentDate: p.paymentDate,
      //                 payedAt: p.payedDate

      if (+payment.amount === 0 || !payment.ogPaymentDate || !payment.payedAt) {
        return 'Uno o varios pagos proporcionados están incompletos';
      }
    }
  } else {
    // recordOpenedAt,
    //             reservationDate,
    //             paymentsDate: paymentsDate,
    //             lapseType: lapseType,
    //             lapseToPay

    if (!recordOpenedAt) {
      return 'Necesita proporcionar una fecha de inicio de historial';
    }
    if (!reservationDate) {
      return 'Necesita proporcionar una fecha de apartado';
    }
    if (!lapseType) {
      return 'Necesita seleccionar alguna modalidad de pago (semanal/mensual)';
    }
    if (!paymentsDate) {
      return 'Necesita elegir un día de pago';
    }
    if (!lapseToPay) {
      return 'Necesita elegir un número de pagos';
    }
  }

  return false;
};

export const submitPayment = (paymentInfo, lotInfo) => {
  return dispatch => {
    const isValid = isFormValid(paymentInfo);

    if (isValid) {
      dispatch(setTempError(isValid));
      return;
    } else {
      const {
        liquidate,
        preReserved,
        client,
        depositAmount,
        payedTo,
        payedAt,
        amount,
        reservationDate,
        preReservationAmount,
        preReservationDate,
        history,
        payments,
        lapseToPay,
        recordOpenedAt,
        paymentsDate,
        lapseType,
      } = paymentInfo;
      const { projectId, lotId, lotPrice } = lotInfo;

      const state = liquidate
        ? 'liquidated'
        : preReserved
        ? 'preReserved'
        : 'reserved';

      const data = {
        customerId: client,
        projectId,
        lotId,
        state,
        paymentInfo: {
          depositAmount: +depositAmount,
        },
        commissionInfo: null,
      };

      if (payedTo.length > 1) {
        data.commissionInfo = {
          payedTo,
          amount: +amount,
          payedAt: payedAt || null,
        };
      }

      if (liquidate) {
        data.paymentInfo = {
          lotPrice: +lotPrice,
          reservationDate,
          depositAmount: +depositAmount,
        };
      } else if (preReserved) {
        data.paymentInfo = {
          preReservationAmount: +preReservationAmount,
          preReservationDate,
          lotPrice: +lotPrice,
          depositAmount: +depositAmount,
        };
      } else if (history) {
        let counter = +depositAmount;

        data.payments = payments.map(p => {
          counter += +p.amount;

          let type = 'payment';

          if (+counter === +lotPrice) {
            type = 'liquidation';
          }

          return {
            amount: +p.amount,
            ogPaymentDate: p.paymentDate,
            payedAt: p.payedDate,
            type,
            payer: p.payer ? (p.payer.length > 0 ? p.payer : null) : null,
          };
        });

        data.payments.push({
          amount: +depositAmount,
          payedAt: reservationDate,
          type: 'deposit',
        });

        data.paymentInfo = {
          depositAmount,
          minimumPaymentAmount: (+lotPrice - depositAmount) / +lapseToPay,
          lotPrice,
          recordOpenedAt,
          reservationDate,
          paymentsDate: paymentsDate,
          lapseType: lapseType,
          lapseToPay,
        };
      } else {
        data.paymentInfo = {
          depositAmount,
          minimumPaymentAmount: (+lotPrice - depositAmount) / +lapseToPay,
          lotPrice,
          recordOpenedAt,
          reservationDate,
          paymentsDate: paymentsDate,
          lapseType: lapseType,
          lapseToPay,
        };
      }

      dispatch(postData(data, lotInfo));
    }
  };
};

const postData = (data, lotInfo) => {
  const { projectId, lotId } = lotInfo;

  return dispatch => {
    const url = `${staticURL}/records`;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        return response.json();
      })
      .then(resData => {
        if (resData?.status === 'OK') {
          const modalInfo = {
            title: `Compra registrada con éxito con éxito`,
            text: null,
            link: `/proyectos/ver/${projectId}/lote/${lotId}`,
            okMsg: 'Continuar',
            closeMsg: null,
            type: redTypes.projectCreate,
          };

          dispatch(modalUpdate(modalInfo));
          dispatch(modalEnable());
          return dispatch(getLot(lotId));
        } else {
          dispatch(setTempError('Ha ocurrido un error en la base de datos'));
        }
      })
      .catch(err => {
        console.log(err);
        dispatch(uiFinishLoading());
        return;
      });
  };
};
