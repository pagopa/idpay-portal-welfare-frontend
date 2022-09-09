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

const SecuredRoutes = withLogin(
  withSelectedPartyProducts(() => (
    <Layout>
      <Switch>
        <Route path={routes.NEW_INITIATIVE} exact={true}>
          <NewInitiative />
        </Route>
        <Route path={routes.INITIATIVE} exact={true}>
          <NewInitiative />
        </Route>
        <Route path={routes.HOME} exact={true}>
          <InitiativeList />
        </Route>
        <Route path="*">
          <Redirect to={routes.HOME} />
        </Route>
      </Switch>
    </Layout>
  ))
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
