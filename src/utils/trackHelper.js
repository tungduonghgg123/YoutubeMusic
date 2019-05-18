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
  TrackPlayer.getQueue().then((tracks) => {
    console.log(tracks)
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
      .catch(error => reject(error))
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
      reject(error)
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
        console.log(nextVideos)
        resolve({
          nextVideos, 
          nextPageToken: response.data.nextPageToken
        })
      })
    })
  })
};
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