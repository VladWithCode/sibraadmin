import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  historySetExtraPayment,
  historySetPayment,
} from "../../actions/historyActions";

export const EditPayment = ({
  payment,
  hasChanged,
  index,
  extraCharge,
  extraChargeId,
}) => {
  const dispatch = useDispatch();

  const { date, payedAt, type, amount, _id } = payment;

  const displayType =
    type === "preReservation"
      ? "Pre apartado"
      : type === "payment"
      ? "Abono"
      : type === "deposit"
      ? "Enganche"
      : "Liquidación";

  const [deletePayment, setDeletePayment] = useState(payment.delete);

  const [formValues, setFormValues] = useState(
    !extraCharge
      ? {
          amount,
          payedAt: payedAt?.split("T")[0],
          _id,
        }
      : {
          amount,
          date: date?.split("T")[0],
          extraChargeId,
        }
  );

  const changeDelete = () => {
    const tempPayment = {
      ...payment,
      ...formValues,
      delete: !deletePayment,
    };

    setDeletePayment(!deletePayment);

    extraCharge
      ? dispatch(historySetExtraPayment(tempPayment))
      : dispatch(historySetPayment(tempPayment));
  };

  const onInputChange = (e) => {
    console.log(e.target);

    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });

    const tempPayment = {
      ...payment,
      ...formValues,
      [e.target.name]: e.target.value,
    };

    extraCharge
      ? dispatch(historySetExtraPayment(tempPayment))
      : dispatch(historySetPayment(tempPayment));
  };

  return (
    <div
      className={`left ${index > 1 ? "mt-3" : "mt-2"} ${
        deletePayment && "deleted"
      } ${hasChanged && "changed"} `}
    >
      <div className="card__header">
        <h4>Pago</h4>
        <div
          onClick={changeDelete}
          className={`delete ${deletePayment && "deleted"} `}
        >
          {deletePayment ? "recuperar" : "eliminar"}
        </div>
      </div>

      {extraCharge ? (
        <>
          <div className="payment">
            <div className="card__body__item">
              <span>Fecha de pago</span>
              <input
                onChange={onInputChange}
                type="date"
                name="date"
                value={formValues.date}
              />
            </div>
            <div className="card__body__item">
              <span>Cantidad</span>
              <input
                onChange={onInputChange}
                type="number"
                name="amount"
                value={formValues.amount}
              />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="payment">
            <div className="card__body__item">
              <span>Tipo de pago</span>
              <p> {displayType} </p>
            </div>
            <div className="card__body__item">
              <span>Fecha de pago</span>
              <input
                onChange={onInputChange}
                type="date"
                name="payedAt"
                value={formValues.payedAt}
              />
            </div>
            <div className="card__body__item">
              <span>Cantidad</span>
              <input
                onChange={onInputChange}
                type="number"
                name="amount"
                value={formValues.amount}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
