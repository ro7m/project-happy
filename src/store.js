import createStore from 'redux/lib/createStore';
import compose from 'redux/lib/compose';
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
  screening: null
};

if (localStorage.settings) defaultState.settings = JSON.parse(localStorage.settings);

const enhancers = compose(
  window.devToolsExtension ?
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(thunkMiddleware)) :
  applyMiddleware(thunkMiddleware)
);

const store = createStore(
                rootReducer,
                defaultState,
                enhancers
              );

export default store;
