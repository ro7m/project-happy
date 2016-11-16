import createStore from 'redux/lib/createStore';

import rootReducer from './reducers/index';

const defaultState = {
  settings: JSON.parse(localStorage.settings) || {
    previd: null,
    playDuration: 2,
    postvid: {
      activity: 'Go Home'
    }
  },
  search: localStorage.lastQuery || '',
  playing: null
};

console.log('default', defaultState);

const store = createStore(rootReducer, defaultState);

export default store;
