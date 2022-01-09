import React from "react";
import { useSelector } from "react-redux";

export const UiError = () => {
  const { msgError, msgWarning, msgSuccess } = useSelector((state) => state.ui);

  return (
    <>
      {msgError && <span className="uiError">{msgError}</span>}
      {msgWarning && <span className="uiError warning">{msgWarning}</span>}
      {msgSuccess && <span className="uiError success">{msgSuccess}</span>}
    </>
  );
};
