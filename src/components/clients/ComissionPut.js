import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { floatingButtonSet } from "../../actions/floatingButton";
import { historyGetLot } from "../../actions/historyActions";
import { modalEnable, modalUpdate } from "../../actions/modal";
import { redirectSet } from "../../actions/redirect";
import {
  setTempError,
  uiFinishLoading,
  uiStartLoading,
} from "../../actions/ui";
import { redTypes } from "../../types/reduxTypes";
import { staticURL } from "../../url";
import { ClientShort } from "../clients/ClientShort";

export const CommissionPut = () => {
  const dispatch = useDispatch();

  const {
    historyActions: { lot: currentLot },
    clients,
  } = useSelector((state) => state);

  console.log("este es el current lot", currentLot);

  const { area, isCorner, lotNumber, measures, manzana, price, record } =
    currentLot;

  const currentClient = clients.find((c) => c._id === record?.customer);

  useEffect(() => {
    if (record?._id) {
      dispatch(historyGetLot(record?.lot));
      dispatch(
        redirectSet(
          redTypes.history,
          `/historial/comision/editar/${record._id}`
        )
      );
    }

    dispatch(floatingButtonSet("pencil", redTypes.projectCreate));
    dispatch(
      redirectSet(redTypes.history, `/historial/comision/editar/${record._id}`)
    );
  }, [dispatch, record._id, record?.lot]);

  const [emptyFields, setEmptyFields] = useState([]);
  const [hasChanged, setHasChanged] = useState([]);

  const [formValues, setFormValues] = useState({
    payedTo: record.commissionInfo?.payedTo,
    amount: record.commissionInfo?.amount,
    payedAt: record.commissionInfo?.payedAt.split("T")[0],
  });

  const { amount, payedTo, payedAt } = formValues;

  const inputChange = (e) => {
    checkEmptyField(e);
    setFormValues({ ...formValues, [e.target.name]: e.target.value });
    checkChanges(e.target.name);
  };

  const updateComissionInfo = async () => {
    if (+amount === 0) {
      const tempEmptyFields = emptyFields;

      if (tempEmptyFields.includes("amount")) {
        const index = tempEmptyFields.indexOf("amount");

        tempEmptyFields.splice(index, 1);
      } else {
        tempEmptyFields.push("amount");
      }

      if (tempEmptyFields.includes("payedTo")) {
        const index = tempEmptyFields.indexOf("payedTo");

        tempEmptyFields.splice(index, 1);
      } else {
        tempEmptyFields.push("payedTo");
      }

      setEmptyFields(tempEmptyFields);
      dispatch(setTempError("Debe ingresar una cantidad de pago"));

      return;
    }

    if (payedAt.trim().length <= 2) {
      const tempEmptyFields = emptyFields;

      if (tempEmptyFields.includes("payedTo")) {
        const index = tempEmptyFields.indexOf("payedTo");

        tempEmptyFields.splice(index, 1);
      } else {
        tempEmptyFields.push("payedTo");
      }

      if (tempEmptyFields.includes("payedTo")) {
        const index = tempEmptyFields.indexOf("payedTo");

        tempEmptyFields.splice(index, 1);
      } else {
        tempEmptyFields.push("payedTo");
      }

      setEmptyFields(tempEmptyFields);

      dispatch(setTempError("Debe ingresar un nombre válido"));

      return;
    }

    const data = {
      amount,
      payedAt,
      payedTo,
    };

    dispatch(uiStartLoading());

    const res = await postCommissionInfo(data);

    dispatch(uiFinishLoading());

    if (res) {
      if (res.status === "OK") {
        const modalInfo = {
          title: `Comisión registrada con éxito`,
          text: `Comisión entregada a ${payedTo} por una cantidad de: ${amount}`,
          link: `/historial`,
          okMsg: "Continuar",
          closeMsg: null,
          type: redTypes.history,
        };

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());
      } else {
        dispatch(setTempError("Hubo un problema con la base de datos"));

        return;
      }
    }
  };

  const postCommissionInfo = (data) => {
    const url = `${staticURL}/records/${record._id}/set-commission`;

    const res = fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((data) => {
        console.log(data);
        return data;
      })
      .catch((err) => {
        console.log(err);
        // dispatch(uiFinishLoading());
      });

    return res;
  };

  const checkEmptyField = (e) => {
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
      title: "Cancelar creación de cliente",
      text: null,
      link: `/historial`,
      okMsg: "Sí",
      closeMsg: "No",
      type: redTypes.history,
    };

    dispatch(modalUpdate(modalInfo));
    dispatch(modalEnable());
  };

  const checkChanges = (attribute) => {
    const tempHasChanged = hasChanged;

    if (record.commissionInfo) {
      if (
        formValues[attribute.toString()] === record.commissionInfo[attribute]
      ) {
        if (tempHasChanged.includes(attribute)) {
          const index = tempHasChanged.indexOf(attribute);

          tempHasChanged.splice(index, 1);
        }
      } else {
        if (!tempHasChanged.includes(attribute)) {
          tempHasChanged.push(attribute);
        }
      }
    }

    setHasChanged(tempHasChanged);
  };

  console.log(formValues);

  return (
    <div className="pb-5 project create">
      <div className="project__header">
        <div className="left">
          <h3> Comisión </h3>
        </div>
      </div>

      <div className="card mb-2">
        <div className="card__header">
          <img src="../assets/img/lots.png" alt="" />
          <h4>Información General del Lote</h4>
        </div>
        <div className="card__body">
          <div className="right">
            <div className="card__body__item">
              <span>Número de Lote</span>
              <p> {lotNumber} </p>
            </div>
            <div className="card__body__item">
              <span>Número de Manzana</span>
              <p> {manzana} </p>
            </div>
            <div className="card__body__item">
              <span>Esquina</span>
              <p> {isCorner ? "Sí" : "No"} </p>
            </div>
            <div className="card__body__item">
              <span>Área</span>
              <p>
                {" "}
                {area}m<sup>2</sup>{" "}
              </p>
            </div>
            <div className="card__body__item">
              <span>Precio</span>
              <p className="price"> ${price?.toLocaleString()} </p>
            </div>
          </div>
          <div className="left">
            <h4>Medidas</h4>

            {measures &&
              measures.length > 0 &&
              measures.map((measure) => (
                <div key={measure._id} className="card__body__item">
                  <span>{measure.title}</span>
                  <p>
                    {measure.value}m<sup>2</sup>
                  </p>
                </div>
              ))}
          </div>
        </div>
      </div>

      {currentClient && <ClientShort client={currentClient} />}

      <div className="card edit mt-2">
        <div className="card__body">
          <div className="right">
            <div className="card__header">
              <img src="../assets/img/aval.png" alt="" />
              <h4>Comisión</h4>
            </div>
            <div
              className={`card__body__item ${
                emptyFields.includes("payedTo") && "error"
              }`}
            >
              <label htmlFor="payedTo">Asesor</label>
              <input
                className={`${hasChanged.includes("payedTo") && "changed"}`}
                name="payedTo"
                type="text"
                autoComplete="off"
                onChange={inputChange}
                value={payedTo}
              />
            </div>
            <div
              className={`card__body__item ${
                emptyFields.includes("amount") && "error"
              }`}
            >
              <label htmlFor="amount">Comisión</label>
              <input
                className={`${hasChanged.includes("amount") && "changed"}`}
                name="amount"
                type="number"
                autoComplete="off"
                onChange={inputChange}
                value={amount}
              />
            </div>
            <div
              className={`card__body__item ${
                emptyFields.includes("payedAt") && "error"
              }`}
            >
              <label htmlFor="payedAt">Fecha cuando fue pagada</label>
              <input
                className={`${hasChanged.includes("payedAt") && "changed"}`}
                name="payedAt"
                type="date"
                autoComplete="off"
                onChange={inputChange}
                value={payedAt}
              />
            </div>
          </div>
          <div className="left"></div>
        </div>
      </div>

      <div className="form-buttons">
        <button className="cancel" onClick={cancel}>
          Cancelar
        </button>
        <button className="next" onClick={updateComissionInfo}>
          Realizar Pago
        </button>
      </div>
    </div>
  );
};
