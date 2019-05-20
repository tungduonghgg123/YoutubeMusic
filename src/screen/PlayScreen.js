import React, { Component } from 'react';
import { StatusBar, Button, SafeAreaView, Text, View, ScrollView, BackHandler, Alert } from 'react-native';
// import Spinner from 'react-native-loading-spinner-overlay';
import TrackPlayer from 'react-native-track-player';
import memoize from "memoize-one";

import {
  Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl, Spinner,
  SquareItem, ItemsListHorizontal
} from '../commonComponents'
import { BACKGROUND_COLOR } from '../style'
//redux
import { connect } from 'react-redux';
import * as actions from '../redux/actions'
import { getTrackQueue, getTrackPlayerState, isCloseToEdge, getTrackDetails, getNextVideos } from '../utils'


function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class PlayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      autoOn: true,
      repeatOn: false,
      mode: 'youtube',
      nextPageToken: '',
      isLoading: false,
      isFocused: true
    };
    this.shouldQueueEndedEventRun = true;
    this.props.miniPlayerOff();
  }
  onPressPause() {
    TrackPlayer.pause();
    this.props.syncPaused(true)
  }
  onPressPlay() {
    TrackPlayer.play();
    this.props.syncPaused(false)
  }
  onPressRepeat() {
    this.props.repeatReverse();
    // if(this.props.repeatOn){
    //   this.props.autoModeOff()
    // }
  }
  onPressAuto() {
    this.props.autoReverse();
    // if(this.props.autoOn){
    //   this.props.repeatModeOff()
    // }
  }
  onDownPress() {
    // console.log('called')
    //   console.log(this.props.navigation.state.routeName)
    this.props.navigation.goBack();
    this.props.miniPlayerOn();
    return true;
  }
  async onPressBack() {
    await TrackPlayer.skipToPrevious();
  }
  playSuggestedNextVideo() {
    if (this.props.listItem[0] && this.props.listItem[0].id) {
      let videoId = this.props.listItem[0].id;
      this.memoizedLoad(videoId)
    }
  }
  memoizedLoad = memoize(async (videoId) => {
    if (!videoId)
      return;
    /**
     * pause Track Player before loading and playing new Track.
     *  */
    this.onPressPause()
    this.props.syncLoading(true)
    let track = await getTrackDetails(videoId)
    this.addAndPlay(track)
  })
  async addAndPlay(track) {
    if (track && track.id) {
      await TrackPlayer.add(track)
      /**
       * skip to this `track` by using `track id`
       */
      await TrackPlayer.skip(track.id)
      this.onPressPlay();
    }
  }
  componentWillUnmount() {
    this.onTrackChange.remove();
    this.onQueueEnded.remove();
    this.onPlaybackStateChange.remove();
    this.onHardwareBack.remove();
    BackHandler.removeEventListener('hardwareBackPress', () => {
      this.onHardwareBackPress();
    }
    );
  }
  playFromYoutube(videoId) {
    if (videoId) {
      this.memoizedLoad(videoId)
    } else {
      this.memoizedLoad(this.props.navigation.getParam('videoId'));
    }
  }
  async getSuggestedNextTracks(relatedToVideoId, maxResults, pageToken) {
    this.setState({ isLoading: true });
    let { nextVideos, nextPageToken } = await getNextVideos(relatedToVideoId, maxResults, pageToken);
    this.props.appendNextTracks(nextVideos);
    this.setState({
      nextPageToken: nextPageToken,
      isLoading: false
    })
  }
  async componentDidMount() {
    this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
      // if (data.nextTrack === 'helperTrack') {
      //   console.log('helper track ON')
      //   return;
      // }
      // console.log('---------------------')
      // console.log('track changed')
      // getTrackQueue()
      let track = await TrackPlayer.getTrack(data.nextTrack);
      /**
       * sync track to redux store:
       */
      if (track) {
        this.props.syncTrack(track)
        this.props.setSuggestedNextTracks([])
        this.getSuggestedNextTracks(data.nextTrack, 7)
        this.props.syncPaused(false)
      } else {
        this.props.syncPaused(true)
      }
    });
    this.onQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', async (data) => {
      if (!this.shouldQueueEndedEventRun)
        return;
      let currentPos = await TrackPlayer.getPosition();
      let duration = await this.props.track.duration;

      if ( duration - currentPos > 1) {
        let buffered = await TrackPlayer.getBufferedPosition();
        currentPos = await TrackPlayer.getPosition()
        while (buffered < currentPos) {
          console.log('auto re-buffering')
          TrackPlayer.play();
          this.shouldQueueEndedEventRun = false;
          TrackPlayer.play();
          await timeout(20000);
          TrackPlayer.play();
          this.shouldQueueEndedEventRun = true;
          buffered = await TrackPlayer.getBufferedPosition();
          currentPos = await TrackPlayer.getPosition()
        }
        return;
      }
      if (this.props.repeatOn) {
        TrackPlayer.seekTo(0);
        this.onPressPlay()
        return;
      }
      if (this.props.autoOn) {
        this.playSuggestedNextVideo()
        return;
      }
      this.props.syncPaused(true)
    });
    this.onPlaybackStateChange = TrackPlayer.addEventListener('playback-state', async (playbackState) => {
      getTrackPlayerState()
      switch (playbackState.state) {
        case TrackPlayer.STATE_NONE:
          this.onPressPlay()
          break;
        case TrackPlayer.STATE_PLAYING:
          this.props.syncLoading(false)
        break;
        // case TrackPlayer.STATE_PAUSED:
        //   console.log('paused')
        //   break;
        // case TrackPlayer.STATE_BUFFERING:
        //   console.log('buffering')
        //   /**
        //    * `iOS handler` when Track Player are busy `buffering` 
        //    */
        //   // if(this.prevPlaybackState === 'playing'){
        //   //   let helperTrack = {
        //   //     id: 'helperTrack', 
        //   //     url: 'somellink',
        //   //     title: 'helper Title', 
        //   //     artist: 'tung duong',
        //   //   }
        //   //   await TrackPlayer.add(helperTrack)
        //   //   await TrackPlayer.skip(helperTrack.id);
        //   //   await TrackPlayer.skipToPrevious();
        //   //   await TrackPlayer.remove(helperTrack.id)
        //   // }

        //   break;
        // case TrackPlayer.STATE_NONE:
        //   console.log('state none')
        //   break;
        // case TrackPlayer.STATE_STOPPED:
        //   console.log('state stopped')
        //   break;
        default:
          break;

      }
      this.prevPlaybackState = playbackState.state;
    })
    this.onRemotePause = TrackPlayer.addEventListener('remote-pause'), () => {
      console.log('remote pause')
    }
    this.onHardwareBack = BackHandler.addEventListener('hardwareBackPress', () => {
      this.onHardwareBackPress();
    }
    );
    this.playFromYoutube()

  }
  onHardwareBackPress() {
    if (this.props.navigation && this.props.navigation.state) {
      let routeName = this.props.navigation.state.routeName;
      if (routeName === 'Play') {
        this.onDownPress();
        return;
      } else {
        TrackPlayer.destroy();
        return;
      }
    } else {
      TrackPlayer.destroy();
      return;
    }
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
        <ScrollView stickyHeaderIndices={[0, 2]}
          onScroll={({ nativeEvent }) => {
            if (!this.state.isLoading && isCloseToEdge(nativeEvent) &&
              this.props.listItem.length < 30 && this.props.listItem.length != 0) {
              this.getSuggestedNextTracks(this.props.track.id, 1, this.state.nextPageToken)
            }
          }}
          scrollEventThrottle={5000}
        >
          <Header
            message="playing from Youtube"
            onQueuePress={() => {
              getTrackQueue()
            }}
            onDownPress={this.onDownPress.bind(this)}
          />
          <AlbumArt url={!this.props.track.url ? "" : this.props.track.thumbnail.url} description={this.props.track.description} />
          <View style={{ backgroundColor: BACKGROUND_COLOR }}>
            <TrackDetails
              title={!this.props.track.title ? "" : this.props.track.title}
              channelTitle={!this.props.track.artist ? "" : this.props.track.artist}
              addToAlbumDisabled={true}
              downloadDisabled={true}
            />
            <SeekBar
              trackLength={!this.props.track.duration ? 0 : this.props.track.duration}
            />
            <PlaybackControl
              paused={this.props.paused}
              autoOn={this.props.autoOn}
              repeatOn={this.props.repeatOn}
              onPressPause={this.onPressPause.bind(this)}
              onPressPlay={this.onPressPlay.bind(this)}
              onPressRepeat={this.onPressRepeat.bind(this)}
              onPressAuto={this.onPressAuto.bind(this)}
              forwardDisabled={false}
              backwardDisabled={false}
              autoDisabled={false}
              onForward={this.playSuggestedNextVideo.bind(this)}
              onBack={this.onPressBack.bind(this)}
            />
            {/* <MiniPlayer/> */}
          </View>
          {this.props.loading ?
            <Spinner /> : <View style={{ flex: 1 }} />
          }
          {/* <Spinner
          visible={this.props.loading}
          textContent={'Loading...'}
          textStyle={styles.spinnerTextStyle}
        /> */}
          {/* <Button
            title='get current position'
            onPress={async () => {
              let position = await TrackPlayer.getPosition()
              let bufferedPosition = await TrackPlayer.getBufferedPosition()
              console.log(bufferedPosition)
              console.log(position)
            }} />
          <Button title='stop' onPress={() => { TrackPlayer.stop() }} /> */}
          <ItemsListHorizontal isLoading={this.state.isLoading}>
            {this.props.listItem.map((item, itemKey) => {
              return (
                <SquareItem
                  item={item}
                  key={itemKey}
                  style={{ marginBottom: 10 }}
                  onPress={() => {
                    this.playFromYoutube(item.id)
                    this.props.setSuggestedNextTracks([])
                  }}
                />
              )
            })}
          </ItemsListHorizontal>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  paused: state.syncPausedReducer,
  track: state.syncTrackReducer,
  loading: state.syncLoadingReducer,
  listItem: state.syncNextTrackListReducer,
  autoOn: state.syncAutoMode,
  repeatOn: state.syncRepeatMode,
});

export default connect(mapStateToProps, actions)(PlayScreen)

export { PlayScreen }
const styles = {
  spinnerTextStyle: {
    color: '#FFF'
  },
}