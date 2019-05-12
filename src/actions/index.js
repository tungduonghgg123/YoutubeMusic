import {TURNON, TURNOFF, SYNCTRACK, PAUSED} from './type';

export const miniPlayerOn = () => ({type: TURNON})
export const miniPlayerOff = () => ({type: TURNOFF})
export const syncTrack = (track) => ({type: SYNCTRACK, payload: track})
export const syncPaused = (pauseState) => ({type: PAUSED, payload: pauseState})