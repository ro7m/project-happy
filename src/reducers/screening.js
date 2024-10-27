function screening(state={}, action) {
  switch (action.type) {
    case 'DISPLAY_IMAGE':
      return {
        status: 'image',
        url: action.url
      };
    case 'PLAY_VIDEO':
      return {
        status: 'playing',
        id: action.videoId
      };  
    default:
      return state;
  }
}

export default screening;
