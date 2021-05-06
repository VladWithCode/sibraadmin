import React, { useState } from 'react';
import { AppContext } from './AppContext';
import { AppRouter } from './router/AppRouter';


export const MainApp = () => {

    const [appData, setAppData] = useState({
        modalActive: false,
        modalType: '',
        projectsBreadcrumbs: [],
        clientsBreadcrumbs: [],
        historyBreadcrumbs: [],

    })

    return (
        <AppContext.Provider value={{appData, setAppData}}  >
            <AppRouter />
        </AppContext.Provider >
    )
}
