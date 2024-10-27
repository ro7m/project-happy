import combineReducers from 'redux/lib/combineReducers';

import search from './search';
import settings from './settings';
import screening from './screening';
import lockReducer from './lockreducer';
const rootReducer = combineReducers({
  search,
  settings,
  screening,
  lock: lockReducer
});

export default rootReducer;
