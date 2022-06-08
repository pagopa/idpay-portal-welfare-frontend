import { ErrorBoundary, LoadingOverlay } from '@pagopa/selfcare-common-frontend';
import UnloadEventHandler from '@pagopa/selfcare-common-frontend/components/UnloadEventHandler';
import Layout from './components/Layout/Layout';
import Initiative from './pages/Initiative/Initiative';

const App = () => (
  <ErrorBoundary>
    <Layout>
      <LoadingOverlay />
      <UnloadEventHandler />
      <Initiative />
    </Layout>
  </ErrorBoundary>
);

export default App;
