import {TURNON, TURNOFF, SYNCTRACK, PAUSED, LOADING} from './type';

export const miniPlayerOn = () => ({type: TURNON})
export const miniPlayerOff = () => ({type: TURNOFF})
export const syncTrack = (track) => ({type: SYNCTRACK, payload: track})
export const syncPaused = (pauseState) => ({type: PAUSED, payload: pauseState})
export const syncLoading = (loadingState) => ({type: LOADING, payload: loadingState })