import React from "react";

export const ClientShort = ({ client }) => {
  const { names, patLastname, matLastname, _id, occupation } = client;

  return (
    <div className="card">
      <div className="card__body">
        <div className="card__header">
          <img src="../assets/img/user.png" alt="" />
          <h4>Información básica del cliente</h4>
        </div>
        <div className="right">
          <div className="card__body__item">
            <span>nombre(s)</span>
            <p> {names} </p>
          </div>
          <div className="card__body__item">
            <span>apellido paterno</span>
            <p> {patLastname} </p>
          </div>
          {matLastname && (
            <div className="card__body__item">
              <span>apelido materno</span>
              <p> {matLastname} </p>
            </div>
          )}
        </div>

        <div className="left">
          <div className="card__body__item">
            <span>RFC</span>
            <p> {_id} </p>
          </div>
          {occupation && (
            <div className="card__body__item">
              <span>ocupación</span>
              <p> {occupation} </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
