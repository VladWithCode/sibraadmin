import { useEffect, useContext } from 'react';
import { AppContext } from '../AppContext';
import { types } from '../types';

export const usePushBreadcrumbs = (type, dispName, link) => {

    const { appData: { projectsBreadcrumbs }, setAppData } = useContext(AppContext);

    useEffect(() => {

        const exists = projectsBreadcrumbs.find(e => e.link === link);

        const setBreadcrumbs = () => {
            if(!exists){
                type === types.projects && setAppData(data => ({ ...data, projectsBreadcrumbs: [...projectsBreadcrumbs, { dispName, link }] }))
            }
            return;
        }

        setBreadcrumbs();
        // eslint-disable-next-line react-hooks/exhaustive-deps       
    }, [link])

}
