const LOCK_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

// Helper functions to manage lock in localStorage
const getLockStateFromStorage = () => {
  const lockData = localStorage.getItem('appLock');
  if (!lockData) return false;

  const { timestamp, isLocked } = JSON.parse(lockData);
  if (!isLocked) return false;

  // Check if lock duration has expired
  const now = Date.now();
  const timeElapsed = now - timestamp;
  
  if (timeElapsed >= LOCK_DURATION) {
    localStorage.removeItem('appLock');
    return false;
  }
  
  return true;
};

const initialLockState = {
  isLocked: getLockStateFromStorage()
};

function lockReducer(state = initialLockState, action) {
  switch (action.type) {
    case 'LOCK_APP':
      // Save lock state and timestamp to localStorage
      localStorage.setItem('appLock', JSON.stringify({
        isLocked: true,
        timestamp: Date.now()
      }));
      return {
        isLocked: true
      };
    case 'UNLOCK_APP':
      localStorage.removeItem('appLock');
      return {
        isLocked: false
      };
    default:
      return state;
  }
}

export default lockReducer;
