import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../AppContext';
import { Link } from 'react-router-dom';
import { types } from '../types';

export const BreadCrumbs = ({ nav }) => {

    const { appData } = useContext(AppContext);

    const [breadcrumbsData, setBreadcrumbsData] = useState({
        type: nav,
        breadcrumbs: []
    });


    useEffect(() => {
        const breadcrumbs = nav === types.projects ? appData.projectsBreadcrumbs : nav === types.clients ? appData.clientsBreadcrumbs : appData.historyBreadcrumbs;
        setBreadcrumbsData(data => ({ ...data, breadcrumbs }))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const { breadcrumbs } = breadcrumbsData;

    const handleBreadcrumbs = times => {

        const breadcrumbs = nav === types.projects ? appData.projectsBreadcrumbs : nav === types.clients ? appData.clientsBreadcrumbs : appData.historyBreadcrumbs;
        for (times in breadcrumbs) {
            breadcrumbs.pop();
        }

        setBreadcrumbsData(data => ({ ...data, breadcrumbs }));
    }

    return (
        <div className="breadcrumbs" >
            {
                breadcrumbs.map((e, index) => (
                    <Link className="breadcrumbs__item" onClick={() => handleBreadcrumbs(index)} key={`lot:${e.dispName}`} to={e.link} ><i>&#60;</i><span>{e.dispName}</span> </Link>
                ))
            }
        </div>
    )
}
