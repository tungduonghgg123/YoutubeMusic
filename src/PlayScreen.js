import React, { Component } from 'react';
import TrackPlayer from 'react-native-track-player';
import { Header, AlbumArt, TrackDetails, SeekBar, PlaybackControl, Spinner } from './common'
import { TextInput, Button, SafeAreaView, Text, View } from 'react-native';

export default class PlayScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: true,
      duration: 0,
      isLoading: true,
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
    this.onPressPlay();
  }
  componentDidUpdate(prevProps) {
    if(prevProps.navigation.getParam('videoId') === this.props.navigation.getParam('videoId'))
      return;
    this.setState({isLoading: true})
    let track = this.initializeTrack(
      'unique track id',
      `https://youtubemusicbackend.herokuapp.com/play/${this.props.navigation.getParam('videoId')}`
    )
    this.addAndPlay(track);
    
  }
  componentDidMount() {
    this.setState({isLoading: true})
    let track = this.initializeTrack(
      'unique track id',
      `https://youtubemusicbackend.herokuapp.com/play/${this.props.navigation.getParam('videoId')}`
    )
    this.addAndPlay(track);
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
        />
        {this.state.isLoading?
          <Spinner/> : <View/>
        }
      </SafeAreaView>
    );
  }
}