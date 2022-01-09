import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { lotTypesModalConfirmReset } from "../../actions/lotTypes";
import { manzanasSet } from "../../actions/manzanas";
import { projectSetPage } from "../../actions/project";
import {
  setTempError,
  setTempWarning,
  unSetError,
  unSetWarning,
} from "../../actions/ui";

export const Create2 = () => {
  const {
    project,
    project: { lots, page, greenAreas },
    types: { lotTypes },
  } = useSelector((state) => state);
  const state = useSelector((state) => state);

  const dispatch = useDispatch();

  const handlePrevPage = () => {
    dispatch(lotTypesModalConfirmReset());
    dispatch(projectSetPage(page - 1));
  };

  const [manzanas, setManzanas] = useState([]);
  const [formValues, setFormValues] = useState([]);
  const [error, setError] = useState(null);
  const [typesErrors, setTypesErrors] = useState([]);
  const [cornersErrors, setCornersErrors] = useState([]);

  let countLots = +lots;
  state.manzanas.forEach((m) => (countLots -= +m.lots));

  const [remainingLots, setRemainingLots] = useState(countLots);

  useEffect(() => {
    const comparingLotTypes = state.manzanas[0]?.lotTypes.map(
      ({ type, sameArea, pricePerM, cornerPrice }) => ({
        type,
        sameArea,
        pricePerM,
        cornerPrice,
      })
    );

    let lotsHaveChanged = false;

    for (let key in comparingLotTypes) {
      if (comparingLotTypes[key].toString() !== lotTypes[key].toString()) {
        lotsHaveChanged = true;
      }
    }

    if (
      +project.manzanas === state.manzanas.length + greenAreas.length &&
      state.manzanas.length + greenAreas.length >= 1 &&
      !lotsHaveChanged
    ) {
      setFormValues([...state.manzanas]);
      setManzanas([...state.manzanas]);

      dispatch(manzanasSet([...state.manzanas]));

      const typesErrors = state.manzanas.map((manzana) => ({
        manzana: manzana.num,
        error: false,
      }));

      const cornersErrors = state.manzanas.map((manzana) => ({
        manzana: manzana.num,
        error: false,
      }));

      let counter = 0;
      let counterTypes = 0;

      state.manzanas.forEach((manzana) => {
        counter += Number(manzana.lots);

        manzana.lotTypes.forEach((lotType) => {
          counterTypes += +lotType.quantity;
        });

        if (+manzana.corners > +manzana.lots) {
          setCornersErrors(
            cornersErrors.map((cornerError) => {
              if (cornerError.manzana === manzana.num) {
                cornerError.error = true;
              }
              return cornerError;
            })
          );
        } else {
          setCornersErrors(
            cornersErrors.map((cornerError) => {
              if (cornerError?.manzana === manzana.num) {
                cornerError.error = false;
              }
              return cornerError;
            })
          );
        }

        if (+counterTypes > +manzana.lots) {
          setTypesErrors(
            typesErrors.map((typeError) => {
              if (typeError?.manzana === manzana.num) {
                typeError.error = true;
                typeError.completed = true;
              }
              return typeError;
            })
          );
        }

        if (+counterTypes === +manzana.lots) {
          setTypesErrors(
            typesErrors.map((typeError) => {
              if (typeError?.manzana === manzana.num) {
                typeError.error = false;
                typeError.completed = true;
              }
              return typeError;
            })
          );
        } else {
          setTypesErrors(
            typesErrors.map((typeError) => {
              if (typeError?.manzana === manzana.num) {
                typeError.error = false;
                typeError.completed = false;
              }
              return typeError;
            })
          );
        }

        counterTypes = 0;
      });

      if (counter > lots) {
        setError(`Has excedido el número de lotes (${+lots} lotes)`);
      }
    } else {
      const newArr = [];
      const greenAreasNums = greenAreas.map((ga) => +ga.manzanaNum);
      let counter = 1;

      console.log("areas nums", greenAreasNums);

      for (let i = 1; i <= +project.manzanas - greenAreasNums.length; i++) {
        while (greenAreasNums.includes(counter)) {
          counter++;
        }

        newArr.push({
          num: counter,
          lots: "",
          lotTypes: lotTypes.map((lotType) => ({ ...lotType, quantity: "" })),
          corners: "",
          lotsErr: null,
        });

        counter++;
      }
      setFormValues(newArr);
      setManzanas(newArr);

      dispatch(manzanasSet(newArr));

      setTypesErrors(
        newArr.map((manzana) => ({
          manzana: manzana.num,
          error: false,
          completed: true,
        }))
      );

      setCornersErrors(
        newArr.map((manzana) => ({
          manzana: manzana.num,
          error: false,
        }))
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, lots, project.manzanas, lotTypes]);

  const handleLotsChange = ({ value }, num) => {
    let counter = 0;
    let counterTypes = 0;

    setFormValues(
      formValues.map((manzana) => {
        if (manzana.num === num) {
          manzana.lotTypes.forEach((lotType) => {
            counterTypes += +lotType.quantity;
          });
          manzana.lots = value;
        }

        counter += Number(manzana.lots);
        return manzana;
      })
    );

    if (counter > lots) {
      setError(true);
      dispatch(
        setTempError(`Has excedido el número de lotes (${+lots} lotes)`)
      );
    } else {
      setError(false);
      dispatch(unSetError());
    }

    setRemainingLots(lots - counter);

    dispatch(manzanasSet(formValues));

    if (+counterTypes > +counter) {
      setTypesErrors(
        typesErrors.map((typeError) => {
          if (typeError?.manzana === num) {
            typeError.error = true;
            typeError.completed = true;
          }
          return typeError;
        })
      );
      dispatch(
        setTempError(
          `Has excedido el número de lotes de la manzana ${num} (${counter} lotes)`
        )
      );
    }

    if (+counterTypes === +counter) {
      setTypesErrors(
        typesErrors.map((typeError) => {
          if (typeError?.manzana === num) {
            typeError.error = false;
            typeError.completed = true;
          }
          return typeError;
        })
      );
      dispatch(unSetError());
      dispatch(unSetWarning());
    }
  };

  const handlelotTypeChange = ({ value }, type, num) => {
    let counter = 0;
    let currentLots;

    setFormValues(
      formValues.map((manzana) => {
        if (manzana.num === num) {
          currentLots = manzana.lots;

          manzana.lotTypes.map((lotType) => {
            if (lotType.type === type) {
              lotType.quantity = value;
            }

            counter += +lotType.quantity;
            return lotType;
          });
        }
        return manzana;
      })
    );

    if (+counter > +currentLots) {
      setTypesErrors(
        typesErrors.map((typeError) => {
          if (typeError?.manzana === num) {
            typeError.error = true;
            typeError.completed = true;
          }
          return typeError;
        })
      );
      dispatch(
        setTempError(
          `Has excedido el número de lotes de la manzana ${num} (${+currentLots} lotes)`
        )
      );
    } else if (+counter === +currentLots) {
      setTypesErrors(
        typesErrors.map((typeError) => {
          if (typeError?.manzana === num) {
            typeError.error = false;
            typeError.completed = true;
          }
          return typeError;
        })
      );
      dispatch(unSetError());
      dispatch(unSetWarning());
    } else {
      setTypesErrors(
        typesErrors.map((typeError) => {
          if (typeError?.manzana === num) {
            typeError.error = false;
            typeError.completed = false;
          }
          return typeError;
        })
      );
      dispatch(
        setTempWarning(
          `Faltan lotes por registrar (${+currentLots - counter} lotes)`
        )
      );
    }

    dispatch(manzanasSet(formValues));
  };

  const isFormValid = () => {
    let counter = 0;

    formValues.forEach((manzana) => (counter += Number(manzana.lots)));

    if (counter !== +lots) {
      dispatch(
        setTempError(`Faltan ${Number(lots) - +counter} lotes por registrar`)
      );
      setError(true);
      return "error";
    }

    if (formValues.find((manzana) => +manzana.lots === 0)) {
      dispatch(setTempError(`No puede haber manzanas sin lotes`));
      return "error";
    }

    if (error) {
      return false;
    }

    if (typesErrors.find(({ error }) => error)) {
      return false;
    }

    if (typesErrors.find((typeError) => !typeError.completed)) {
      dispatch(setTempWarning(`Faltan lotes por registrar`));
      return "error";
    }

    return true;
  };

  const handleNextPage = () => {
    if (isFormValid()) {
      if (isFormValid() !== "error") {
        dispatch(manzanasSet(formValues));
        dispatch(projectSetPage(page + 1));
      }
    } else {
      dispatch(setTempError("Debe llenar todos los campos y no tener errores"));
    }
  };

  const handleCornerChange = ({ value }, num) => {
    let counter = 0;
    let currentManzana;

    setFormValues(
      formValues.map((manzana) => {
        if (manzana.num === num) {
          manzana.corners = value;
          currentManzana = manzana;
          counter += Number(manzana.corners);
        }

        return manzana;
      })
    );

    if (counter > currentManzana.lots) {
      setCornersErrors(
        cornersErrors.map((cornerError) => {
          if (cornerError.manzana === num) {
            cornerError.error = true;
          }
          return cornerError;
        })
      );
      dispatch(
        setTempError(
          `No puede haber más esquinas que lotes (${+currentManzana.lots} lotes)`
        )
      );
    } else {
      setCornersErrors(
        cornersErrors.map((cornerError) => {
          if (cornerError.manzana === num) {
            cornerError.error = false;
          }
          return cornerError;
        })
      );
      dispatch(unSetError());
    }

    dispatch(manzanasSet(formValues));
  };

  return (
    <div className="pb-5 project create">
      <div className="project__header">
        <div className="left">
          <h3> Registro de Manzanas </h3>
        </div>
        <div className="right lots">
          <span className="lots">Lotes totales: {lots}</span>
          <span className="lots">Lotes restantes: {remainingLots}</span>
        </div>
      </div>

      <div className="card-grid">
        {manzanas.map(({ num, lots, corners }, index) => (
          <div className="card edit" key={num}>
            <div className="card__header">
              <img src="../assets/img/apple.png" alt="" />
              <h4>Manzana {num}</h4>
            </div>

            <div className="card__body">
              <div className="full">
                <div className={`${error && "error"} card__body__item `}>
                  <label htmlFor={`manzana${num}-lots`}>Numero de lotes:</label>
                  <input
                    onChange={(e) => {
                      handleLotsChange(e.target, num);
                    }}
                    type="number"
                    name={`manzana${num}-lots`}
                    value={lots}
                  />
                </div>
                {
                  // manzanas[0].lotTypes?.length > 1 && (
                  manzanas[index].lotTypes.map(({ type, quantity }, index) => (
                    <div
                      key={type}
                      className={`${
                        typesErrors?.find(
                          (typeError) => typeError.manzana === num
                        )?.error && "error"
                      } ${
                        typesErrors?.find(
                          (typeError) => typeError.manzana === num
                        )?.completed
                          ? "completed"
                          : "warning"
                      } card__body__item `}
                    >
                      <label htmlFor={`manzana${num}-type-${type}`}>
                        Número de lotes tipo "{type.toUpperCase()}":
                      </label>
                      <input
                        onChange={(e) =>
                          handlelotTypeChange(e.target, type, num, index)
                        }
                        type="number"
                        name={`manzana${num}-type-${type}`}
                        value={quantity}
                      />
                    </div>
                  ))
                  // )
                }
                <div
                  className={`${
                    cornersErrors?.find(
                      (cornerError) => cornerError.manzana === num
                    )?.error && "error"
                  } card__body__item `}
                >
                  <label htmlFor={`manzana${num}-corners`}>
                    Número de lotes en equinas
                  </label>
                  <input
                    onChange={(e) => handleCornerChange(e.target, num)}
                    type="number"
                    name={`manzana${num}-corners`}
                    value={corners}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="project-create-btns mt-5">
        <button onClick={handlePrevPage} className="btn btn-cancel">
          Anterior
        </button>
        <button onClick={handleNextPage} className="btn btn-next">
          Siguiente
        </button>
      </div>
    </div>
  );
};
