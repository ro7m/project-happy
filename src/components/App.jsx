import bindActionCreators from 'redux/lib/bindActionCreators';
import connect from 'react-redux/lib/components/connect';

import * as actionCreator from '../actions/actionCreator';

import Main from './Main.jsx';

function mapStateToProps(state) {
  return {
    settings: state.settings,
    search: state.search,
    playing: state.playing
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreator, dispatch);
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;
