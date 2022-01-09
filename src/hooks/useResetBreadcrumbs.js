import { useContext, useEffect } from "react";
import { AppContext } from "../AppContext";

export const useResetBreadcrumbs = (nav) => {
  const { setAppData } = useContext(AppContext);

  useEffect(() => {
    const setBreadcrumbs = () => {
      nav === "projects" &&
        setAppData((data) => ({ ...data, breadcrumbs: [] }));
    };

    setBreadcrumbs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
