export function updateSettings(newSettings) {
  return {
    type: 'UPDATE_SETTINGS',
    newSettings
  };
}

export function searchVideos(searchTerm) {
  return {
    type: 'SEARCH',
    searchTerm
  };
}

export function playVideo(videoId) {
  return {
    type: 'PLAY',
    videoId
  };
}
