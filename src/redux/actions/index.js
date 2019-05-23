import { TURNON, TURNOFF, SYNCTRACK, PAUSED, LOADING, SET_NEXTTRACK_LIST,
    APPEND_NEXTTRACK_LIST, AUTO_ON, AUTO_OFF, REPEAT_ON, REPEAT_OFF, 
    AUTO_REVERSE, REPEAT_REVERSE} from './type';

export const miniPlayerOn = () => ({ type: TURNON })
export const miniPlayerOff = () => ({ type: TURNOFF })
export const syncPaused = (pauseState) => ({ type: PAUSED, payload: pauseState })
export const syncLoading = (loadingState) => ({ type: LOADING, payload: loadingState })
export const syncTrack = (track) => ({ type: SYNCTRACK, payload: track })
export const setSuggestedNextTracks = (list) => ({type: SET_NEXTTRACK_LIST, payload: list})
export const appendNextTracks = (list) => ({type: APPEND_NEXTTRACK_LIST, payload: list})
export const repeatModeOn = () => ({type: REPEAT_ON} )
export const repeatModeOff = () => ({type: REPEAT_OFF})
export const repeatReverse = () => ({type: REPEAT_REVERSE})
export const autoModeOn = () => ({type: AUTO_ON} )
export const autoModeOff = () => ({type: AUTO_OFF} )
export const autoReverse = () => ({type: AUTO_REVERSE})
