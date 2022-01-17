import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Clients } from '../components/clients/Clients';
import { Client } from '../components/clients/Client';
import { CreateClient } from '../components/clients/CreateClient';
import { History } from '../components/history/History';
import { Lot } from '../components/lots/Lot';
import { NavBar } from '../components/NavBar';
import { Projects } from '../components/projects/Projects';
import { Project } from '../components/projects/Project';
import { Settings } from '../components/settings/Settings';
import { CreateProject } from '../components/projects/CreateProject';
import { EditProject } from '../components/projects/EditProject';
import { ModalConfirm } from '../components/ModalConfirm';
import { FloatingButton } from '../components/FloatingButton';
import { UiError } from '../components/UiError';
import { useSelector } from 'react-redux';
import { ClientAddDocuments } from '../components/clients/ClientAddDocuments';
import { ClientEdit } from '../components/clients/ClientEdit';
import { ProjectAddDocuments } from '../components/projects/ProjectAddDocuments';
import { LotEdit } from '../components/lots/LotEdit';
import { BuyLot } from '../components/lots/BuyLot';
import { Payment } from '../components/lots/Payment';
import { PayExtraCharge } from '../components/history-globals/PayExtraCharge';
import { CommissionPut } from '../components/clients/ComissionPut';
import { CancelRecord } from '../components/history-globals/CancelRecord';
import { UpdateRecord } from '../components/history-globals/UpdateRecord';
import { Templates } from '../components/templates/Templates';
import { Template } from '../components/templates/Template';

export const AppRouter = () => {
  const { loading } = useSelector(state => state.ui);

  return (
    <Router>
      <>
        <>
          <NavBar />
          <FloatingButton />
          <ModalConfirm />
          <UiError />
        </>

        <div className='app'>
          <Switch>
            <Route exact path='/' component={Projects}></Route>
            <Route exact path='/proyectos' component={Projects}></Route>
            <Route
              exact
              path='/proyectos/ver/:projectId'
              component={Project}></Route>
            <Route
              exact
              path='/proyectos/nuevo'
              component={CreateProject}></Route>
            <Route
              exact
              path='/proyectos/editar/:projectId'
              component={EditProject}></Route>
            <Route
              exact
              path='/proyectos/doc/:projectId'
              component={ProjectAddDocuments}></Route>

            <Route exact path='/clientes' component={Clients}></Route>
            <Route
              exact
              path='/clientes/ver/:clientId'
              component={Client}></Route>
            <Route
              exact
              path='/clientes/nuevo'
              component={CreateClient}></Route>
            <Route
              exact
              path='/clientes/docs/:clientId'
              component={ClientAddDocuments}></Route>
            <Route
              exact
              path='/clientes/edit/:clientId'
              component={ClientEdit}></Route>

            <Route
              exact
              path='/proyectos/ver/:projectId/lote/:lotId'
              component={Lot}></Route>
            <Route
              exact
              path='/proyectos/edit/:projectId/lote/:lotId'
              component={LotEdit}></Route>

            <Route
              exact
              path='/proyectos/comprar/:projectId/lote/:lotId'
              component={BuyLot}></Route>

            <Route
              exact
              path='/historial/abonar/:projectId/lote/:lotId'
              component={Payment}></Route>
            <Route exact path='/historial' component={History}></Route>
            <Route
              exact
              path='/historial/extras/abonar/:extraChargeId/:recordId'
              component={PayExtraCharge}></Route>
            <Route
              exact
              path='/historial/comision/editar/:recordId'
              component={CommissionPut}></Route>

            <Route
              exact
              path='/historial/cancelar/:recordId'
              component={CancelRecord}></Route>

            <Route
              exact
              path='/historial/editar/:recordId'
              component={UpdateRecord}></Route>

            <Route exact path='/ajustes' component={Settings}></Route>

            <Route exact path='/plantillas' component={Templates}></Route>

            <Route
              exact
              path='/plantillas/:projectId'
              component={Template}></Route>

            <Redirect to='/proyectos'></Redirect>
          </Switch>
        </div>

        {loading && (
          <div className='loading-screen'>
            <div className='lds-ring'>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
            <span></span>
          </div>
        )}
      </>
    </Router>
  );
};
