import {combineReducers} from 'redux';
import miniPlayerReducer from './miniPlayerReducer'
import syncTrackReducer from './syncTrackReducer'
import syncPausedReducer from './syncPausedReducer'
import syncLoadingReducer from './syncLoadingReducer'
import tabMeasurementReducer from './tabMeasurementReducer'

export default combineReducers({
  miniPlayerReducer,
  syncTrackReducer,
  syncPausedReducer,
  syncLoadingReducer,
  tabMeasurementReducer
  });