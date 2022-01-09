import React from "react";

export const ProjectExtraCharges = ({ extraCharges }) => {
  const dateOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  console.log(extraCharges);

  return (
    <div className="card mt-2">
      <div className="card__body">
        <div className="card__header">
          <img src="../assets/img/services.png" alt="" />
          <h4>Cargo extras</h4>
        </div>

        {extraCharges.map(
          (
            { description, _id, createdAt, title, updatedAt, amount },
            index
          ) => {
            const dispCreatedAt = new Date(
              createdAt.split("T")[0]
            ).toLocaleDateString("es-MX", dateOptions);
            const dispUpdatedAt = new Date(
              updatedAt && updatedAt.split("T")[0]
            ).toLocaleDateString("es-MX", dateOptions);

            return (
              <div
                className={`right ${index > 1 ? "mt-5" : "mt-3"} `}
                key={_id}
              >
                <div className="card__header">
                  <h4>{title}</h4>
                </div>
                <div className="card__body__item">
                  <span>Precio</span>
                  <p className="price"> ${amount.toLocaleString()} </p>
                </div>
                {description && (
                  <div className="card__body__item description">
                    <span>Descripción del Cargo</span>
                    <p> {description} </p>
                  </div>
                )}
                <div className="card__body__item">
                  <span>Fecha de registro</span>
                  <p> {dispCreatedAt} </p>
                </div>
                {updatedAt && (
                  <div className="card__body__item">
                    <span>última Fecha de actualización</span>
                    <p> {dispUpdatedAt} </p>
                  </div>
                )}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};
