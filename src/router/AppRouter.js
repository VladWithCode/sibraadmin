import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from "react-router-dom";
import { Clients } from "../components/clients/Clients";
import { Client } from "../components/clients/Client";
import { History } from "../components/history/History";
import { Lot } from "../components/lots/Lot";
import { NavBar } from "../components/NavBar";
import { Projects } from "../components/projects/Projects";
import { Project } from "../components/projects/Project";
import { Settings } from "../components/settings/Settings";
import { CreateProject } from "../components/projects/CreateProject";
import { EditProject } from "../components/projects/EditProject";
import { ModalConfirm } from "../components/ModalConfirm";
import { FloatingButton } from "../components/FloatingButton";
export const AppRouter = () => {

    return (
        <Router>
            <>
                <>
                    <NavBar />
                        <FloatingButton />
                        <ModalConfirm />
                </>

                <div className="app">
                    <Switch >
                        <Route exact path="/proyectos" component={Projects} ></Route>
                        <Route exact path="/proyectos/ver/:projectId" component={Project} ></Route>
                        <Route exact path="/proyectos/nuevo" component={CreateProject} ></Route>
                        <Route exact path="/proyectos/editar/:projectId" component={EditProject}  ></Route>


                        <Route exact path="/clientes" component={Clients} ></Route>
                        <Route exact path="/cliente/:clientId" component={Client} ></Route>

                        <Route exact path="/proyectos/ver/:projectId/lote/:lotId" component={Lot} ></Route>

                        <Route exact path="/ajustes" component={Settings} ></Route>
                        <Route exact path="/historial" component={History} ></Route>

                        <Redirect to="/proyectos" ></Redirect>
                    </Switch>
                </div>

            </>
        </Router>
    )
}