import {combineReducers} from 'redux';
import miniPlayerReducer from './miniPlayerReducer'


export default combineReducers({
    miniPlayer : miniPlayerReducer
  });