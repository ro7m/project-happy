import axios from 'axios';

const PIPED_INSTANCE = 'https://pipedapi.kavin.rocks'; // This instance supports CORS

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
      url: `${PIPED_INSTANCE}/search`,
      method: 'get',
      params: {
        q: searchTerm,
        filter: 'videos'
      }
    }).then((res) => {
      localStorage.setItem('lastQuery', searchTerm);
      // Transform the Piped response to match YouTube API format
      const transformedItems = res.data.items
        .filter(item => item.type === 'stream')
        .map(item => ({
          id: { videoId: item.url.split('watch?v=')[1] },
          snippet: {
            title: item.title,
            description: item.description || '',
            thumbnails: {
              default: { url: item.thumbnail },
              medium: { url: item.thumbnail },
              high: { url: item.thumbnail }
            },
            channelTitle: item.uploaderName
          }
        }));
      
      let results = {
        query: searchTerm,
        nextPageToken: '2',
        items: transformedItems
      };
      dispatch(displayResults(false, null, results));
    }).catch((err) => {
      console.error('Search error:', err);
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
      url: `${PIPED_INSTANCE}/search`,
      method: 'get',
      params: {
        q: state.results.query,
        filter: 'videos'
      }
    }).then((res) => {
      // Transform the Piped response to match YouTube API format
      const transformedItems = res.data.items
        .filter(item => item.type === 'stream')
        .map(item => ({
          id: { videoId: item.url.split('watch?v=')[1] },
          snippet: {
            title: item.title,
            description: item.description || '',
            thumbnails: {
              default: { url: item.thumbnail },
              medium: { url: item.thumbnail },
              high: { url: item.thumbnail }
            },
            channelTitle: item.uploaderName
          }
        }));

      let results = {
        query: state.results.query,
        nextPageToken: (currentPage + 1).toString(),
        items: transformedItems
      };
      dispatch(displayExtraResults(false, null, results));
    }).catch((err) => {
      console.error('Load more error:', err);
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
