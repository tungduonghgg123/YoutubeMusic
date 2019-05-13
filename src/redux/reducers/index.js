import {combineReducers} from 'redux';
import miniPlayerReducer from './miniPlayerReducer'
import syncTrackReducer from './syncTrackReducer'
import syncPausedReducer from './syncPausedReducer'
import syncLoadingReducer from './syncLoadingReducer'


export default combineReducers({
  miniPlayerReducer,
  syncTrackReducer,
  syncPausedReducer,
  syncLoadingReducer,
  });