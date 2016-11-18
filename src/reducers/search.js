function search(state={}, action) {
  switch (action.type) {
  case 'DISPLAY_VIDEOS':
    if ( action.isLoading ) {
      return {
        status:'loading'
      };
    } else if ( !action.isLoading && action.error) {
      return {
        status: 'error',
        error: action.error
      };
    } else {
      return {
        status: 'success',
        results: action.results
      };
    }
  default:
    return state;
  }
}

export default search;
