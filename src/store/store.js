import { createStore, combineReducers } from 'redux';
import { breadcrumbsReducer } from '../reducers/breadcrumbsReducer';
import { clientReducer } from '../reducers/clientReducer';
import { floatingButtonReducer } from '../reducers/floatingButtonReducer';
import { lotReducer } from '../reducers/lotReducer';
import { modalReducer } from '../reducers/modalReducer';
import { projectReducer } from '../reducers/projectReducer';
import { redirectReducer } from '../reducers/redirectReducer';
import { uiReducer } from '../reducers/uiReducer';

const reducers = combineReducers({
    project: projectReducer,
    lot: lotReducer,
    ui: uiReducer,
    client: clientReducer,
    modal: modalReducer,
    breadcrumbs: breadcrumbsReducer,
    floatingButton: floatingButtonReducer,
    redirect: redirectReducer
})

export const store = createStore(
    reducers,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);