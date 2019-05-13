import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl, Spinner } from '../commonComponents'
import { TextInput, Button, SafeAreaView, Text, View,Alert } from 'react-native';
import axios from 'axios';
import memoize from "memoize-one";
import moment from 'moment';
import localTracks from '../storage/tracks'
//redux
import {connect} from 'react-redux';
import * as actions from '../redux/actions'




class PlayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shuffleOn: false,
      repeatOn: false,
      mode: 'youtube'
    };
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
    this.setState((state) => {
      return { repeatOn: !this.state.repeatOn }
    })
  }
  async onPressBack() {
    await TrackPlayer.skipToPrevious();
  }
  async onPressForward() {
    await TrackPlayer.skipToNext();
  }
  async getTheTrackQueue() {
    let tracks = await TrackPlayer.getQueue();
    console.log(tracks)
    TrackPlayer.getState().then((result) => console.log(result))

  }
  memoizedLoad = memoize(async (videoId) => {
    if (!videoId)
      return;
    /**
     * pause Track Player before loading and playing new Track.
     *  */  
    this.onPressPause()
    this.props.syncLoading(true)
    let track = await this.initializeTrack(videoId)
    this.addAndPlay(track)
  })
  async addAndPlay(track) {
    await TrackPlayer.add(track)
    /**
     * skip to this `track` by using `track id`
     */
    await TrackPlayer.skip(track.id)
    this.onPressPlay();
  }
  /**
   * 
   * @param {youtube video id} videoId 
   */
  initializeTrack(videoId) {
    return axios.get('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet,statistics,contentDetails',
        id: videoId,
        fields: 'items(id,snippet,statistics(viewCount),contentDetails(duration))',
        key: process.env.YOUTUBE_API_KEY
      }
    }).then(response => {
      let duration = response.data.items[0].contentDetails.duration;
      const track = {
        id: videoId,
        url: `http://119.81.246.233:3000/play/${videoId}`, // Load media from server
        title: response.data.items[0].snippet.title,
        artist: response.data.items[0].snippet.channelTitle,
        description: response.data.items[0].snippet.description,
        date: response.data.items[0].snippet.publishedAt,
        thumbnail: {
          url: response.data.items[0].snippet.thumbnails.medium.url
        },
        duration: moment.duration(duration).asSeconds()
      };
      this.props.syncTrack(track)
      return track;
    })
      .catch(error => console.log(error))
  }
  
  
  

  async componentDidMount() {

    this.onTrackChange = TrackPlayer.addEventListener('playback-track-changed', async (data) => {
      if(data.nextTrack === 'helperTrack') {
        console.log('helper track ON')
        return;
      }
      console.log('---------------------')
      // console.log('track changed')
      this.getTheTrackQueue()
      let track = await TrackPlayer.getTrack(data.nextTrack);
      /**
       * sync track to redux store:
       */
      this.props.syncTrack(track)
      this.props.syncPaused(false)
    });
    this.onQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', async (data) => {
      console.log('queue ended')
      if (this.state.repeatOn) {
        TrackPlayer.seekTo(0);
        this.onPressPlay()
        return;
      }
      this.props.syncPaused(true)
    });
    this.onPlaybackStateChange = TrackPlayer.addEventListener('playback-state', async (playbackState) => {
      
      console.log(JSON.stringify(playbackState));
      switch (playbackState.state) {
        case 'playing':
          // this.setState({isLoading: false})
          this.props.syncLoading(false)
          break;
        case 'loading':
          
          // if(this.prevPlaybackState === 'playing'){
          //   let helperTrack = {
          //     id: 'helperTrack', 
          //     url: 'somellink',
          //     title: 'helper Title', 
          //     artist: 'tung duong',
          //   }
          //   await TrackPlayer.add(helperTrack)
          //   await TrackPlayer.skip(helperTrack.id);
          //   await TrackPlayer.skipToPrevious();
          //   await TrackPlayer.remove(helperTrack.id)
          // }
            
          break;
        default:
          break;
        
      }
      this.prevPlaybackState = playbackState.state;
    })
    this.onRemotePause = TrackPlayer.addEventListener('remote-pause'), () => {
      console.log('remote pause')
    }
    this.playFromYoutube()
    
  }
  async componentDidUpdate() {
    this.playFromYoutube()
  }
  playFromYoutube() {
    this.memoizedLoad(this.props.navigation.getParam('videoId'));
  }
  /**
   * not working at the moment.
   */
  playFromLocal() {
    TrackPlayer.add(localTracks).then(() => {
      console.log('track added');
      this.onPressPlay()
    })

  }
  componentWillUnmount() {
    // Removes the event handler
    /**
     * `weird`: this will be invoked when transition.
     */
    
    this.onTrackChange.remove();
    this.onQueueEnded.remove();
    this.onPlaybackStateChange.remove();
    
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'grey' }}>
        <Header
          message="playing from Youtube"
          onQueuePress={this.getTheTrackQueue.bind(this)}
          onDownPress={() => {
            this.props.navigation.goBack();
            this.props.miniPlayerOn();
          }}
        />
        <AlbumArt url={!this.props.track.url ? "" : this.props.track.thumbnail.url} />
        <TrackDetails
          title={!this.props.track.title ? "" : this.props.track.title}
          onLayout={(event) => {
            console.log(event)
          }}
        />
        <SeekBar
          trackLength={!this.props.track.duration ? 0 : this.props.track.duration}
        />
        <PlaybackControl
          paused={this.props.paused}
          shuffleOn={this.state.shuffleOn}
          repeatOn={this.state.repeatOn}
          onPressPause={this.onPressPause.bind(this)}
          onPressPlay={this.onPressPlay.bind(this)}
          onPressRepeat={this.onPressRepeat.bind(this)}
          forwardDisabled={false}
          backwardDisabled={false}
          shuffleDisabled={true}
          onForward={this.onPressForward.bind(this)}
          onBack={this.onPressBack.bind(this)}
        />
        {this.props.loading ?
          <Spinner /> : <View style={{flex:1}} />
        }
       
        {/* <Button title='remove current' onPress={async() => {
          await TrackPlayer.remove("Llw9Q6akRo4")

        }}/> */}

      </SafeAreaView>
    );
  }
}
const mapStateToProps = state => ({
  paused: state.syncPausedReducer,
  track: state.syncTrackReducer,
  loading: state.syncLoadingReducer
});

export default connect(mapStateToProps, actions)(PlayScreen)