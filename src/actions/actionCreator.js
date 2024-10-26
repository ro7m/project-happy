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
      url: 'https://invidious.snopyta.org/api/v1/search',
      method: 'get',
      params: {
        q: searchTerm,
        type: 'video',
        sort_by: 'relevance',
        page: 1
      }
    }).then((res) => {
      localStorage.setItem('lastQuery', searchTerm);
      // Transform the Invidious response to match YouTube API format
      const transformedItems = res.data.map(item => ({
        id: { videoId: item.videoId },
        snippet: {
          title: item.title,
          description: item.description,
          thumbnails: {
            default: { url: item.videoThumbnails[0].url },
            medium: { url: item.videoThumbnails[4].url },
            high: { url: item.videoThumbnails[2].url }
          },
          channelTitle: item.author
        }
      }));
      
      let results = {
        query: searchTerm,
        nextPageToken: '2', // Invidious uses page numbers instead of tokens
        items: transformedItems
      };
      dispatch(displayResults(false, null, results));
    }).catch((err) => {
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
    const currentPage = parseInt(state.results.nextPageToken) || 1;
    
    dispatch(displayExtraResults(true));
    axios({
      url: 'https://invidious.snopyta.org/api/v1/search',
      method: 'get',
      params: {
        q: state.results.query,
        type: 'video',
        sort_by: 'relevance',
        page: currentPage
      }
    }).then((res) => {
      // Transform the Invidious response to match YouTube API format
      const transformedItems = res.data.map(item => ({
        id: { videoId: item.videoId },
        snippet: {
          title: item.title,
          description: item.description,
          thumbnails: {
            default: { url: item.videoThumbnails[0].url },
            medium: { url: item.videoThumbnails[4].url },
            high: { url: item.videoThumbnails[2].url }
          },
          channelTitle: item.author
        }
      }));

      let results = {
        query: state.results.query,
        nextPageToken: (currentPage + 1).toString(),
        items: transformedItems
      };
      dispatch(displayExtraResults(false, null, results));
    }).catch((err) => {
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
  return {
    type: 'PLAY_VIDEO',
    videoId
  };
}
