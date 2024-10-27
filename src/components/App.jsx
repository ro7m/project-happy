import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/components/connect';

import * as actionCreator from '../actions/actionCreator';

import Main from './Main.jsx';

function mapStateToProps(state) {
  return {
    settings: state.settings,
    search: state.search,
    screening: state.screening
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreator, dispatch);
}

export function initializeLockState() {
  return function(dispatch) {
    // Check if there's an existing lock
    if (getLockStateFromStorage()) {
      dispatch(lockApp());
      // Set up unlock timer
      const lockData = JSON.parse(localStorage.getItem('appLock'));
      const timeRemaining = LOCK_DURATION - (Date.now() - lockData.timestamp);
      if (timeRemaining > 0) {
        setTimeout(() => {
          dispatch(unlockApp());
        }, timeRemaining);
      } else {
        dispatch(unlockApp());
      }
    }
  };
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;
