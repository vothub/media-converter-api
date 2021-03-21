/* eslint-disable quotes,object-property-newline */
const AVAILABLE_PRESETS = [
  {
    value: 'mp4-h264:1080p', ext: 'mp4', name: 'MP4 - H264 @ 1080p', description: '',
    tasks: [
      'ffmpeg -i input.wmv -preset faster -crf 18 -tune zerolatency -c:v libx264 -vf format=yuv420p output.mp4',
    ]
  },
  {
    value: 'mp4-h264:1080p;screenshots', ext: 'mp4', name: 'MP4 - H264 @ 1080p + screenshots', description: '',
    tasks: [
      'ffmpeg -ss 00:00:02 -i $INPUT -frames:v 1 -q:v 2 $OUTPUT_BASE.jpg',
      `ffmpeg -i $INPUT -preset faster -crf 18 -tune zerolatency -c:v libx264 -vf format=yuv420p -vf "scale='min(1920,iw)':'min(1080,ih)'" $OUTPUT_BASE.mp4`,
    ]
  },
  {
    value: 'mp4-h265:1080p', ext: 'mp4', name: 'MP4 - H265 @ 1080p', description: ''
  },
  {
    value: 'mp4-h265:1080p;screenshots', ext: 'mp4', name: 'MP4 - H265 @ 1080p + screenshots', description: ''
  },
  {
    value: 'ogv:1080p', ext: 'ogv', name: 'OGV @ 1080p', description: ''
  },
  {
    value: 'ogv:1080p;screenshots', ext: 'ogv', name: 'OGV @ 1080p + screenshots', description: ''
  },
  {
    value: 'webm:1080p', ext: 'webm', name: 'WEBM @ 1080p', description: ''
  },
  {
    value: 'mp3:192', ext: 'mp3', name: 'MP3 @ 192kbps', description: ''
  },
  {
    value: 'ogg', ext: 'ogg', name: 'OGG', description: ''
  },
  {
    value: 'gif', ext: 'gif', name: 'GIF', description: ''
  },
];

module.exports = AVAILABLE_PRESETS;
