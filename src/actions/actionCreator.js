import axios from 'axios';

export function updateSettings(newSettings) {
  return {
    type: 'UPDATE_SETTINGS',
    newSettings
  };
}

export function searchVideos(searchTerm) {
  return function(dispatch) {
    dispatch(displayResults(true));
    axios({
      url: 'https://www.googleapis.com/youtube/v3/search',
      method: 'get',
      params: {
        key: 'AIzaSyDZYAKp1cVowIRmnV4jXh_C2x0vDVLHvYU',
        part: 'snippet',
        type: 'video',
        q: searchTerm,
        videoDimension: '2d',
        videoEmbeddable: 'true'
      }
    }).then( (res) => {
      localStorage.setItem('lastQuery', searchTerm);
      let results = {
        query: searchTerm,
        nextPageToken: res.data.nextPageToken,
        items: res.data.items
      };
      dispatch(displayResults(false, null, results));
    }).catch( (err) => {
      dispatch(displayResults(false, err));
    });
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

export function playVideo(videoId) {
  return {
    type: 'PLAY',
    videoId
  };
}
