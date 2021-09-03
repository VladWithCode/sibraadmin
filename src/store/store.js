import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { breadcrumbsReducer } from '../reducers/breadcrumbsReducer';
import { clientReducer } from '../reducers/clientReducer';
import thunk from 'redux-thunk';

import { floatingButtonReducer, secondaryFloatingButtonReducer } from '../reducers/floatingButtonReducer';
import { lotReducer } from '../reducers/lotReducer';
import { modalReducer } from '../reducers/modalReducer';
import { editProjectReducer, projectReducer } from '../reducers/projectReducer';
import { redirectReducer } from '../reducers/redirectReducer';
import { uiReducer } from '../reducers/uiReducer';
import { lotTypesReducer } from '../reducers/lotTypeReducer';
import { manzanasReducer } from '../reducers/manzanasReducer';
import { newLotsReducer } from '../reducers/newLotsReducer';
import { servicesReducer } from '../reducers/servicesReducer';
import { consultingReducer, consultingLotsReducer, consultingClients } from '../reducers/consultingReducer';

import { paymentReducer } from '../reducers/paymentsReducer';
import { recordReducer } from '../reducers/recordsReducer';
import { historyActionsReducer } from '../reducers/historyActionReducer';

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const reducers = combineReducers({
    project: projectReducer,
    services: servicesReducer,
    lot: lotReducer,
    ui: uiReducer,
    client: clientReducer,
    modal: modalReducer,
    breadcrumbs: breadcrumbsReducer,
    floatingButton: floatingButtonReducer,
    secFloatingButton: secondaryFloatingButtonReducer,
    redirect: redirectReducer,
    types: lotTypesReducer,
    manzanas: manzanasReducer,
    newLots: newLotsReducer,
    projects: consultingReducer,
    lots: consultingLotsReducer,
    clients: consultingClients,
    projectEdit: editProjectReducer,
    paymentInfo: paymentReducer,
    records: recordReducer,
    historyActions: historyActionsReducer
})

export const store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware(thunk)
    )
);