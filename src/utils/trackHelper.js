const SEPERATOR = '_';
import axios from 'axios';
import moment from 'moment';
import TrackPlayer from 'react-native-track-player';
export async function getTrackPlayerState() {
  let state = await TrackPlayer.getState()
  switch (state) {
    case TrackPlayer.STATE_PLAYING:
      console.log('playing')
      break;
    case TrackPlayer.STATE_PAUSED:
      console.log('paused')
      break;
    case TrackPlayer.STATE_BUFFERING:
      console.log('buffering')
      break;
    case TrackPlayer.STATE_NONE:
      console.log('state none')
      break;
    case TrackPlayer.STATE_STOPPED:
      console.log('state stopped')
      break;
    default:
      console.log('state not found')
      break;
  }
}
export function getTrackQueue() {
  return new Promise((resolve, reject) => {
    TrackPlayer.getQueue().then((tracks) => {
      resolve(tracks)
    }, (error) => {
      console.log(error)
    })
  })
}
/**
 * 
 * @param {videoId of track} videoId 
 * get required properties to play a track
 */
export function getTrackDetails(videoId) {
  return new Promise((resolve, reject) => {
    axios.get('https://content.googleapis.com/youtube/v3/videos', {
      headers: { "X-Origin": "https://explorer.apis.google.com" },
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
      resolve(track);
    })
      .catch(error => {
        console.log(error)
      })
  })
}
/**
 * 
 * @param {*} videoId 
 * just get informations to show up.
 */
function getVideoInfo(videoId) {
  return new Promise((resolve, reject) => {
    axios.get('https://content.googleapis.com/youtube/v3/videos', {
      headers: { "X-Origin": "https://explorer.apis.google.com" },
      params: {
        part: "snippet,statistics,contentDetails",
        id: videoId,
        fields: 'items(id,snippet,statistics(viewCount),contentDetails(duration))',
        key: process.env.YOUTUBE_API_KEY
      }
    }).then((response) => {
      resolve(response.data.items)
    }).catch((error) => {
      console.log(error)
    })
  })
}
/**
 * get next videos related to video id. 
 */

export function getNextVideos(relatedToVideoId, maxResults, pageToken) {
  return new Promise((resolve, reject) => {
    axios.get('https://content.googleapis.com/youtube/v3/search', {
      headers: { "X-Origin": "https://explorer.apis.google.com" },
      params: {
        part: 'snippet',
        maxResults: maxResults,
        type: 'video',
        relatedToVideoId: relatedToVideoId,
        pageToken: pageToken,
        key: process.env.YOUTUBE_API_KEY
      }
    }).then(response => {
      const videoIds = response.data.items.map(item => item.id.videoId)
      getVideoInfo(videoIds.join())
        .then((videos) => {
          let nextVideos = videos.map(video => {
            video.contentDetails.duration = formatDuration(video.contentDetails.duration);
            video.statistics.viewCount = numberFormatter(video.statistics.viewCount);
            return video;
          })
          resolve({
            nextVideos,
            nextPageToken: response.data.nextPageToken
          })
        })
    }).catch((error) => {
      console.log(error)
    })
  })
};
export function getVideosHomeScreen(maxResults, pageToken) {
  return new Promise((resolve, reject) => {
    axios.get('https://content.googleapis.com/youtube/v3/videos', {
      headers: { "X-Origin": "https://explorer.apis.google.com" },
      params: {
        part: 'snippet,statistics,contentDetails',
        fields: 'nextPageToken,items(id,snippet,statistics(viewCount),contentDetails(duration))',
        chart: 'mostPopular',
        regionCode: 'VN',
        maxResults: maxResults,
        pageToken: pageToken,
        key: process.env.YOUTUBE_API_KEY
      }
    }).then(response => {
      let videos = [];
      response.data.items.map(video => {
        if (video.snippet.categoryId == '10') {
          axios.get(`http://119.81.246.233:3000/load/${video.id}`).then().catch(error => console.log(error.message))
          video.contentDetails.duration = formatDuration(video.contentDetails.duration);
          video.statistics.viewCount = numberFormatter(video.statistics.viewCount);
          videos.push(video)
        }
      })
      resolve({
        videos,
        nextPageToken: response.data.nextPageToken,
      })
    }).catch((error) => {
      console.log(error)
    })

  })
}
export function getTrackOriginID(id) {
  const indexOfSeperator = id.indexOf(SEPERATOR);
  return id.slice(indexOfSeperator + 1);
}
export async function getPreviousTrack() {
  let current = await TrackPlayer.getCurrentTrack();
  let queue = await TrackPlayer.getQueue();
  let indexOfCurrent = -1;
  for (let i = 0; i < queue.length; i++) {
    let track = queue[i];
    if (track.id === current) {
      indexOfCurrent = i;
      break;
    }
  }
  switch (indexOfCurrent) {
    case -1:
      console.log('current track is not found in queue');
      return {
        eligible: false,
        id: -1
      };
    case 0:
      console.log('there is no previous track');
      return {
        eligible: false,
        id: -1
      };
    default:
      console.log('you can go back')
      let id = queue[indexOfCurrent - 1].id;
      return {
        eligible: true,
        id
      };
  }
}
export async function getComingTrackInQueue(){
  
}
export async function resetSeekBar(){
  return TrackPlayer.seekTo(0);

}
function formatDuration(duration) {
  const durationObj = moment.duration(duration);
  return durationObj.asHours() < 1 ? moment(durationObj._data).format("m:ss") : moment(durationObj._data).format("H:mm:ss");
}
function numberFormatter(num, digits) {
  var si = [
    { value: 1, symbol: "" },
    { value: 1E3, symbol: "K" },
    { value: 1E6, symbol: "M" },
    { value: 1E9, symbol: "B" }
  ];
  for (var i = si.length - 1; i > 0; i--) {
    if (num >= si[i].value) {
      break;
    }
  }
  var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  return (num / si[i].value).toFixed(digits).replace(rx, "$1") + si[i].symbol;
}
/**
 * not working at the moment.
 */
function playFromLocal() {
  TrackPlayer.add(localTracks).then(() => {
    console.log('track added');
    this.onPressPlay()
  })
}