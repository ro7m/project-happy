import combineReducers from 'redux/lib/combineReducers';

import search from './search';
import settings from './settings';
import playing from './playing';

const rootReducer = combineReducers({
  search,
  settings,
  playing
});

export default rootReducer;
