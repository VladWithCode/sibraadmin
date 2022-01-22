import { redTypes } from '../types/reduxTypes';
import { staticURL } from '../url';
import { modalEnable, modalUpdate } from './modal';
import { setTempError, uiFinishLoading, uiStartLoading } from './ui';

export const historySetLot = lot => ({
  type: redTypes.historySetLot,
  payload: lot,
});

export const historyGetLot = lotId => {
  const url = `${staticURL}/lots/${lotId}`;

  return dispatch => {
    dispatch(uiStartLoading());
    fetch(url)
      .then(resp => {
        return resp.json();
      })
      .then(data => {
        dispatch(uiFinishLoading());

        dispatch(historySetLot(data.lot));
      })
      .catch(err => console.log(err));
  };
};

export const historySetRecordInfo = record => ({
  type: redTypes.historySetRecordInfo,
  payload: record,
});

export const historySetPayment = payment => ({
  type: redTypes.historySetPayment,
  payload: payment,
});

export const historySetExtraPayment = payment => ({
  type: redTypes.historySetExtraPayment,
  payload: payment,
});

export const historySetExtraPayBefore = (extraChargeId, payBefore) => ({
  type: redTypes.historySetExtraPayBefore,
  payload: {
    extraChargeId,
    payBefore,
  },
});

export const historyPostUpdate = record => {
  return dispatch => {
    dispatch(uiStartLoading());

    if (
      record.invalidPayments.length > 0 ||
      record.invalidExtraPayments.length > 0
    ) {
      dispatch(setTempError('No puede haber pagos con campos vacios'));
      dispatch(uiFinishLoading());

      return;
    }

    const url = `${staticURL}/record/${record._id}`;

    const extraChargesUpdated = [];

    record.extraCharges.forEach(extra => {
      if (record.extraChargesUpdated.includes(extra._id)) {
        const newPayments = extra.payments.filter(p => !p.delete);
        extra.payments = newPayments;

        extraChargesUpdated.push(extra);
      }
    });

    const data = {
      payments: record.payments,
      extraCharges: extraChargesUpdated.length > 0 ? extraChargesUpdated : null,
      paymentInfo: {
        lapseType: record.paymentInfo.lapseType,
        minimumPaymentAmount:
          (+record.paymentInfo.lotPrice - +record?.paymentInfo.depositAmount) /
          +record.paymentInfo.lapseToPay,
        lapseToPay: record.paymentInfo.lapseToPay,
        paymentsDay: record.paymentInfo.paymentsDay,
      },
    };

    fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(async resp => {
        if (resp.ok) {
          const modalInfo = {
            title: `Historial actualizado con éxito`,
            text: null,
            link: `/proyectos/ver/${record.project}/lote/${record.lot}`,
            okMsg: 'Continuar',
            closeMsg: null,
            type: redTypes.project,
          };

          dispatch(modalUpdate(modalInfo));
          dispatch(modalEnable());
          dispatch(uiFinishLoading());
        }
      })
      .catch(err => console.log(err));

    dispatch(uiFinishLoading());
  };
};
