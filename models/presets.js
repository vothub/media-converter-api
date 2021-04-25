/* eslint-disable quotes,object-property-newline */
const FFMPEG_PRESETS = [
  {
    value: 'mp4-h264-720p', ext: 'mp4', name: 'MP4 - H264 @ 720p', description: '',
    tasks: [
      `ffmpeg -i $VHMC_INPUT -preset faster -crf 18 -tune zerolatency -c:v libx264 -vf format=yuv420p -vf "scale='min(1280,iw)':'min(720,ih)'" $VHMC_OUTPUT_BASE-h264-720p.mp4`,
    ]
  },
  {
    value: 'mp4-h264-1080p', ext: 'mp4', name: 'MP4 - H264 @ 1080p', description: '',
    tasks: [
      `ffmpeg -i $VHMC_INPUT -preset faster -crf 18 -tune zerolatency -c:v libx264 -vf format=yuv420p -vf "scale='min(1920,iw)':'min(1080,ih)'" $VHMC_OUTPUT_BASE-h264-1080p.mp4`,
    ]
  },
  {
    value: 'screenshots', ext: 'jpg', name: 'Screenshots (every 5s)', description: '',
    tasks: [
      // 'ffmpeg -ss 00:00:02 -i $INPUT -frames:v 1 -q:v 2 $OUTPUT_BASE.jpg'
      'ffmpeg -i $VHMC_INPUT -r 5 -s 1280x720 -f image2 screenshot-%03d-720p.jpg',
      'ffmpeg -i $VHMC_INPUT -r 5 -s 1920x1080 -f image2 screenshot-%03d-1080p.jpg',
    ]
  },
  {
    value: 'screenshots-watermark', ext: 'jpg', name: 'Screenshots with watermark (every 5s)', description: '',
    tasks: [
      'ffmpeg -i $VHMC_INPUT -r 5 -s 1280x720 -f image2 screenshot-%03d-720p.jpg',
      'ffmpeg -i $VHMC_INPUT -r 5 -s 1920x1080 -f image2 screenshot-%03d-1080p.jpg',
    ]
  },
  // {
  //   value: 'mp4-h265-1080p', ext: 'mp4', name: 'MP4 - H265 @ 1080p', description: ''
  // },
  // {
  //   value: 'ogv-1080p', ext: 'ogv', name: 'OGV @ 1080p', description: ''
  // },
  // {
  //   value: 'webm-1080p', ext: 'webm', name: 'WEBM @ 1080p', description: ''
  // },
  {
    value: 'mp3-320kbps', ext: 'mp3', name: 'MP3 @ 320kbps', description: ''
  },
  {
    value: 'mp3-192kbps', ext: 'mp3', name: 'MP3 @ 192kbps', description: ''
  },
  {
    value: 'mp3-128kbps', ext: 'mp3', name: 'MP3 @ 128kbps', description: ''
  },
  // {
  //   value: 'ogg', ext: 'ogg', name: 'OGG', description: ''
  // },
  {
    value: 'gif', ext: 'gif', name: 'GIF', description: ''
  },
];

module.exports = FFMPEG_PRESETS;
