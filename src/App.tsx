import {
  ErrorBoundary,
  LoadingOverlay,
  UnloadEventHandler,
  UserNotifyHandle,
} from '@pagopa/selfcare-common-frontend';
import { Redirect, Route, Switch } from 'react-router-dom';
import withLogin from './decorators/withLogin';
import Layout from './components/Layout/Layout';
import routes from './routes';
import NewInitiative from './pages/newInitiative/newInitiative';
import InitiativeList from './pages/initiativeList/InitiativeList';
import withSelectedPartyProducts from './decorators/withSelectedPartyProducts';
import Auth from './pages/auth/Auth';
import InitiativeOverview from './pages/initiativeOverview/initiativeOverview';
import InitiativeUsers from './pages/initiativeUsers/initiativeUsers';
import InitiativeRefunds from './pages/initiativeRefunds/initiativeRefunds';
import InitiativeDetail from './pages/initiativeDetail/initiativeDetail';

import { USER_PERMISSIONS } from './utils/constants';
import { usePermissions } from './hooks/usePermissions';
import Assistance from './pages/assistance/assistance';

const SecuredRoutes = withLogin(
  withSelectedPartyProducts(() => {
    const userCanCreateInitiative = usePermissions(USER_PERMISSIONS.CREATE_INITIATIVE);
    const userCanUpdateInitiative = usePermissions(USER_PERMISSIONS.UPDATE_INITIATIVE);

    return (
      <Layout>
        <Switch>
          <Route path={routes.NEW_INITIATIVE} exact={true}>
            {userCanCreateInitiative ? <NewInitiative /> : <Redirect to={routes.HOME} />}
          </Route>
          <Route path={routes.INITIATIVE} exact={true}>
            {userCanUpdateInitiative ? <NewInitiative /> : <Redirect to={routes.HOME} />}
          </Route>
          <Route path={routes.INITIATIVE_OVERVIEW} exact={true}>
            <InitiativeOverview />
          </Route>
          <Route path={routes.INITIATIVE_USERS} exact={true}>
            <InitiativeUsers />
          </Route>
          <Route path={routes.INITIATIVE_REFUNDS} exact={true}>
            <InitiativeRefunds />
          </Route>
          <Route path={routes.INITIATIVE_DETAIL} exact={true}>
            <InitiativeDetail />
          </Route>
          <Route path={routes.HOME} exact={true}>
            <InitiativeList />
          </Route>
          <Route path={routes.ASSISTANCE} exact={true}>
            <Assistance />
          </Route>
          <Route path="*">
            <Redirect to={routes.HOME} />
          </Route>
        </Switch>
      </Layout>
    );
  })
);

const App = () => (
  <ErrorBoundary>
    <LoadingOverlay />
    <UserNotifyHandle />
    <UnloadEventHandler />
    <Switch>
      <Route path={routes.AUTH}>
        <Auth />
      </Route>
      <Route path="*">
        <SecuredRoutes />
      </Route>
    </Switch>
  </ErrorBoundary>
);

export default App;
