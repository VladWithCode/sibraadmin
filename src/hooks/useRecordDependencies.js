import { useEffect, useState } from 'react';
import makeServerRequest from '../helpers/makeServerRequest';

export const useRecordDependencies = record => {
  const [lot, setLot] = useState();
  const [project, setProject] = useState();
  const [areDependenciesLoaded, setAreDependenciesLoaded] = useState(false);

  useEffect(() => {
    const getLot = async () => {
      const { status, lot } = await makeServerRequest('/lots/' + record.lot);

      if (status !== 'OK') return;

      setLot(lot);
    };
    const getProject = async () => {
      const { status, project } = await makeServerRequest(
        '/projects/' + record.project
      );

      if (status !== 'OK') return;

      setProject(project);
    };

    const fetchPromises = [];

    if (!lot || Object.keys(lot).length === 0) {
      fetchPromises.push(getLot());
    }

    if (!project || Object.keys(project).length === 0) {
      fetchPromises.push(getProject());
    }

    Promise.all(fetchPromises);
  }, [record]);

  useEffect(() => {
    if (lot && project) setAreDependenciesLoaded(true);
  }, [lot, project]);

  return [lot, project, areDependenciesLoaded];
};
