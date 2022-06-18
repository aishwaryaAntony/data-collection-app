import React, { Component } from "react";
// import Layout from "./Layout/Layout";
import Clients from "./screens/adminScreens/Clients";
import CaseManager from "./screens/adminScreens/Casemanagers";
import Rbts from "./screens/adminScreens/Rbts";
import Programs from "./screens/adminScreens/Programs";
import Login from "./ Components/Login";
import Category from "./screens/adminScreens/Category";
import SubCategory from "./screens/adminScreens/SubCategory";
import { BrowserRouter, Switch, Redirect } from 'react-router-dom';
import MainLayout from "../src/layout/MainLayout";
import LoginLayout from "../src/layout/LoginLayout";
import PresentationLayout from "../src/layout/PresentationLayout"
import NotFound from "../src/layout/NotFound";
import ViewClient from "./screens/adminScreens/ViewClient";
import ClientDashBoard from './screens/ClientScreens/DashBoard';
import RBTDashBoard from './screens/RbtScreens/DashBoard';
import CaseManagerDashBoard from './screens/CaseManagerScreens/DashBoard'
import CaseMangerClients from "./screens/CaseManagerScreens/CaseManagerClients";
import RBTClients from "./screens/RbtScreens/RbtClients";
import RbtViewClients from "./screens/RbtScreens/ViewClient"
import CaseManagerViewClient from "./screens/CaseManagerScreens/ViewClient"
import ClientProgram from "./screens/ClientScreens/ClientProgram";
import SchedulesCalender from "./screens/RbtScreens/SchedulesCalender";
import ViewClientPrograms from "./screens/adminScreens/ViewClientPrograms"


class App extends Component {
  constructor() {
    super();
    this.state = {

    }
  }

  // async componentDidMount() {
  // 	const token = localStorage.getItem('token');
  // 	if (token !== null) {
  // 		store.dispatch(authenticate());
  // 	} else {
  // 		store.dispatch(unauthenticate());
  // 	}
  // }

  render() {
    return (
      <div>	<BrowserRouter>
        <Switch>
          <LoginLayout
            exact
            path="/"
            layout={LoginLayout}
            component={Login}>
          </LoginLayout>
          <LoginLayout
            exact
            path="/notFound"
            layout={LoginLayout}
            component={NotFound}>
          </LoginLayout>
          <PresentationLayout
            exact
            path="/clients"
            layout={MainLayout}
            component={Clients}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/caseManager"
            layout={MainLayout}
            component={CaseManager}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/rbts"
            layout={MainLayout}
            component={Rbts}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/programs"
            layout={MainLayout}
            component={Programs}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/programs/categories"
            layout={MainLayout}
            component={Category}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/programs/categories/subCategory"
            layout={MainLayout}
            component={SubCategory}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/viewClient"
            layout={MainLayout}
            component={ViewClient}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/admin/viewClientPrograms"
            layout={MainLayout}
            component={ViewClientPrograms}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/clientDashBoard"
            layout={MainLayout}
            component={ClientDashBoard}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/rbtDashBoard"
            layout={MainLayout}
            component={RBTDashBoard}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/rbts/clients"
            layout={MainLayout}
            component={RBTClients}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/caseManagerDashBoard"
            layout={MainLayout}
            component={CaseManagerDashBoard}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/caseManager/clients"
            layout={MainLayout}
            component={CaseMangerClients}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/rbt/viewClients"
            layout={MainLayout}
            component={RbtViewClients}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/caseManager/viewClients"
            layout={MainLayout}
            component={CaseManagerViewClient}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/clientProgram"
            layout={MainLayout}
            component={ClientProgram}>
          </PresentationLayout>
          <PresentationLayout
            exact
            path="/scheduleCalender"
            layout={MainLayout}
            component={SchedulesCalender}>
          </PresentationLayout>
          <Redirect to="/notFound" />
        </Switch>
      </BrowserRouter>
      </div>
    )
  }
}
export default App;