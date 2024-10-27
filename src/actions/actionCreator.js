import axios from 'axios';

const PIPED_INSTANCES = [
  'https://pipedapi.kavin.rocks'
];

// Constants for lock functionality
const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds
const LOCK_STORAGE_KEY = 'appLockUntil';

// Utility function to check if app is locked
function isAppLocked() {
  const lockUntil = localStorage.getItem(LOCK_STORAGE_KEY);
  if (!lockUntil) return false;
  return Date.now() < parseInt(lockUntil);
}

// Utility function to set app lock
function lockApp() {
  const lockUntil = Date.now() + LOCK_DURATION;
  localStorage.setItem(LOCK_STORAGE_KEY, lockUntil.toString());
  return lockUntil;
}

async function fetchWithFallback(path, params) {
  // Check if app is locked before making any requests
  if (isAppLocked()) {
    const lockUntil = parseInt(localStorage.getItem(LOCK_STORAGE_KEY));
    const remainingTime = Math.ceil((lockUntil - Date.now()) / 1000 / 60);
    throw new Error(`App is locked for ${remainingTime} more minutes`);
  }

  let lastError = null;
  for (const instance of PIPED_INSTANCES) {
    try {
      const response = await axios({
        url: `${instance}${path}`,
        method: 'get',
        params,
        timeout: 5000
      });
      localStorage.setItem('preferredPipedInstance', instance);
      return response;
    } catch (error) {
      console.error(`Failed with instance ${instance}:`, error);
      lastError = error;
      continue;
    }
  }
  throw lastError || new Error('All Piped instances failed');
}

function getPreferredInstance() {
  return localStorage.getItem('preferredPipedInstance') || PIPED_INSTANCES[0];
}

// Action creator for app lock state
export function setAppLockState(isLocked, lockUntil = null) {
  return {
    type: 'SET_APP_LOCK',
    isLocked,
    lockUntil
  };
}

export function updateSettings(newSettings) {
  return {
    type: 'UPDATE_SETTINGS',
    newSettings
  };
}

export function searchVideos(searchTerm) {
  return async function(dispatch) {
    // Check if app is locked
    if (isAppLocked()) {
      const lockUntil = parseInt(localStorage.getItem(LOCK_STORAGE_KEY));
      const remainingTime = Math.ceil((lockUntil - Date.now()) / 1000 / 60);
      dispatch(displayResults(false, new Error(`App is locked for ${remainingTime} more minutes`)));
      return;
    }

    dispatch(displayResults(true));
    try {
      const res = await fetchWithFallback('/search', {
        q: searchTerm,
        filter: 'videos'
      });

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
        nextPageToken: res.data.nextpage,
        items: transformedItems
      };
      dispatch(displayResults(false, null, results));
    } catch (err) {
      console.error('Search error:', err);
      dispatch(displayResults(false, err));
    }
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
  return async function(dispatch, getState) {
    // Check if app is locked
    if (isAppLocked()) {
      const lockUntil = parseInt(localStorage.getItem(LOCK_STORAGE_KEY));
      const remainingTime = Math.ceil((lockUntil - Date.now()) / 1000 / 60);
      dispatch(displayExtraResults(false, new Error(`App is locked for ${remainingTime} more minutes`)));
      return;
    }

    let state = getState().search;
    
    if (!state.results?.nextPageToken) {
      console.log('No more videos to load');
      return;
    }
    
    dispatch(displayExtraResults(true));
    try {
      const res = await fetchWithFallback('/search', {
        q: state.results.query,
        filter: 'videos',
        nextpage: state.results.nextPageToken
      });

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
        nextPageToken: res.data.nextpage,
        items: transformedItems
      };
      dispatch(displayExtraResults(false, null, results));
    } catch (err) {
      console.error('Load more error:', err);
      dispatch(displayExtraResults(false, err));
    }
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
    // Check if app is locked
    if (isAppLocked()) {
      const lockUntil = parseInt(localStorage.getItem(LOCK_STORAGE_KEY));
      const remainingTime = Math.ceil((lockUntil - Date.now()) / 1000 / 60);
      dispatch({ type: 'SCREENING_ERROR', error: `App is locked for ${remainingTime} more minutes` });
      return;
    }

    let state = getState();
    let { previd, postvid, playDuration } = state.settings;

    if (previd) {
      dispatch(displayImage(previd.activity));
      setTimeout(() => {
        dispatch(playVideo(videoId));
        setTimeout(() => {
          dispatch(displayImage(postvid.activity));
          // Lock the app after the timer ends
          const lockUntil = lockApp();
          dispatch(setAppLockState(true, lockUntil));
        }, playDuration * 60000);
      }, previd.duration * 60000);
    } else {
      dispatch(playVideo(videoId));
      setTimeout(() => {
        dispatch(displayImage(postvid.activity));
        // Lock the app after the timer ends
        const lockUntil = lockApp();
        dispatch(setAppLockState(true, lockUntil));
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
