const initialLockState = {
  isLocked: false
};

function lockReducer(state = initialLockState, action) {
  switch (action.type) {
    case 'LOCK_APP':
      return {
        isLocked: true
      };
    case 'UNLOCK_APP':
      return {
        isLocked: false
      };
    default:
      return state;
  }
}

export default lockReducer;
