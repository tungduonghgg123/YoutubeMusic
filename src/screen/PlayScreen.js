import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import {
  Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl, Spinner,
  SquareItem, ItemsListHorizontal
} from '../commonComponents'
import MiniPlayer from '../commonComponents/MiniPlayer'
import { StatusBar, Button, SafeAreaView, Text, View, ScrollView, BackHandler, Alert } from 'react-native';
import axios from 'axios';
import memoize from "memoize-one";
import moment from 'moment';
import localTracks from '../storage/tracks'
import { BACKGROUND_COLOR } from '../style'
//redux
import { connect } from 'react-redux';
import * as actions from '../redux/actions'

import ReactTimeout from 'react-timeout'
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
    this.setState({ repeatOn: !this.state.repeatOn }, () => {
      if (this.state.repeatOn) {
        this.setState({ autoOn: false })
      }
    });
  }
  onPressAuto() {
    this.setState({ autoOn: !this.state.autoOn }, () => {
      if (this.state.autoOn) {
        this.setState({ repeatOn: false })
      }
    });
  }
  onDownPress() {
    let routeName = this.props.navigation.state.routeName
    switch (routeName) {
      case 'Play':
        this.props.navigation.goBack();
        this.props.miniPlayerOn();
        return true;
      default:
        return true;
    }
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
    // Removes the event handler

    this.onTrackChange.remove();
    this.onQueueEnded.remove();
    this.onPlaybackStateChange.remove();
    BackHandler.removeEventListener('hardwareBackPress', this.onDownPress);

  }
  playFromYoutube(videoId) {
    if (videoId) {
      this.memoizedLoad(videoId)
    } else {
      this.memoizedLoad(this.props.navigation.getParam('videoId'));
    }
  }
  async setNextVideos(relatedToVideoId, maxResults, pageToken) {
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

      if (data.nextTrack === 'helperTrack') {
        console.log('helper track ON')
        return;
      }
      // console.log('---------------------')
      // console.log('track changed')
      // getTrackQueue()
      let track = await TrackPlayer.getTrack(data.nextTrack);
      /**
       * sync track to redux store:
       */
      if (track) {
        this.props.addNextTracks([])
        this.setNextVideos(data.nextTrack, 7)

        this.props.syncTrack(track)
        this.props.syncPaused(false)
      } else {
        this.props.syncPaused(true)
      }
    });
    this.onQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', async (data) => {
      console.log(this.shouldQueueEndedEventRun)
      if (!this.shouldQueueEndedEventRun)
        return;
      console.log('queue ended event')
      let currentPos = await TrackPlayer.getPosition();
      let duration = await this.props.track.duration;
      /**
       * `why duration - 1 ` ??, because some tracks, 
       * the progress time is slightly larger (common is 1) than track's duration when the track ends.
       * This makes sure TRack only be changed when tt really ends.
       */
      if (currentPos <= duration - 1) {
        let buffered = await TrackPlayer.getBufferedPosition();
        currentPos = await TrackPlayer.getPosition()
        while (buffered < currentPos) {
          console.log('fired')
          TrackPlayer.play();
          this.shouldQueueEndedEventRun = false;
          TrackPlayer.play();
          // setTimeout(() => {
          //   this.shouldQueueEndedEventRun = true;
          //   console.log('after time out')
          // }, 20000)
          await timeout(20000);
          TrackPlayer.play();
          this.shouldQueueEndedEventRun = true;
          buffered = await TrackPlayer.getBufferedPosition();
          currentPos = await TrackPlayer.getPosition()

        }
        return;
      }
      if (this.state.repeatOn) {
        TrackPlayer.seekTo(0);
        this.onPressPlay()
        return;
      }
      if (this.state.autoOn) {
        this.playSuggestedNextVideo()
        return;
      }
      /**
       * `android` when Track Player'b buffered hehinds current position.
       */
      // let current = await TrackPlayer.getPosition();
      // let buffered = await TrackPlayer.getBufferedPosition();
      // if(current > buffered) {
      //   TrackPlayer.play();
      //   console.log('havent ended yet, current > buffered, need to loading ');
      //   console.log(current)
      //   console.log(buffered )
      // }
      this.props.syncPaused(true)
    });
    this.onPlaybackStateChange = TrackPlayer.addEventListener('playback-state', async (playbackState) => {
      getTrackPlayerState()
      switch (playbackState.state) {
        case TrackPlayer.STATE_PLAYING:
          this.props.syncLoading(false);
          console.log('playing')
          // this.onPressPlay()
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
    BackHandler.addEventListener('hardwareBackPress', this.onDownPress.bind(this));

    this.playFromYoutube()

  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
        <ScrollView stickyHeaderIndices={[0, 2]}
          onScroll={({ nativeEvent }) => {
            if (!this.state.isLoading && isCloseToEdge(nativeEvent) &&
              this.props.listItem.length < 30 && this.props.listItem.length != 0) {
              this.setNextVideos(this.props.track.id, 1, this.state.nextPageToken)
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
              autoOn={this.state.autoOn}
              repeatOn={this.state.repeatOn}
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
                    this.props.addNextTracks([])
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
  listItem: state.syncNextTrackListReducer
});

export default connect(mapStateToProps, actions)(PlayScreen)

