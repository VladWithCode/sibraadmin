import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "../../hooks/useForm";

import {
  projectAddService,
  projectDeleteService,
  projectDisableSvcModal,
} from "../../actions/project";

export const ModalServices = React.memo(({ service }) => {
  const dispatch = useDispatch();

  const {
    modalServices: { active, beenClosed, input, title, text, okMsg, closeMsg },
  } = useSelector((state) => state.project);

  const [serviceValue, handleServiceChange, setServiceValue] = useForm({
    serviceName: "",
  });

  const { serviceName } = serviceValue;

  const handleAddSvc = (e) => {
    e?.preventDefault();
    dispatch(projectAddService(serviceName));
    setServiceValue("serviceName", "");
    dispatch(projectDisableSvcModal());
  };

  const handleClose = () => {
    dispatch(projectDisableSvcModal());
  };

  const handleDeleteSvc = (e) => {
    e?.preventDefault();
    dispatch(projectDeleteService(service));
    dispatch(projectDisableSvcModal());
  };

  return (
    <>
      {
        <div
          className={` ${!active ? "modal-hidden" : "modal-bc"} ${
            beenClosed && !active ? "modal-bc modal-animate-hide" : ""
          }`}
        >
          <div className="modal">
            <h3 className="modal__title">{title}</h3>

            <p className="modal__text">
              {text} , {input}
            </p>

            <form
              onSubmit={(e) => {
                input ? handleAddSvc(e) : handleDeleteSvc(e);
              }}
              className="modal__form"
            >
              {input && (
                <div className="modal__input">
                  <div className="modal__input__field">
                    <span>Nombre del Servicio:</span>
                    <input
                      autoFocus={true}
                      type="text"
                      name="serviceName"
                      value={serviceName}
                      onChange={handleServiceChange}
                    />
                  </div>
                </div>
              )}

              <div className="modal__btns">
                <p
                  onClick={handleClose}
                  className="modal__btns__link btn btn-err mr-2"
                >
                  {closeMsg}
                </p>

                <p
                  onClick={() => {
                    input ? handleAddSvc() : handleDeleteSvc();
                  }}
                  className="modal__btns__link btn btn-ok"
                >
                  {okMsg}
                </p>
              </div>
            </form>
          </div>
        </div>
      }
    </>
  );
});
