import React, { Component } from 'react';
import { StatusBar, Button, SafeAreaView, Text, View, ScrollView, Alert } from 'react-native';
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
import { isCloseToEdge, getTrackDetails, getNextVideos, getTrackQueue } from '../utils'

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
    this.playFromYoutube()
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
    this.props.navigation.goBack();
    this.props.miniPlayerOn();
    return true;
  }
  async onPressBack() {
    await TrackPlayer.skipToPrevious();
  }
  playSuggestedNextVideo() {
    console.log('called')
    console.log(this.props.listItem[0])
    if (this.props.listItem[0] && this.props.listItem[0].id) {
      console.log('inside playSuggestedNextVideo nested if-statement')
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
    console.log('called from memoized load')
    this.onPressPause()
    this.props.syncLoading(true)
    let track = await getTrackDetails(videoId)
    this.addAndPlay(track)
  })
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
        await TrackPlayer.skip(track.id)
        this.onPressPlay();
      })
    }
  }

  playFromYoutube(videoId) {

    if (videoId) {
      this.memoizedLoad(videoId)
    } else {
      this.memoizedLoad(this.props.navigation.getParam('videoId'));
    }
  }
  async getSuggestedNextTracks(relatedToVideoId, maxResults, pageToken) {
    this.props.syncLoading(true)
    let { nextVideos, nextPageToken } = await getNextVideos(relatedToVideoId, maxResults, pageToken);
    this.props.appendNextTracks(nextVideos);
    this.setState({
      nextPageToken: nextPageToken,
    })
    this.props.syncLoading(false)
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
        <ScrollView stickyHeaderIndices={[0, 2]}
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
          </View>
          {this.props.loading ?
            <Spinner /> : <View style={{ flex: 1 }} />
          }
          <Button
            title='get current position'
            onPress={async () => {
              let position = await TrackPlayer.getPosition()
              let bufferedPosition = await TrackPlayer.getBufferedPosition()
              console.log(bufferedPosition)
              console.log(position)
            }} />
          <Button title='stop' onPress={() => { TrackPlayer.stop() }} />
          <ItemsListHorizontal isLoading={this.state.isLoading}>
            {this.props.listItem.map((item, itemKey) => {
              return (
                <SquareItem
                  item={item}
                  key={itemKey}
                  style={{ marginBottom: 10 }}
                  onPress={() => {
                    this.props.syncTrackID(item.id);
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
  autoOn: state.syncAutoModeReducer,
  repeatOn: state.syncRepeatModeReducer,
  miniPlayerState: state.miniPlayerReducer,
  trackID: state.syncTrackIDReducer
});

export default connect(mapStateToProps, actions)(PlayScreen)

export { PlayScreen }
