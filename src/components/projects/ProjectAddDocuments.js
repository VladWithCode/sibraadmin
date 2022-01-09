import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { getProject } from "../../actions/consults";
import { useForm } from "../../hooks/useForm";
import { redTypes } from "../../types/reduxTypes";
import {
  setTempSuccessNotice,
  uiStartLoading,
  uiFinishLoading,
  setTempError,
} from "../../actions/ui";
import { redirectSet } from "../../actions/redirect";
import { floatingButtonSet } from "../../actions/floatingButton";
import { modalUpdate, modalEnable } from "../../actions/modal";
import { staticURL } from "../../url";
import {
  projectEnableSvcModal,
  projectUpdateSvcModal,
  projectSet,
} from "../../actions/project";
import { ModalDoc } from "../ModalDoc";

export const ProjectAddDocuments = () => {
  // const { projectEdit: project, projects } = useSelector(state => state);
  const { projectEdit: project } = useSelector((state) => state);
  const dispatch = useDispatch();
  const { projectId } = useParams();
  // const currentProject = projects.find(p => p._id === projectId);

  const { name, associationName, description, files } = project;

  const [filesDoc, setFilesDoc] = useState({
    file: null,
    avFile: null,
  });

  const [filesNames, handleInputChange, reset] = useForm({
    fileName: "",
  });

  const { fileName } = filesNames;

  const [fileInfo, setFileInfo] = useState({
    fileName: "",
    type: "",
  });

  const [extraCharges, setExtraCharges] = useState(project.extraCharges);

  const [emptyFields, setEmptyFields] = useState([]);

  useEffect(() => {
    dispatch(redirectSet(redTypes.projects, `/proyectos/doc/${projectId}`));
    dispatch(floatingButtonSet("pencil", redTypes.projectCreate));
  }, [dispatch, projectId]);

  const onFileInput = (e, type) => {
    setFilesDoc({ ...filesDoc, [type]: e.target.files[0] });
  };

  const uploadFile = async (file, name) => {
    dispatch(uiStartLoading());

    const newForm = new FormData();

    newForm.set("file", file);
    newForm.set("fileName", name);

    const url = `${staticURL}/projects/${projectId}/file`;

    await fetch(url, {
      // Your POST endpoint
      method: "PUT",
      body: newForm,
    })
      .then(
        (response) => {
          console.log(response);
          return response.json();
        } // if the response is a JSON object
      )
      .then(
        (success) => {
          console.log(success);
          dispatch(uiFinishLoading());
          dispatch(setTempSuccessNotice(`Archivo ${name} agregado con éxito`));
          dispatch(getProject(success.project._id));
        } // Handle the success response object
      )
      .catch(
        (error) => {
          console.log(error);
          dispatch(uiFinishLoading());
        } // Handle the error response object
      );

    reset();

    const inputFile = document.querySelector(`[name=file]`);
    inputFile.value = null;
  };

  const handleNext = async () => {
    console.log(isFormValid());

    if (isFormValid()) {
      dispatch(uiStartLoading());

      const res = await postData();

      dispatch(uiFinishLoading());

      if (res.status === "OK") {
        const modalInfo = {
          title: `Terminar registro`,
          text: "Proyecto actualizado con éxito",
          link: `/proyectos/ver/${projectId}`,
          okMsg: "Terminar",
          closeMsg: "Cancelar",
          type: redTypes.projectCreate,
        };

        dispatch(modalUpdate(modalInfo));
        dispatch(modalEnable());

        dispatch(getProject(projectId));
        // dispatch(projectSet(res.project));
      } else {
        dispatch(setTempError("Ha ocurrido un error"));
      }
    }
  };

  const postData = () => {
    const data = {
      chargesData: extraCharges,
    };

    const url = `${staticURL}/projects/${projectId}/extra-charges`;

    const res = fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log("data", data);
        return data;
      })
      .catch((err) => {
        console.log(err);
        // dispatch(uiFinishLoading());
      });

    return res;
  };

  const isFormValid = () => {
    checkEmptyFields();

    if (checkEmptyFields()) {
      return false;
    }

    return true;
  };

  const handleDeleteFile = (fileName, type) => {
    const modalInfo = {
      title: "Eliminar documento",
      text: `¿Desea eliminar el documento: ${fileName}?`,
      input: null,
      okMsg: "Eliminar",
      closeMsg: "Cancelar",
    };

    setFileInfo({ fileName, type });

    dispatch(projectEnableSvcModal());
    dispatch(projectUpdateSvcModal(modalInfo));
  };

  const addExtraCharge = () => {
    const newRef = {
      title: "",
      description: "",
      amount: "",
    };

    setExtraCharges([...extraCharges, newRef]);
    dispatch(
      projectSet({ ...project, extraCharges: [...extraCharges, newRef] })
    );
  };

  const deleteExtraCharge = (index) => {
    extraCharges.splice(index, 1);
    setExtraCharges(extraCharges);
    dispatch(projectSet({ ...project, extraCharges }));
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

  const handleChangeExtraCharge = (index, e, key) => {
    checkEmptyField(e);

    const tempRefsArr = extraCharges;

    tempRefsArr[index][key] = e.target.value;

    setExtraCharges(tempRefsArr);
    dispatch(projectSet({ ...project, extraCharges: tempRefsArr }));
  };

  const checkEmptyFields = () => {
    const tempEmptyFields = [];

    extraCharges.forEach((ref, index) => {
      for (let key in ref) {
        if (key !== "description") {
          if (ref[key].toString().trim() === "") {
            tempEmptyFields.push(`${key}${index}`);
            dispatch(setTempError("Los campos en rojo son obligatorios"));
          }
        }
      }
    });

    setEmptyFields(tempEmptyFields);

    return tempEmptyFields.length === 0 ? false : true;
  };

  return (
    <div className="pb-5 project create">
      <ModalDoc
        fileName={fileInfo.fileName}
        type={fileInfo.type}
        id={project._id}
      />

      {project._id && (
        <>
          <div className="project__header">
            <div className="left">
              <h3> Subida de documentos </h3>
            </div>
          </div>

          <div className="card edit mt-4">
            <div className="card__header">
              <img src="../assets/img/info.png" alt="" />
              <h4>Información del Pryecto</h4>
            </div>
            <div className="card__body">
              <div className="right">
                <div className="card__body__item">
                  <span>Nombre del Proyecto</span>
                  <p> {name} </p>
                </div>
                <div className="card__body__item">
                  <span>Asociación</span>
                  <p> {associationName} </p>
                </div>
                <div className="card__body__item description">
                  <span>Descripción del Proyecto</span>
                  <p> {description} </p>
                </div>
                <div className="mt-3 card__header">
                  <img src="../assets/img/docs.png" alt="" />
                  <h4>Documentos Disponibles</h4>
                </div>
                <input
                  onInput={(e) => {
                    onFileInput(e, "file");
                  }}
                  type="file"
                  name="file"
                />
                <div className="file-form mt-2">
                  <div className={`card__body__item`}>
                    <label htmlFor="fileName">Nombre del Archivo</label>
                    <input
                      type="text"
                      name="fileName"
                      onChange={handleInputChange}
                      value={fileName}
                    />
                  </div>
                  <button
                    disabled={
                      fileName.length >= 3 && filesDoc.file ? false : true
                    }
                    className="upload"
                    onClick={(e) => {
                      uploadFile(filesDoc.file, fileName);
                    }}
                  >
                    {" "}
                    Subir archivo
                  </button>
                </div>

                <div className="scroll mt-3">
                  <div className="card__body__list">
                    {files.map(({ name }) => (
                      <div
                        onClick={() => {
                          handleDeleteFile(name, redTypes.project);
                        }}
                        key={name}
                        className="card__body__list__doc"
                      >
                        <p>{name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="left">
                <div className="card__header">
                  <img src="../assets/img/services.png" alt="" />
                  <h4>Cargos Extras</h4>
                  <button onClick={addExtraCharge} className="add-ref">
                    Agregar cargo extra
                  </button>
                </div>
                {extraCharges?.map((extraCharge, index) => (
                  <div key={`extraCharge${index}`}>
                    <div className=" mt-4 card__header">
                      <h4>Cargo Extra {index + 1}</h4>
                      <button
                        onClick={() => deleteExtraCharge(index)}
                        className="add-ref delete"
                      >
                        Eliminar cargo
                      </button>
                    </div>
                    <div
                      className={`card__body__item ${
                        emptyFields.includes(`title${index}`) && "error"
                      } mt-4`}
                    >
                      <label htmlFor={`title${index}`}>Nombre del cargo</label>
                      <input
                        autoFocus
                        name={`title${index}`}
                        value={extraCharge.title}
                        type="text"
                        autoComplete="off"
                        onChange={(e) =>
                          handleChangeExtraCharge(index, e, "title")
                        }
                      />
                    </div>
                    <div
                      className={`card__body__item ${
                        emptyFields.includes(`amount${index}`) && "error"
                      }`}
                    >
                      <label htmlFor={`amount${index}`}>Cantidad</label>
                      <input
                        autoFocus
                        name={`amount${index}`}
                        value={extraCharge.amount}
                        type="number"
                        autoComplete="off"
                        onChange={(e) =>
                          handleChangeExtraCharge(index, e, "amount")
                        }
                      />
                    </div>
                    <div
                      className={`card__body__item description extra ${
                        emptyFields.includes(`description${index}`) && "error"
                      }`}
                    >
                      <span htmlFor={`description${index}`}>
                        Descripción del cargo
                      </span>
                      <textarea
                        name={`description${index}`}
                        value={extraCharge.description}
                        onChange={(e) =>
                          handleChangeExtraCharge(index, e, "description")
                        }
                      ></textarea>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="form-buttons">
            <button onClick={handleNext} className="next">
              Terminar registro
            </button>
          </div>
        </>
      )}
    </div>
  );
};
