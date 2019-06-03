import TrackPlayer from 'react-native-track-player';
import store from '../redux/store';
import {syncPaused} from '../redux/actions'
import { onPressBack } from '../utils'
module.exports = async function() {

  TrackPlayer.addEventListener('remote-play', () => {
    TrackPlayer.play()
    store.dispatch(syncPaused(false))
  })

  TrackPlayer.addEventListener('remote-pause', () => {
    TrackPlayer.pause()
    store.dispatch(syncPaused(true))
  });

  TrackPlayer.addEventListener('remote-next', () => {
    TrackPlayer.skipToNext()
  });

  TrackPlayer.addEventListener('remote-previous', () => {
    onPressBack()
  });

  TrackPlayer.addEventListener('remote-stop', () => {
  });

};