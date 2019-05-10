import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl, Spinner, MiniPlayer } from './common'
import { TextInput, Button, SafeAreaView, Text, View,Alert } from 'react-native';
import axios from 'axios';
import memoize from "memoize-one";
import moment from 'moment';
// import Example from '/Users/duongtung/Workspace/YoutubeMusic/playground/runningText.js'
import localTracks from './storage/tracks'



export default class PlayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      track: null,
      paused: true,
      duration: 0,
      isLoading: false,
      shuffleOn: false,
      repeatOn: true,
      mode: 'youtube'
    };

  }
  onPressPause() {
    this.setState({ paused: true });
    TrackPlayer.pause();
  }
  onPressPlay() {
    this.setState({ paused: false })
    TrackPlayer.play();
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
    // TrackPlayer.getState().then((result) => console.log(result))

  }
  memoizedLoad = memoize(async (videoId) => {
    if (!videoId)
      return;
    /**
     * pause Track Player before loading and playing new Track.
     *  */  
    TrackPlayer.pause();
    this.setState({ isLoading: true })
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
      // console.log('---------------------')
      console.log('track changed')
      this.getTheTrackQueue()
      let track = await TrackPlayer.getTrack(data.nextTrack);
      this.setState({ track });
      this.setState({ paused: false});
    });
    this.onQueueEnded = TrackPlayer.addEventListener('playback-queue-ended', async (data) => {
      console.log('queue ended')
      if (this.state.repeatOn) {
        TrackPlayer.seekTo(0);
        this.onPressPlay()
        return;
      }
      this.setState({ paused: true });
    });
    this.onPlaybackStateChange = TrackPlayer.addEventListener('playback-state', async (playbackState) => {
      
      console.log(JSON.stringify(playbackState));
      switch (playbackState.state) {
        case 'playing':
          this.setState({isLoading: false})
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
    this.onTrackChange.remove();
    this.onQueueEnded.remove();
    this.onRemotePause.remove();
    this.onRemotePlay.remove();
    this.onPlaybackStateChange.remove();
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'gray' }}>
        <Header
          message="playing from Youtube"
          onQueuePress={this.getTheTrackQueue.bind(this)}
          onDownPress={() => {
            this.props.navigation.goBack()
          }}
        />
        <AlbumArt url={!this.state.track ? "" : this.state.track.thumbnail.url} />
        <TrackDetails
          title={!this.state.track ? "" : this.state.track.title.slice(0, 30)}
        />
        <SeekBar
          trackLength={!this.state.track ? 0 : this.state.track.duration}
        />
        <PlaybackControl
          paused={this.state.paused}
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
        {this.state.isLoading ?
          <Spinner /> : <View style={{flex:1}} />
        }
        <MiniPlayer
          message = {!this.state.track ? "" : this.state.track.title.slice(0, 30)}
          paused= {this.state.paused}
          onPressPause={this.onPressPause.bind(this)}
          onPressPlay={this.onPressPlay.bind(this)}
          trackLength={!this.state.track ? 0 : this.state.track.duration}
        />

        {/* <Example text = "zxgvjhbasdljgabsgkasjhgasukdghalsiughasiudhgakshgkajshbgkjashglkjashg"/>

        <Button title='remove current' onPress={async() => {
          await TrackPlayer.remove("Llw9Q6akRo4")

        }}/> */}

      </SafeAreaView>
    );
  }
}