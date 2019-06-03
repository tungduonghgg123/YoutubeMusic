import React, { Component } from 'react';
import { Platform, SafeAreaView, ScrollView, Alert, Button } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import {
  Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl, Spinner,
  SquareItem, ItemsListHorizontal
} from '../commonComponents'
import { BACKGROUND_COLOR, COMMON_COMPONENTS_COLOR } from '../style'
//redux
import { connect } from 'react-redux';
import * as actions from '../redux/actions'
import {
  getSuggestedNextTracks, onPressBack, playSuggestedNextVideo, onPressPause,
  onPressPlay, playFromYoutube
} from '../utils'

class PlayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'youtube',
    };
    this.shouldQueueEndedEventRun = true;
  }
  componentDidMount() {
    this.props.miniPlayerOff();
    playFromYoutube(this.props.navigation.getParam('videoId'))
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
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: BACKGROUND_COLOR }}>
        <ScrollView>
          <Header
            message="playing from Youtube"
            onQueuePress={() => {
              this.props.navigation.navigate('Queue')
            }}
            onDownPress={this.onDownPress.bind(this)}
          />
          <AlbumArt url={!this.props.track.url ? "" : this.props.track.thumbnail.url} description={this.props.track.description} />
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
            onPressPause={() => {
              onPressPause()
            }}
            onPressPlay={() => {
              onPressPlay()
            }}
            onPressRepeat={this.onPressRepeat.bind(this)}
            onPressAuto={this.onPressAuto.bind(this)}
            forwardDisabled={false}
            backwardDisabled={false}
            autoDisabled={false}
            onForward={() => {
              playSuggestedNextVideo()
            }}
            onBack={() => {
              onPressBack()
            }}
            loading={this.props.loading}
          />
          <Spinner color={COMMON_COMPONENTS_COLOR} animating={this.props.loading} />
          <ItemsListHorizontal
            isLoading={this.props.nextTracksLoading}
            onCloseToEdge={() => {
              if (!this.props.nextTracksLoading && this.props.listItem.length < 30 && this.props.listItem.length != 0) {
                getSuggestedNextTracks(this.props.track.originID, 5, this.props.nextPageToken)
              }
            }}
          >
            {this.props.listItem.map((item, itemKey) => {
              return (
                <SquareItem
                  item={item}
                  key={itemKey}
                  style={{ marginBottom: 10 }}
                  onPress={() => {
                    playFromYoutube(item.id);
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
  listItem: state.syncNextTrackListReducer.nextVideos,
  nextPageToken: state.syncNextTrackListReducer.nextPageToken,
  autoOn: state.syncAutoModeReducer,
  repeatOn: state.syncRepeatModeReducer,
  miniPlayerState: state.miniPlayerReducer,
});

export default connect(mapStateToProps, actions)(PlayScreen)

export { PlayScreen }
