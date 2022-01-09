import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  lotTypesModalConfirmUpdate,
  lotTypesModalEnable,
} from "../../actions/lotTypes";
import { LotTypeCard } from "./LotTypeCard";

export const LotTypesList = () => {
  const dispatch = useDispatch();

  const {
    types: { lotTypes },
  } = useSelector((state) => state);

  const handleOpenAdd = () => {
    dispatch(lotTypesModalConfirmUpdate({ action: false }));
    dispatch(lotTypesModalEnable());
  };

  return (
    <>
      <div className="add">
        <button onClick={handleOpenAdd} className="upload">
          Agregar tipo de lote
        </button>
      </div>
      {lotTypes?.map(({ type, sameArea, pricePerM, area, front, side }) => (
        <LotTypeCard
          key={type}
          type={type}
          sameArea={sameArea}
          pricePerM={pricePerM}
          area={area}
          front={front}
          side={side}
        />
      ))}
    </>
  );
};
