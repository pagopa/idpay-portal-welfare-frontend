import {
  ErrorBoundary,
  LoadingOverlay,
  UnloadEventHandler,
  UserNotifyHandle,
} from '@pagopa/selfcare-common-frontend';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
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
import InitiativeRefundsOutcome from './pages/initiativeRefundsOutcome/initiativeRefundsOutcome';
import InitiativeRanking from './pages/initiativeRanking/initiativeRanking';
import InitiativeUserDetails from './pages/initiativeUserDetails/initiativeUserDetails';
import TOSWall from './components/TOS/TOSWall';
import TOSLayout from './components/TOSLayout/TOSLayout';
import TOS from './pages/tos/TOS';
import PrivacyPolicy from './pages/privacyPolicy/PrivacyPolicy';
import ChooseOrganization from './pages/ChooseOrganization/ChooseOrganization';
import useTCAgreement from './hooks/useTCAgreement';
import InitiativeRefundsDetails from './pages/initiativeRefundsDetails/initiativeRefundsDetails';
import InitiativeMerchant from './pages/initiativeMerchant/initiativeMerchant';
import InitiativeUploadMerchants from './pages/initiativeUploadMerchants/initiativeUploadMerchants';
import InitiativeMerchantDetail from './pages/initiativeMerchantDetail/initiativeMerchantDetail';

const SecuredRoutes = withLogin(
  withSelectedPartyProducts(() => {
    const userCanCreateInitiative = usePermissions(USER_PERMISSIONS.CREATE_INITIATIVE);
    const userCanUpdateInitiative = usePermissions(USER_PERMISSIONS.UPDATE_INITIATIVE);
    const location = useLocation();
    const { isTOSAccepted, acceptTOS, firstAcceptance } = useTCAgreement();

    if (
      isTOSAccepted === false &&
      location.pathname !== routes.PRIVACY_POLICY &&
      location.pathname !== routes.TOS
    ) {
      return (
        <TOSLayout>
          <TOSWall
            acceptTOS={acceptTOS}
            privacyRoute={routes.PRIVACY_POLICY}
            tosRoute={routes.TOS}
            firstAcceptance={firstAcceptance}
          />
        </TOSLayout>
      );
    } else if (
      typeof isTOSAccepted === 'undefined' &&
      location.pathname !== routes.PRIVACY_POLICY &&
      location.pathname !== routes.TOS
    ) {
      return <></>;
    }

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
          <Route path={routes.INITIATIVE_RANKING} exact={true}>
            <InitiativeRanking />
          </Route>
          <Route path={routes.INITIATIVE_USERS} exact={true}>
            <InitiativeUsers />
          </Route>
          <Route path={routes.INITIATIVE_REFUNDS} exact={true}>
            <InitiativeRefunds />
          </Route>
          <Route path={routes.INITIATIVE_REFUNDS_OUTCOME} exact={true}>
            <InitiativeRefundsOutcome />
          </Route>
          <Route path={routes.INITIATIVE_REFUNDS_DETAIL} exact={true}>
            <InitiativeRefundsDetails />
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
          <Route path={routes.INITIATIVE_USER_DETAILS} exact={true}>
            <InitiativeUserDetails />
          </Route>
          <Route path={routes.INITIATIVE_MERCHANT} exact={true}>
            <InitiativeMerchant />
          </Route>
          <Route path={routes.INITIATIVE_MERCHANT_DETAIL} exact={true}>
            <InitiativeMerchantDetail />
          </Route>
          <Route path={routes.INITIATIVE_MERCHANT_UPLOAD} exact={true}>
            <InitiativeUploadMerchants />
          </Route>
          <Route path={routes.TOS} exact={true}>
            <TOS />
          </Route>
          <Route path={routes.PRIVACY_POLICY} exact={true}>
            <PrivacyPolicy />
          </Route>
          <Route path={routes.CHOOSE_ORGANIZATION} exact={true}>
            {!userCanCreateInitiative ? <ChooseOrganization /> : <Redirect to={routes.HOME} />}
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
