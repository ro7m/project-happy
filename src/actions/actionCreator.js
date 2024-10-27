import axios from 'axios';

const PIPED_INSTANCE = 'https://pipedapi.kavin.rocks';
const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export function updateSettings(newSettings) {
  return {
    type: 'UPDATE_SETTINGS',
    newSettings
  };
}

export function lockApp() {
  return {
    type: 'LOCK_APP'
  };
}

export function unlockApp() {
  return {
    type: 'UNLOCK_APP'
  };
}

export function searchVideos(searchTerm) {
  return function(dispatch, getState) {
    const state = getState();
    if (state.lock.isLocked || getLockStateFromStorage()) {
      return; // Don't allow search while app is locked
    }

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
    const state = getState();
    if (state.lock.isLocked) {
      return; // Don't allow loading more while app is locked
    }

    const currentPage = parseInt(state.search.results.nextPageToken) || 1;
    
    dispatch(displayExtraResults(true));
    axios({
      url: `${PIPED_INSTANCE}/search`,
      method: 'get',
      params: {
        q: state.search.results.query,
        filter: 'videos'
      }
    }).then((res) => {
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
        query: state.search.results.query,
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
    const state = getState();
    if (state.lock.isLocked || getLockStateFromStorage()  ) {
      return; // Don't allow starting new videos while app is locked
    }

    let { previd, postvid, playDuration } = state.settings;

    if (previd) {
      dispatch(displayImage(previd.activity));
      setTimeout(() => {
        dispatch(playVideo(videoId));
        setTimeout(() => {
          dispatch(displayImage(postvid.activity));
          dispatch(lockApp());
          // Set timer to unlock after 5 minutes
          setTimeout(() => {
            dispatch(unlockApp());
          }, LOCK_DURATION);
        }, playDuration * 60000);
      }, previd.duration * 60000);
    } else {
      dispatch(playVideo(videoId));
      setTimeout(() => {
        dispatch(displayImage(postvid.activity));
        dispatch(lockApp());
        // Set timer to unlock after 5 minutes
        setTimeout(() => {
          dispatch(unlockApp());
        }, LOCK_DURATION);
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
