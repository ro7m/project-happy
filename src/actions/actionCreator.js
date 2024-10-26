export function updateSettings(newSettings) {
  return {
    type: 'UPDATE_SETTINGS',
    newSettings
  };
}

export function searchVideos(searchTerm) {
  return function(dispatch) {
    dispatch(displayResults(true));
    // Store the search term in local storage as before
    localStorage.setItem('lastQuery', searchTerm);
    
    // Instead of calling the YouTube API, we update state with the embedded URL
    const results = {
      query: searchTerm,
      embedUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`
    };
    
    dispatch(displayResults(false, null, results));
  };
}

export function displayResults(isLoading, error, results) {
  return {
    type: 'DISPLAY_VIDEOS',
    isLoading,
    error,
    results
  };
}

export function loadMoreVideos() {
  return function(dispatch, getState) {
    // For embedding, we can simply reuse the original search term
    let state = getState().search;
    dispatch(displayExtraResults(true));
    
    // Embed URL remains the same, with no new pageToken parameter
    const results = {
      query: state.results.query,
      embedUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(state.results.query)}`
    };

    dispatch(displayExtraResults(false, null, results));
  };
}

export function displayExtraResults(isLoading, error, results) {
  return {
    type: 'LOAD_MORE_VIDEOS',
    isLoading,
    error,
    results
  };
}

export function startScreening(videoId) {
  return function(dispatch, getState) {
    let state = getState();
    let { previd, postvid, playDuration } = state.settings;

    if (previd) {
      dispatch(displayImage(previd.activity));
      setTimeout(() => {
        dispatch(playVideo(videoId));
        setTimeout(() => {
          dispatch(displayImage(postvid.activity));
        }, playDuration * 60000);
      }, previd.duration * 60000);
    } else {
      dispatch(playVideo(videoId));
      setTimeout(() => {
        dispatch(displayImage(postvid.activity));
      }, playDuration * 60000);
    }
  };
}

export function displayImage(activity) {
  const imgUrlLib = {
    'Draw': 'public/img/drawing.jpg',
    'Eat Snack': 'public/img/snack-time.jpg',
    'Francis': 'public/img/francis.jpg',
    'Schedule': 'public/img/schedule.jpeg',
    'Go Home': 'public/img/go-home.jpg'
  };

  let url = imgUrlLib[activity];
  return {
    type: 'DISPLAY_IMAGE',
    url
  };
}

export function playVideo(videoId) {
  // Update to use embedded video URL with iframe
  const embedUrl = `https://www.youtube.com/embed/${videoId}`;
  return {
    type: 'PLAY_VIDEO',
    embedUrl
  };
}
