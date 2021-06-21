import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { breadcrumbsReducer } from '../reducers/breadcrumbsReducer';
import { clientReducer } from '../reducers/clientReducer';
import thunk from 'redux-thunk';

import { floatingButtonReducer } from '../reducers/floatingButtonReducer';
import { lotReducer } from '../reducers/lotReducer';
import { modalReducer } from '../reducers/modalReducer';
import { projectReducer } from '../reducers/projectReducer';
import { redirectReducer } from '../reducers/redirectReducer';
import { uiReducer } from '../reducers/uiReducer';
import { lotTypesReducer } from '../reducers/lotTypeReducer';

const composeEnhancers = (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const reducers = combineReducers({
    project: projectReducer,
    lot: lotReducer,
    ui: uiReducer,
    client: clientReducer,
    modal: modalReducer,
    breadcrumbs: breadcrumbsReducer,
    floatingButton: floatingButtonReducer,
    redirect: redirectReducer,
    types: lotTypesReducer
})

export const store = createStore(
    reducers,
    composeEnhancers(
        applyMiddleware(thunk)
    )
);