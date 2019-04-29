import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl, Spinner } from './common'
import { TextInput, Button, SafeAreaView, Text, View } from 'react-native';

let HARDCODEtracks = [
  {
    id: "4ZbQffYdhj0", // Must be a string, required
    url: "https://youtubemusicbackend.herokuapp.com/play/4ZbQffYdhj0", // Load media from heroku
    // url: require('../WhoAreYou.mp3'),
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
  },
  {
    id: '6KJrNWC0tfw', // Must be a string, required
    url: "https://youtubemusicbackend.herokuapp.com/play/6KJrNWC0tfw", // Load media from heroku
    // url: require('../WhoAreYou.mp3'),
    title: 'Avaritia',
    artist: 'deadmau5',
    album: 'while(1<2)',
    genre: 'Progressive House, Electro House',
    date: '2014-05-20T07:00:00+00:00', // RFC 3339
  },
]
export default class PlayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: true,
      duration: 0,
      isLoading: false,
      message: ''
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
  initializeTrack(id, url) {
    return {
      id: id, // Must be a string, required
      url: url, // Load media from heroku
      // url: require('../WhoAreYou.mp3'),
      title: 'Avaritia',
      artist: 'deadmau5',
      album: 'while(1<2)',
      genre: 'Progressive House, Electro House',
      date: '2014-05-20T07:00:00+00:00', // RFC 3339
    };
  }
  addAndPlay(track) {
    TrackPlayer.add(track).then(async () => {
      let state = await TrackPlayer.getState();
      this.setState({isLoading: false})
      let duration = await TrackPlayer.getDuration();
      this.setState({ duration: Math.round(duration) })
    });
    TrackPlayer.skip(track.id).then(() => console.log('success'))
    this.onPressPlay();
  }
  componentDidUpdate(prevProps) {
    let videoId = this.props.navigation.getParam('videoId');
    if(prevProps.navigation.getParam('videoId') === videoId)
      return;
    TrackPlayer.pause();
    this.setState({isLoading: true})
    let track = this.initializeTrack(
      videoId,
      `https://youtubemusicbackend.herokuapp.com/play/${videoId}`
    )
    this.addAndPlay(track);
  }
  componentDidMount() {
    if(!this.props.navigation.getParam('videoId'))
      return;
    this.setState({isLoading: true})
    let track = this.initializeTrack(
      this.props.navigation.getParam('videoId'),
      `https://youtubemusicbackend.herokuapp.com/play/${this.props.navigation.getParam('videoId')}`
    )
    this.addAndPlay(track)
    // this.addAndPlay(HARDCODEtracks);

  }
  async getTheTrackQueue() {
    let tracks = await TrackPlayer.getQueue();
    console.log(tracks)
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'gray' }}>
        <Header
          message="playing from Youtube"
        />
        <AlbumArt />
        <TrackDetails
          title='Sunflower'
        />
        <SeekBar
          trackLength={this.state.duration}
          
        />
        <PlaybackControl
          paused={this.state.paused}
          onPressPause={this.onPressPause.bind(this)}
          onPressPlay={this.onPressPlay.bind(this)}
          onForward={() => {TrackPlayer.skipToNext().then((result) => console.log('skip success'))}}
          onBack={() => {TrackPlayer.skipToPrevious().then((result) => console.log('skip success'))}}

        />
        {this.state.isLoading?
          <Spinner/> : <View/>
        }
    
      </SafeAreaView>
    );
  }
}