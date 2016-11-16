import React from 'react';
import { render } from 'react-dom';
import Provider from 'react-redux/lib/components/Provider';

import store from './store';
import App from './components/App.jsx';

render(
  <Provider store={store} >
    <App />
  </Provider>
  , document.getElementById('application'));
