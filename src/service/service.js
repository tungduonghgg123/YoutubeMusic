import TrackPlayer from 'react-native-track-player';
import store from '../redux/store';
import {syncPaused} from '../redux/actions'
import { onPressBack, playSuggestedNextVideo, onPressPause, onPressPlay } from '../utils'
module.exports = async function() {

  TrackPlayer.addEventListener('remote-play', () => {
    onPressPlay()
  })

  TrackPlayer.addEventListener('remote-pause', () => {
    onPressPause()
  });
  TrackPlayer.addEventListener('remote-next', () => {
    playSuggestedNextVideo()
  });

  TrackPlayer.addEventListener('remote-previous', () => {
    onPressBack()
  });
  TrackPlayer.addEventListener('remote-stop', () => {
    console.log('Destroy player will be supported in the future')
  });

};