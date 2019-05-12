import {combineReducers} from 'redux';
import miniPlayerReducer from './miniPlayerReducer'
import syncTrackReducer from './syncTrackReducer'
import syncPausedReducer from './syncPausedReducer'
export default combineReducers({
  miniPlayerReducer,
  syncTrackReducer,
  syncPausedReducer
  });