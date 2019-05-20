import {combineReducers} from 'redux';
import miniPlayerReducer from './miniPlayerReducer'
import syncTrackReducer from './syncTrackReducer'
import syncPausedReducer from './syncPausedReducer'
import syncLoadingReducer from './syncLoadingReducer'
import syncNextTrackListReducer from './syncNextTrackListReducer'
import { syncRepeatMode, syncAutoMode} from './syncMode'
export default combineReducers({
  miniPlayerReducer,
  syncTrackReducer,
  syncPausedReducer,
  syncLoadingReducer,
  syncNextTrackListReducer,
  syncRepeatMode,
  syncAutoMode
  });