import React, { useState } from 'react';
import { AppContext } from './AppContext';
import { AppRouter } from './router/AppRouter';
import { Provider } from 'react-redux';
import { store } from './store/store';

export const MainApp = () => {

    const [appData, setAppData] = useState({
        modalActive: false,
        modalType: '',
        projectsBreadcrumbs: [],
        clientsBreadcrumbs: [],
        historyBreadcrumbs: [],

    })

    return (
        <Provider store={ store }>
            <AppContext.Provider value={{ appData, setAppData }}  >

                <AppRouter />

            </AppContext.Provider >
        </Provider>
    )
}
