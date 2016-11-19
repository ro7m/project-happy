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

export function loadMoreVideos() {
  return function(dispatch, getState) {
    let state = getState().search;
    dispatch(displayExtraResults(true));
    axios({
      url: 'https://www.googleapis.com/youtube/v3/search',
      method: 'get',
      params: {
        key: 'AIzaSyDZYAKp1cVowIRmnV4jXh_C2x0vDVLHvYU',
        part: 'snippet',
        type: 'video',
        q: state.results.query,
        videoDimension: '2d',
        videoEmbeddable: 'true',
        pageToken: state.results.nextPageToken
      }
    }).then( (res) => {
      let results = {
        query: state.results.query,
        nextPageToken: res.data.nextPageToken,
        items: res.data.items
      };
      dispatch(displayExtraResults(false, null, results));
    }).catch( (err) => {
      dispatch(displayExtraResults(false, err));
    });
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
      setTimeout( () => {
        dispatch(playVideo(videoId));
        setTimeout( () => {
          dispatch(displayImage(postvid.activity));
        }, playDuration * 60000);
      }, previd.duration * 60000);
    } else {
      dispatch(playVideo(videoId));
      setTimeout( () => {
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
  return {
    type: 'PLAY_VIDEO',
    videoId
  };
}
