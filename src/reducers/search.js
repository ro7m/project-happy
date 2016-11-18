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
    case 'LOAD_MORE_VIDEOS':
      if ( action.isLoading ) {
        return {
          status: 'load-more',
          results: state.results
        };
      } else if ( !action.isLoading && action.error ) {
        return state;
      } else {
        return {
          status: 'success',
          results: {
            query: action.results.query,
            nextPageToken: action.results.nextPageToken,
            items: state.results.items.concat(action.results.items)
          }
        };
      }
    default:
      return state;
  }
}

export default search;
