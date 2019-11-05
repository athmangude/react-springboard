/* eslint-disable jsx-a11y/href-no-hash */
import Loadable from 'react-loadable';

import LoadingIndicator from 'SharedComponents/loading-indicator';

export default Loadable({
  loader: () => import('./index'),
  loading: LoadingIndicator,
});
