import combineReducers from 'redux/lib/combineReducers';

import search from './search';
import settings from './settings';
import screening from './screening';

const rootReducer = combineReducers({
  search,
  settings,
  screening
});

export default rootReducer;
