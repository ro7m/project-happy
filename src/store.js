import createStore from 'redux/lib/createStore';
import applyMiddleware from 'redux/lib/applyMiddleware';

import rootReducer from './reducers/index';
import thunkMiddleware from './middleware/thunkMiddleware';

const defaultState = {
  settings: {
    previd: null,
    playDuration: 2,
    postvid: {
      activity: 'Go Home'
    }
  },
  search: {
    status: 'new',
    results: []
  },
  playing: null
};

if (localStorage.settings) defaultState.settings = JSON.parse(localStorage.settings);

const store = createStore(
                rootReducer,
                defaultState,
                applyMiddleware(thunkMiddleware)
              );

export default store;
