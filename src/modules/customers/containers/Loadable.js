/**
 * Asynchronously loads the component for Customer Analytics
 */
import Loadable from 'react-loadable';

import LoadingIndicator from 'SharedComponents/loading-indicator';

export default Loadable({
  loader: () => import('.'),
  loading: LoadingIndicator,
});
