/**
 * Asynchronously loads the component for NotFoundPage
 */
import Loadable from 'react-loadable';

import LoadingIndicator from 'SharedComponents/loading-indicator';

export default Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
