import React, { Component } from 'react';
import { Platform, Button, SafeAreaView, Text, View, ScrollView, Alert } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import memoize from "memoize-one";
import {
  Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl, Spinner,
  SquareItem, ItemsListHorizontal
} from '../commonComponents'
import { BACKGROUND_COLOR, COMMON_COMPONENTS_COLOR } from '../style'
//redux
import { connect } from 'react-redux';
import * as actions from '../redux/actions'
import {
  isCloseToEdge, getTrackDetails, getNextVideos, getTrackQueue,
  getPreviousTrack, getTrackOriginID, resetSeekBar
} from '../utils'

class PlayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'youtube',
      nextPageToken: '',
    };
    this.shouldQueueEndedEventRun = true;
  }
  componentDidMount() {
    this.props.miniPlayerOff();
    this.playFromYoutube(this.props.navigation.getParam('videoId'))
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
  }
  onPressAuto() {
    this.props.autoReverse();
  }
  onDownPress() {
    this.props.navigation.goBack();
    this.props.miniPlayerOn();
    return true;
  }
  async onPressBack() {
    let { eligible, id } = await getPreviousTrack();
    if (eligible) {
      let prevTrack = await TrackPlayer.getTrack(id);
      this.onPlaybackTrackChanged(getTrackOriginID(id), prevTrack)
      await TrackPlayer.skipToPrevious();
    } else {
      Alert.alert('Oop', 'There is no previous track!')
    }
  }
  playSuggestedNextVideo() {
    if (this.props.listItem[0] && this.props.listItem[0].id) {
      let videoId = this.props.listItem[0].id;
      this.playFromYoutube(videoId)
    }
  }
  addAndPlay(track) {
    if (track && track.id) {
      getTrackQueue().then(async (tracks) => {
        let numTrack = tracks.length;
        /**
         * `track.originID` this is the real VIDEO ID from youtube.
         * It will be used for fetching `related videos `  from youtube
         */
        track.originID = track.id;
        /**
         * `Modify track ID's PURPOSE:` Because each `video ID` on `Track Player` is needed to be `unique`.
         * Example: When there are two `identical track`.
         */
        track.id = numTrack + '_' + track.id;
        await TrackPlayer.add(track)
        this.onPlaybackTrackChanged(track.originID, track)
        await TrackPlayer.skip(track.id)
      })
    }
  }
  onPlaybackTrackChanged(id, track) {
    // console.log('track changed')
    this.props.syncTrack(track)
    this.props.setSuggestedNextTracks([])
    this.getSuggestedNextTracks(id, 7)
  }

  async playFromYoutube(videoId) {
    if (!videoId)
      return;
    /**
     * pause Track Player before loading and playing new Track.
     *  */
    if (Platform.OS === 'ios') {
      this.onPressPause()
    } else {
      this.props.syncPaused(true)
    }
    this.props.syncLoading(true)
    let track = await getTrackDetails(videoId)
    this.addAndPlay(track)
  }
  async getSuggestedNextTracks(relatedToVideoId, maxResults, pageToken) {
    this.props.syncLoadingNextTracks(true)
    let { nextVideos, nextPageToken } = await getNextVideos(relatedToVideoId, maxResults, pageToken);
    this.props.appendNextTracks(nextVideos);
    this.setState({
      nextPageToken: nextPageToken,
    })
    this.props.syncLoadingNextTracks(false)
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
        <ScrollView 
          onScroll={({ nativeEvent }) => {
            if (!this.state.isLoading && isCloseToEdge(nativeEvent) &&
              this.props.listItem.length < 30 && this.props.listItem.length != 0) {
              this.getSuggestedNextTracks(this.props.track.originID, 1, this.state.nextPageToken)
            }
          }}
          scrollEventThrottle={5000}
        >
          <Header
            message="playing from Youtube"
            onQueuePress={() => {
              this.props.navigation.navigate('Queue')
            }}
            onDownPress={this.onDownPress.bind(this)}
          />
          <AlbumArt url={!this.props.track.url ? "" : this.props.track.thumbnail.url} description={this.props.track.description} />
          {/* <AlbumArt url={!this.props.track.url ? "" : this.props.track.thumbnail.url} description='tung duong'/> */}

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

          <Spinner color={COMMON_COMPONENTS_COLOR} animating={this.props.loading} />
          <ItemsListHorizontal isLoading={this.state.nextTracksLoading}>
            {this.props.listItem.map((item, itemKey) => {
              return (
                <SquareItem
                  item={item}
                  key={itemKey}
                  style={{ marginBottom: 10 }}
                  onPress={() => {
                    this.playFromYoutube(item.id);
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
  nextTracksLoading: state.syncLoadingNextTracks,
  listItem: state.syncNextTrackListReducer,
  autoOn: state.syncAutoModeReducer,
  repeatOn: state.syncRepeatModeReducer,
  miniPlayerState: state.miniPlayerReducer,
});

export default connect(mapStateToProps, actions)(PlayScreen)

export { PlayScreen }
