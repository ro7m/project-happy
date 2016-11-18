function settings(state={}, action) {
  switch (action.type) {
    case 'UPDATE_SETTINGS':
      localStorage.setItem('settings', JSON.stringify(action.newSettings));
      return action.newSettings;
    default:
      return state;
  }
}

export default settings;
