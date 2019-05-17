import { TURNON, TURNOFF, SYNCTRACK, PAUSED, LOADING, SET_NEXTTRACK_LIST,APPEND_NEXTTRACK_LIST} from './type';

export const miniPlayerOn = () => ({ type: TURNON })
export const miniPlayerOff = () => ({ type: TURNOFF })
export const syncPaused = (pauseState) => ({ type: PAUSED, payload: pauseState })
export const syncLoading = (loadingState) => ({ type: LOADING, payload: loadingState })
export const syncTrack = (track) => ({ type: SYNCTRACK, payload: track })
export const addNextTracks = (list) => ({type: SET_NEXTTRACK_LIST, payload: list})
export const appendNextTracks = (list) => ({type: APPEND_NEXTTRACK_LIST, payload: list})