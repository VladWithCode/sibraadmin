import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { floatingButtonSet } from "../../actions/floatingButton";
// import { projectCreate, projectEnableSvcModal, projectSetPage, projectUpdateSvcModal } from '../../actions/project';
import {
  projectCreate,
  projectEnableSvcModal,
  projectSetPage,
  projectUpdateSvcModal,
} from "../../actions/project";
import { redirectSet } from "../../actions/redirect";
import { setTempError, unSetError } from "../../actions/ui";
import { useForm } from "../../hooks/useForm";
import { redTypes } from "../../types/reduxTypes";
import { LotTypesList } from "./LotTypesList";
import { ModalServices } from "./ModalServices";
import { ModalLotType } from "./ModalLotType";
import { ModalConfirmLotTypes } from "./ModalConfirmLotTypes";
import { modalEnable, modalUpdate } from "../../actions/modal";

export const Create1 = () => {
  const dispatch = useDispatch();

  const {
    project: currentProject,
    types: { lotTypes },
    services,
  } = useSelector((state) => state);

  const [formFields, handleInputChange] = useForm(currentProject);

  const {
    name,
    description,
    manzanas,
    lots,
    associationName,
    notary,
    propertyScripture,
    propertyBook,
    scriptureDate,
    constitutiveScripture,
    constitutiveVolume,
  } = formFields;

  const { page } = currentProject;

  const [service, setService] = useState("");
  const [emptyFields, setEmptyFields] = useState([]);

  const [greenAreas, setGreenAreas] = useState(currentProject.greenAreas);

  useEffect(() => {
    dispatch(redirectSet(redTypes.projects, "/proyectos/nuevo"));
    dispatch(floatingButtonSet("pencil", redTypes.projectCreate));
  }, [dispatch]);

  const cancel = () => {
    const modalInfo = {
      title: "Cancelar creación de proyecto",
      text: null,
      link: "/proyectos",
      okMsg: "Sí",
      closeMsg: "No",
      type: redTypes.projectCreate,
    };

    dispatch(modalUpdate(modalInfo));
    dispatch(modalEnable());
  };

  const isFormValid = () => {
    if (checkEmptyFields(formFields)) {
      dispatch(setTempError("Los campos en rojo son obligatorios"));
      return false;
    }

    if (description.trim().length < 10) {
      if (description.trim().length === 0) {
        dispatch(setTempError("El proyecto debe de tener una descripción"));
      } else {
        dispatch(setTempError("La descripción es muy corta"));
      }
      return false;
    }
    if (Number(manzanas) === 0) {
      dispatch(setTempError("El proyecto debe tener al menos una manzana"));
      return false;
    }

    if (Number(manzanas) % 1 !== 0) {
      dispatch(setTempError("El número de manzanas debe ser un entero"));
      console.log(Number(manzanas));
      return false;
    }

    if (Number(lots) === 0) {
      dispatch(setTempError("El proyecto no tiene lotes"));
      return false;
    }

    if (Number(lots) % 1 !== 0) {
      dispatch(setTempError("El número de lotes debe ser un entero"));
      return false;
    }

    if (Number(manzanas) > Number(lots)) {
      dispatch(setTempError("No pueden haber más manzanas que lotes"));
      return false;
    }

    if (Number(manzanas) === Number(lots)) {
      dispatch(setTempError("No puede haber un lote por manzana"));
      return false;
    }

    if (!Number(manzanas) || !Number(lots)) {
      dispatch(setTempError("Valor(es) de lotes o manzanas no válido(s)"));
      return false;
    }

    // if (!services || services?.length === 0) {
    //     dispatch(setTempError('Debe agregar al menos un servicio'));
    //     return false;
    // }

    if (!lotTypes || lotTypes?.length === 0) {
      dispatch(setTempError("Debe agregar al menos un tipo de lote"));
      return false;
    }

    const emptyGreenAreas = [];
    let isValid = true;

    if (greenAreas.length > 0) {
      greenAreas.forEach((greenArea, index) => {
        if (greenArea.manzanaNum.trim().length === 0) {
          emptyGreenAreas.push("empty");
          setEmptyFields([...emptyFields, `greenArea${index}`]);
        }

        if (+manzanas < +greenArea.manzanaNum) {
          dispatch(
            setTempError(
              `El área verde en manzana ${greenArea.manzanaNum} no es válido`
            )
          );
          isValid = false;
        }
      });
    }

    if (emptyGreenAreas.length > 0) {
      return false;
    }

    if (!isValid) {
      return false;
    }

    dispatch(unSetError());
    return true;
  };

  const handleNextPage = () => {
    if (isFormValid()) {
      dispatch(projectSetPage(page + 1));
      dispatch(
        projectCreate({
          ...formFields,
          greenAreas,
        })
      );
    }
  };

  const handleDeleteService = (service) => {
    const modalInfo = {
      title: "Eliminar servicio",
      text: `Desea eliminar el servicio: ${service}`,
      input: "",
      okMsg: "Eliminar",
      closeMsg: "Cancelar",
    };

    setService(service);

    dispatch(projectEnableSvcModal());
    dispatch(projectUpdateSvcModal(modalInfo));
  };

  const handleAdd = (e) => {
    const modalInfo = {
      title: "Agregar servicio",
      text: ``,
      input: true,
      okMsg: "Agregar",
      closeMsg: "Cancelar",
    };

    dispatch(projectEnableSvcModal());
    dispatch(projectUpdateSvcModal(modalInfo));
  };

  const inputChange = (e) => {
    dispatch(projectCreate({ ...formFields, [e.target.name]: e.target.value }));
    handleInputChange(e);
    // checkEmptyFields({ ...formFields, [e.target.name]: e.target.value });
    checkEmptyField(e);
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

  const checkEmptyFields = (fields) => {
    const tempEmptyFields = [];

    for (let key in fields) {
      if (
        key === "manzanas" ||
        key === "lots" ||
        key === "associationName" ||
        key === "name" ||
        key === "description"
      ) {
        if (fields[key].toString().trim() === "") {
          tempEmptyFields.push(key);
        }
      }
    }

    setEmptyFields(tempEmptyFields);

    console.log(tempEmptyFields);

    return tempEmptyFields.length === 0 ? false : true;
  };

  const addGreenArea = () => {
    const newGreenArea = {
      manzanaNum: "",
    };

    setGreenAreas([...greenAreas, newGreenArea]);
    dispatch(
      projectCreate({
        ...formFields,
        greenAreas: [...currentProject.greenAreas, newGreenArea],
      })
    );
  };

  const handleChangeGreenArea = (index, e) => {
    console.log(index, e.target.name);

    checkEmptyField(e);

    const tempGreenAreas = greenAreas;

    console.log(tempGreenAreas);

    tempGreenAreas[index].manzanaNum = e.target.value;

    setGreenAreas(tempGreenAreas);

    dispatch(
      projectCreate({
        ...formFields,
        greenAreas: tempGreenAreas,
      })
    );
  };

  const deleteGreenArea = (index) => {
    greenAreas.splice(index, 1);
    setGreenAreas(greenAreas);

    dispatch(
      projectCreate({
        ...formFields,
        greenAreas,
      })
    );
  };

  return (
    <div className="pb-5 project create">
      <div className="project__header">
        <div className="left">
          <h3> Registro de Proyecto </h3>
        </div>
        {/* <div className="right">
                    Número de cliente {clients.length + 1}
                </div> */}
      </div>

      <div className="card edit mt-4">
        <div className="card__header">
          <img src="../assets/img/info.png" alt="" />
          <h4>Información General del Proyecto</h4>
        </div>
        <div className="card__body">
          <form className="right">
            <div
              className={`card__body__item ${
                emptyFields.includes("name") && "error"
              }`}
            >
              <label htmlFor="name">Nombre del Proyecto</label>
              <input
                autoFocus
                name="name"
                onChange={(e) => {
                  inputChange(e);
                }}
                value={name}
                type="text"
                autoComplete="off"
              />
            </div>
            <div
              className={`card__body__item ${
                emptyFields.includes("associationName") && "error"
              }`}
            >
              <label htmlFor="associationName">Asociación</label>
              <input
                autoFocus
                name="associationName"
                onChange={(e) => {
                  inputChange(e);
                }}
                value={associationName}
                type="text"
                autoComplete="off"
              />
            </div>
            <div
              className={`card__body__item description ${
                emptyFields.includes("description") && "error"
              }`}
            >
              <span htmlFor="description">Descripción del Proyecto</span>
              <textarea
                name="description"
                value={description}
                onChange={(e) => {
                  inputChange(e);
                }}
              ></textarea>
            </div>
            <div
              className={`card__body__item ${
                emptyFields.includes("notary") && "error"
              }`}
            >
              <label htmlFor="notary">Notario</label>
              <input
                autoFocus
                name="notary"
                onChange={(e) => {
                  inputChange(e);
                }}
                value={notary}
                type="text"
                autoComplete="off"
              />
            </div>
            <div
              className={`card__body__item ${
                emptyFields.includes("propertyScripture") && "error"
              }`}
            >
              <label htmlFor="propertyScripture">Número de escritura</label>
              <input
                autoFocus
                name="propertyScripture"
                onChange={(e) => {
                  inputChange(e);
                }}
                value={propertyScripture}
                type="text"
                autoComplete="off"
              />
            </div>
            <div
              className={`card__body__item ${
                emptyFields.includes("propertyBook") && "error"
              }`}
            >
              <label htmlFor="propertyBook">Número de libro</label>
              <input
                autoFocus
                name="propertyBook"
                onChange={(e) => {
                  inputChange(e);
                }}
                value={propertyBook}
                type="text"
                autoComplete="off"
              />
            </div>
            <div
              className={`card__body__item ${
                emptyFields.includes("scriptureDate") && "error"
              }`}
            >
              <label htmlFor="scriptureDate">Fecha de escrituración</label>
              <input
                autoFocus
                name="scriptureDate"
                onChange={(e) => {
                  inputChange(e);
                }}
                value={scriptureDate}
                type="text"
                autoComplete="off"
              />
            </div>
            <div
              className={`card__body__item ${
                emptyFields.includes("constitutiveScripture") && "error"
              }`}
            >
              <label htmlFor="constitutiveScripture">
                Escritura de acta constitutiva
              </label>
              <input
                autoFocus
                name="constitutiveScripture"
                onChange={(e) => {
                  inputChange(e);
                }}
                value={constitutiveScripture}
                type="text"
                autoComplete="off"
              />
            </div>
            <div
              className={`card__body__item ${
                emptyFields.includes("constitutiveVolume") && "error"
              }`}
            >
              <label htmlFor="constitutiveVolume">
                Volumen de acta constitutiva
              </label>
              <input
                autoFocus
                name="constitutiveVolume"
                onChange={(e) => {
                  inputChange(e);
                }}
                value={constitutiveVolume}
                type="text"
                autoComplete="off"
              />
            </div>
          </form>
          <div className="left">
            <div
              className={`card__body__item ${
                emptyFields.includes("lots") && "error"
              }`}
            >
              <label htmlFor="lots">Cantidad de lotes</label>
              <input
                autoFocus
                name="lots"
                onChange={(e) => {
                  inputChange(e);
                }}
                value={lots}
                type="number"
                autoComplete="off"
              />
            </div>
            <div
              className={`card__body__item ${
                emptyFields.includes("manzanas") && "error"
              }`}
            >
              <label htmlFor="manzanas">Número de Manzanas</label>
              <input
                autoFocus
                name="manzanas"
                onChange={(e) => {
                  inputChange(e);
                }}
                value={manzanas}
                type="text"
                autoComplete="off"
              />
            </div>
            <div className="card__header  mt-4">
              <img src="../assets/img/apple.png" alt="" />
              <h4>Áreas verdes</h4>
              <button onClick={addGreenArea} className="add-ref">
                Agregar
              </button>
            </div>
            {greenAreas.map((greenArea, index) => (
              <div
                key={`greenArea${index}`}
                className={`card__body__item ${
                  emptyFields.includes(`greenArea${index}`) && "error"
                }`}
              >
                <button
                  onClick={(e) => deleteGreenArea(index)}
                  className="delete-area"
                >
                  &times;
                </button>
                <label className="pl-2" htmlFor={`greenArea${index}`}>
                  Manzana para área verde
                </label>
                <input
                  autoFocus
                  name={`greenArea${index}`}
                  onChange={(e) => {
                    handleChangeGreenArea(index, e);
                  }}
                  value={greenArea.manzanaNum}
                  type="number"
                  autoComplete="off"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card-grid mt-2">
        <div className="card edit">
          <div className="card__header">
            <img src="../assets/img/services.png" alt="" />
            <h4>Servicios Disponibles</h4>
          </div>
          <div className="add">
            <button onClick={handleAdd} className="upload">
              Agregar servicio
            </button>
          </div>

          <div className="scroll">
            <div className="card__body__list">
              {services.map(
                (service) =>
                  service.length > 0 && (
                    <div
                      onClick={() => handleDeleteService(service)}
                      key={service}
                      className="card__body__list__doc"
                    >
                      <p>{service}</p>
                    </div>
                  )
              )}
            </div>
          </div>
        </div>

        <div className="card edit scroll">
          <div className="card__header">
            <img src="../assets/img/home.png" alt="" />
            <h4>Tipos de lotes</h4>
          </div>
          <div className="card__body__list">
            <LotTypesList />
          </div>
        </div>
      </div>

      <div className="form-buttons">
        <button className="cancel" onClick={cancel}>
          Cancelar
        </button>
        <button className="next" onClick={handleNextPage}>
          Siguiente
        </button>
      </div>

      <ModalServices service={service} />

      <ModalLotType />

      <ModalConfirmLotTypes />
    </div>
  );
};
